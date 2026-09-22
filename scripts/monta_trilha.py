#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mistura uma trilha num filme ja renderizado sem leito musical.

Generico: a curva de volume e parametro, nao tem nada de marca.

Existe para **comparar trilhas sem re-renderizar**. Renderizar o filme uma vez
por candidata custa dez minutos cada e, pior, deixa a duvida de se a diferenca
que se ouve e a musica ou algum detalhe do render. Misturando por fora, a unica
coisa que muda entre as versoes e a faixa.

Dois cuidados que decidem se a comparacao vale alguma coisa:

  * **Igualar o nivel das candidatas antes de comparar.** Faixas geradas saem
    com volumes medios diferentes entre si; sem normalizar, quem escuta escolhe
    a mais alta achando que escolheu a mais bonita. O `--alvo-dbfs` traz todas
    para o mesmo ponto de partida.
  * **A curva tem que ser a mesma do render.** Aqui ela e reproduzida como
    expressao de `volume` avaliada por frame, com os mesmos numeros da
    montagem: sobe, desce para o leito quando a narracao comeca, sai no fim.

Uso:
    python3 monta_trilha.py filme.mp4 trilha.mp3 saida.mp4 \\
        --alto 0.42 --leito 0.26 --fade 2.5 --desce-em 1.2 --desce-ate 2.6
"""
import argparse
import re
import subprocess
import sys


def roda(args):
    return subprocess.run(args, capture_output=True, text=True)


def dur(caminho):
    out = roda(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "csv=p=0", caminho]).stdout.strip()
    return float(out) if out else 0.0


def media_dbfs(caminho):
    r = roda(["ffmpeg", "-hide_banner", "-nostats", "-i", caminho,
              "-af", "volumedetect", "-f", "null", "-"])
    m = re.search(r"mean_volume: (-?[\d.]+)", r.stderr)
    return float(m.group(1)) if m else None


def curva(alto, leito, fade, desce_em, desce_ate, total):
    """A mesma curva do `volumeTrilha` da montagem, como expressao do ffmpeg.

    min(entrada, leito) * saida, com as tres rampas lineares e presas nas
    pontas. Escrita por extenso de proposito: expressao de volume que ninguem
    consegue ler vira numero magico na primeira revisao.
    """
    entrada = "%s*min(t/%s,1)" % (alto, fade)
    desce = "%s+(%s-%s)*max(0,min((t-%s)/%s,1))" % (
        alto, leito, alto, desce_em, desce_ate - desce_em)
    saida = "(1-max(0,min((t-%s)/%s,1)))" % (total - fade, fade)
    return "min(%s,%s)*%s" % (entrada, desce, saida)


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("filme", help="mp4 ja renderizado, com locucao e efeitos e SEM trilha")
    a.add_argument("trilha")
    a.add_argument("saida")
    a.add_argument("--alto", type=float, default=0.42)
    a.add_argument("--leito", type=float, default=0.26)
    a.add_argument("--fade", type=float, default=2.5)
    a.add_argument("--desce-em", type=float, default=1.2)
    a.add_argument("--desce-ate", type=float, default=2.6)
    a.add_argument("--alvo-dbfs", type=float, default=None,
                   help="normaliza a trilha para esta media antes de aplicar a curva")
    a.add_argument("--escala", default=None,
                   help='redimensiona o video, ex.: "854:480". Omitir copia o video.')
    a = a.parse_args()

    total = dur(a.filme)
    if total <= 0:
        sys.exit("nao consegui medir " + a.filme)

    ganho = ""
    if a.alvo_dbfs is not None:
        m = media_dbfs(a.trilha)
        if m is None:
            sys.exit("nao consegui medir o nivel de " + a.trilha)
        ganho = "volume=%.2fdB," % (a.alvo_dbfs - m)
        print("  nivel medido %.1f dB, ajuste %+.1f dB" % (m, a.alvo_dbfs - m))

    filtro = (
        "[1:a]%svolume='%s':eval=frame[bed];"
        "[0:a][bed]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a]"
        % (ganho, curva(a.alto, a.leito, a.fade, a.desce_em, a.desce_ate, total))
    )

    cmd = ["ffmpeg", "-v", "error", "-y", "-i", a.filme, "-i", a.trilha,
           "-filter_complex", filtro, "-map", "0:v", "-map", "[a]"]
    if a.escala:
        cmd += ["-vf", "scale=%s:flags=lanczos" % a.escala,
                "-c:v", "libx264", "-crf", "28", "-preset", "slow",
                "-pix_fmt", "yuv420p"]
    else:
        cmd += ["-c:v", "copy"]
    cmd += ["-c:a", "aac", "-b:a", "128k", "-t", str(total), a.saida]

    r = roda(cmd)
    if r.returncode:
        sys.exit("ffmpeg falhou:\n" + r.stderr[:800])
    print("  %s  %.2fs" % (a.saida, dur(a.saida)))


if __name__ == "__main__":
    main()
