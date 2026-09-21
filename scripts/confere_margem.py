#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Confere se um elemento de motion respeita a margem de seguranca do quadro.

Generico: a cor e parametro, nao tem nada de marca.

Serve para a classe de defeito que nao aparece no `tsc` nem numa olhada rapida
no meio do video: **o elemento sai pela borda**. Num balao posicionado por
ancora, basta a frase ficar um pouco mais longa para o fim dela ser cortado, e
so quem olha o canto do quadro percebe.

Como funciona: amostra frames ao longo do video, acha a caixa que envolve os
pixels da cor pedida e avisa se ela chega perto demais da borda.

**A cor precisa ser distinguivel do plano de fundo.** Medir um campo cinza
escuro (#1F2C33) sobre um quarto sem luz devolveu a caixa do quadro inteiro e
um "falhou" que nao existia: com a tolerancia, o fundo casava com o alvo.
Quando o elemento nao tem cor propria, medir uma parte dele que tenha, como um
botao de acento, e ler o resultado sabendo que a caixa e so daquela parte.

Uso:
    python3 confere_margem.py video.mp4 --cor 005C4B --margem 60
    python3 confere_margem.py video.mp4 --cor 005C4B --frames 12 --tolerancia 26
"""
import argparse
import os
import subprocess
import sys
import tempfile

try:
    from PIL import Image
except ImportError:
    sys.exit("falta a pillow: pip install pillow")


def hex_rgb(h):
    h = h.lstrip("#")
    if len(h) != 6:
        sys.exit("cor deve ser um hex de 6 digitos, ex.: 005C4B")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def caixa_da_cor(caminho, alvo, tol, passo):
    """Caixa que envolve os pixels proximos da cor, ou None se nao houver."""
    im = Image.open(caminho).convert("RGB")
    L, A = im.size
    px = im.load()
    ar, ag, ab = alvo
    minx, miny, maxx, maxy = L, A, -1, -1
    for y in range(0, A, passo):
        for x in range(0, L, passo):
            r, g, b = px[x, y]
            if abs(r - ar) <= tol and abs(g - ag) <= tol and abs(b - ab) <= tol:
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
    if maxx < 0:
        return None, (L, A)
    return (minx, miny, maxx, maxy), (L, A)


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("video")
    a.add_argument("--cor", required=True, help="hex do elemento, ex.: 005C4B")
    a.add_argument("--margem", type=int, default=60,
                   help="quantos px o elemento deve manter das bordas")
    a.add_argument("--frames", type=int, default=10, help="quantos frames amostrar")
    a.add_argument("--tolerancia", type=int, default=26,
                   help="distancia aceita em cada canal (a compressao mexe na cor)")
    a.add_argument("--passo", type=int, default=2, help="amostragem de pixels")
    a = a.parse_args()

    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", a.video],
                         capture_output=True, text=True).stdout.strip()
    if not dur:
        sys.exit("nao consegui medir a duracao de " + a.video)
    dur = float(dur)
    alvo = hex_rgb(a.cor)
    tmp = tempfile.mkdtemp()
    falhas = []

    print("%-8s %-28s %s" % ("tempo", "caixa do elemento", "folga ate a borda"))
    for i in range(a.frames):
        t = dur * (i + 0.5) / a.frames
        png = os.path.join(tmp, "f%02d.png" % i)
        subprocess.run(["ffmpeg", "-v", "error", "-ss", "%.3f" % t, "-i", a.video,
                        "-frames:v", "1", "-y", png], capture_output=True)
        if not os.path.exists(png):
            continue
        caixa, (L, A) = caixa_da_cor(png, alvo, a.tolerancia, a.passo)
        os.remove(png)
        if caixa is None:
            print("%-8.2f %-28s %s" % (t, "(elemento ausente)", "-"))
            continue
        x0, y0, x1, y1 = caixa
        folgas = {"esq": x0, "dir": L - 1 - x1, "topo": y0, "base": A - 1 - y1}
        pior = min(folgas, key=lambda k: folgas[k])
        marca = ""
        if folgas[pior] < a.margem:
            marca = "  <-- %s com %dpx, abaixo de %d" % (pior, folgas[pior], a.margem)
            falhas.append((t, pior, folgas[pior]))
        print("%-8.2f %-28s %s%s" % (
            t, "x %d..%d  y %d..%d" % (x0, x1, y0, y1),
            " ".join("%s=%d" % (k, v) for k, v in folgas.items()), marca))

    os.rmdir(tmp)
    if falhas:
        print("\nFALHOU: %d frame(s) com o elemento perto demais da borda." % len(falhas))
        sys.exit(1)
    print("\nOK: o elemento respeita %d px de margem em todos os frames amostrados." % a.margem)


if __name__ == "__main__":
    main()
