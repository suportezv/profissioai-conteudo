#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrai o envelope de volume de um trecho de audio, em JSON.

Generico: serve para qualquer onda de audio desenhada em tela.

Existe porque **barra de onda inventada nao corresponde ao que e dito**. Num
balao de audio recriado, o espectador nao le a forma da onda, mas percebe
quando ela nao tem nada a ver com a fala que esta ouvindo: um trecho sem som
com barras altas, uma palavra forte num vale. Medir o proprio arquivo custa
uma chamada de ffmpeg e acaba com o problema.

O metodo: corta o trecho, reamostra para mono, e usa `astats` por janela para
pegar o RMS de cada bin. Depois normaliza pelo maior valor do trecho, porque o
que importa no desenho e a forma relativa, nao o nivel absoluto.

Uso:
    python3 extrai_onda.py audio.mp4 saida.json --de 6.44 --ate 21.68 --barras 28
"""
import argparse
import json
import math
import re
import subprocess
import sys


def rms_por_janela(caminho, de, ate, n):
    """RMS de cada uma das n janelas iguais entre `de` e `ate`."""
    dur = (ate - de) / n
    fora = []
    for i in range(n):
        ini = de + i * dur
        r = subprocess.run(
            ["ffmpeg", "-hide_banner", "-nostats", "-ss", "%.4f" % ini,
             "-t", "%.4f" % dur, "-i", caminho, "-ac", "1",
             "-af", "astats=metadata=1:reset=1", "-f", "null", "-"],
            capture_output=True, text=True)
        vals = [float(m) for m in re.findall(r"RMS level dB: (-?[\d.]+)", r.stderr)]
        # astats imprime por canal e o resumo geral; o menor conjunto util e a media
        fora.append(sum(vals) / len(vals) if vals else -90.0)
    return fora


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("audio")
    a.add_argument("saida")
    a.add_argument("--de", type=float, required=True)
    a.add_argument("--ate", type=float, required=True)
    a.add_argument("--barras", type=int, default=28)
    a.add_argument("--piso-db", type=float, default=-52.0,
                   help="abaixo disto vira barra minima")
    a = a.parse_args()

    if a.ate <= a.de:
        sys.exit("--ate precisa ser maior que --de")

    db = rms_por_janela(a.audio, a.de, a.ate, a.barras)
    teto = max(db)
    # de dB para 0..1, preso no piso, e com uma raiz para a barra baixa nao sumir
    vals = []
    for v in db:
        x = (v - a.piso_db) / max(teto - a.piso_db, 1e-6)
        vals.append(round(math.sqrt(max(0.0, min(1.0, x))), 3))

    with open(a.saida, "w", encoding="utf-8") as f:
        json.dump({"de": a.de, "ate": a.ate, "valores": vals}, f, indent=1)
    print("  %s  %d barras, de %.2fs a %.2fs" % (a.saida, len(vals), a.de, a.ate))
    print("  " + "".join("▁▂▃▄▅▆▇█"[min(7, int(v * 8))] for v in vals))


if __name__ == "__main__":
    main()
