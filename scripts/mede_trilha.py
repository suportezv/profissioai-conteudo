#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mede andamento, tonalidade e movimento harmonico de trechos de trilha.

Generico: nao tem nada de marca.

Tres medidas, e cada uma existe por causa de uma recusa de usuario que custou
uma rodada:

  * **BPM por autocorrelacao do fluxo de energia.** Um trecho fora do andamento
    dos outros soa como outra musica no cruzamento, e isso se ve antes de
    montar.
  * **Tonalidade pelo perfil de Krumhansl**, correlacionando o croma contra os
    24 perfis (12 tonicas x 2 modos). E muito mais honesto que olhar a nota
    mais forte: **uma linha de baixo insistente domina o croma e finge ser a
    tonica**. E o modo separa "tenso" de "sombrio", que foi a recusa da vez
    anterior.
  * **Movimento harmonico**: quantos acordes distintos o trecho percorre, medido
    como o numero de agrupamentos do croma ao longo do tempo. Trilha que fica
    **sempre nos mesmos acordes** cansa, e essa foi a recusa seguinte. Um numero
    baixo aqui quer dizer um acorde so repetido, por mais bonito que ele seja.

Uso:
    python3 scripts/mede_trilha.py trilha/*.mp3
"""
import argparse
import subprocess
import sys
import tempfile
import wave

import numpy as np

NOTAS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
# perfis de Krumhansl-Kessler
MAIOR = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
MENOR = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])


def carrega(caminho, sr=22050):
    dest = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", caminho,
                    "-ac", "1", "-ar", str(sr), dest], check=True)
    w = wave.open(dest)
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    return x, sr


def espectro(x, sr, n=4096, hop=1024):
    J = np.array([np.abs(np.fft.rfft(x[i:i + n] * np.hanning(n)))
                  for i in range(0, max(1, len(x) - n), hop)])
    return J, np.fft.rfftfreq(n, 1 / sr)


def croma(J, f):
    """Energia por classe de altura, quadro a quadro."""
    valido = (f > 55) & (f < 2000)
    classes = np.zeros(len(f), dtype=int)
    with np.errstate(divide="ignore"):
        midi = 69 + 12 * np.log2(np.where(f > 0, f, 1) / 440.0)
    classes = (np.round(midi).astype(int) % 12)
    C = np.zeros((len(J), 12))
    for k in range(12):
        sel = valido & (classes == k)
        if sel.any():
            C[:, k] = J[:, sel].sum(axis=1)
    return C


def tom(c):
    c = c / (c.sum() + 1e-9)
    melhor, nome = -2, "?"
    for i in range(12):
        for perfil, modo in ((MAIOR, "maior"), (MENOR, "menor")):
            p = np.roll(perfil, i)
            r = float(np.corrcoef(c, p)[0, 1])
            if r > melhor:
                melhor, nome = r, f"{NOTAS[i]} {modo}"
    return nome, melhor


def bpm(x, sr, hop=512):
    n = 1024
    e = np.array([np.sqrt((x[i:i + n] ** 2).mean()) for i in range(0, max(1, len(x) - n), hop)])
    fluxo = np.maximum(0, np.diff(e))
    fluxo = fluxo - fluxo.mean()
    r = np.correlate(fluxo, fluxo, "full")[len(fluxo) - 1:]
    taxa = sr / hop
    lo, hi = int(taxa * 60 / 180), int(taxa * 60 / 60)
    if hi >= len(r):
        return 0.0
    k = int(np.argmax(r[lo:hi])) + lo
    return 60 * taxa / k


def movimento(C, blocos=8):
    """Quantos acordes distintos o trecho percorre.

    Divide o trecho em blocos, normaliza o croma de cada um e conta quantos
    blocos ficam distantes de todos os anteriores. Um trecho que gira em torno
    de um acorde so devolve 1 ou 2 por mais denso que seja.
    """
    if len(C) < blocos:
        return 1
    pedacos = np.array_split(C, blocos)
    vetores = []
    for p in pedacos:
        v = p.sum(axis=0)
        n = np.linalg.norm(v)
        if n > 0:
            vetores.append(v / n)
    distintos = []
    for v in vetores:
        if all(float(np.dot(v, u)) < 0.92 for u in distintos):
            distintos.append(v)
    return len(distintos)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("arquivos", nargs="+")
    a = ap.parse_args()
    for caminho in a.arquivos:
        x, sr = carrega(caminho)
        J, f = espectro(x, sr)
        C = croma(J, f)
        nome, r = tom(C.sum(axis=0))
        print(f"{caminho.split('/')[-1]:22s} {len(x)/sr:5.1f}s  "
              f"{bpm(x, sr):5.1f} BPM  {nome:9s} corr {r:.2f}  "
              f"acordes distintos {movimento(C)}")


if __name__ == "__main__":
    main()
