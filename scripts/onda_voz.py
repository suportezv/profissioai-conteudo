#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Transforma um audio em um mp4 leve com a forma de onda desenhada.

Generico: as cores sao parametro, nao tem nada de marca.

Serve para levar uma amostra de locucao a qualquer lugar que aceite video e
nao aceite audio solto (um artefato, uma apresentacao, uma thread). O detalhe
que importa: a onda e **estatica**, feita com `showwavespic` e nao com
`showwaves`. A versao animada redesenha cada frame e por isso um trecho de
23 s vira um arquivo de 6 MB, enquanto a estatica com `-tune stillimage` cai
para dezenas de KB sem perder nada do que interessa, que e ouvir.

Uso:
    python3 onda_voz.py audio.mp3 saida.mp4 [--fundo 0x101218] [--onda 0x2458F5]
"""
import argparse
import os
import subprocess
import sys
import tempfile

LARG = 1120
ALT = 220


def roda(args):
    return subprocess.run(args, capture_output=True, text=True)


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("audio")
    a.add_argument("saida")
    a.add_argument("--fundo", default="0x101218")
    a.add_argument("--onda", default="0x2458F5")
    a.add_argument("--largura", type=int, default=LARG)
    a.add_argument("--altura", type=int, default=ALT)
    a = a.parse_args()

    if not os.path.exists(a.audio):
        sys.exit("nao achei o audio: " + a.audio)

    dur_ent = roda(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                    "-of", "csv=p=0", a.audio]).stdout.strip()
    if not dur_ent:
        sys.exit("nao consegui medir a duracao de " + a.audio)

    png = tempfile.mktemp(suffix=".png")
    r = roda(["ffmpeg", "-v", "error", "-y", "-i", a.audio, "-lavfi",
              "showwavespic=s=%dx%d:colors=%s:split_channels=0" % (a.largura, a.altura, a.onda),
              "-frames:v", "1", png])
    if r.returncode:
        sys.exit("showwavespic falhou:\n" + r.stderr[:600])

    meio = a.altura // 2
    filtro = ("[1:v]format=rgba[w];"
              "[0:v][w]overlay=0:0,"
              "drawbox=x=0:y=%d:w=%d:h=1:color=%s@0.30:t=fill,"
              "format=yuv420p[v]" % (meio, a.largura, a.onda))
    r = roda(["ffmpeg", "-v", "error", "-y",
              "-f", "lavfi", "-i", "color=c=%s:s=%dx%d" % (a.fundo, a.largura, a.altura),
              "-i", png, "-i", a.audio,
              "-filter_complex", filtro,
              "-map", "[v]", "-map", "2:a", "-t", dur_ent,
              "-c:v", "libx264", "-tune", "stillimage", "-crf", "28",
              "-r", "5", "-pix_fmt", "yuv420p", "-color_range", "tv",
              "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
              a.saida])
    os.remove(png)
    if r.returncode:
        sys.exit("a montagem falhou:\n" + r.stderr[:600])

    dur = roda(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "csv=p=0", a.saida]).stdout.strip()
    print("%s  %.1fs  %.0f KB" % (a.saida, float(dur), os.path.getsize(a.saida) / 1024.0))


if __name__ == "__main__":
    main()
