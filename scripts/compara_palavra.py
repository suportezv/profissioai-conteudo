#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compara como uma palavra e dita em varias faixas, contra uma referencia.

Generico: nao tem nada de marca. Serve para qualquer palavra cuja pronuncia
precise ficar igual a de um take ja aprovado.

## Por que isto existe

Pronuncia de marca em TTS varia de take para take, e "soa estranha" nao diz
onde esta o problema. Recortando a palavra pelas marcas do Scribe e medindo,
da para separar as causas e escolher por numero em vez de por gosto:

  * **onde cai o pico de energia dentro da palavra** aponta a silaba tonica,
    que e o erro mais comum e o mais audivel;
  * **o numero de nucleos silabicos** pega vogal de apoio a mais, do tipo que
    uma grafia fonetica pode acrescentar sem querer;
  * **a assinatura de banda por quadro**, reamostrada para o mesmo numero de
    quadros e comparada por cosseno, compara a forma da palavra inteira e e o
    criterio de desempate.

Uso:
    python3 scripts/compara_palavra.py Polishop \
        --referencia locucao/cena-02.mp3:stt/cena-02.json \
        --candidato take1.mp3:take1.stt.json --candidato take2.mp3:...
"""
import argparse
import json
import subprocess
import sys
import tempfile
import wave

import numpy as np


def acha(stt, alvo):
    d = json.load(open(stt))
    alvo = alvo.lower()
    for w in d.get("words", []):
        if w.get("type") != "word":
            continue
        if alvo in w["text"].lower().strip(".,:;!?"):
            return w["start"], w["end"]
    return None


def recorta(src, ini, fim):
    dest = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-ss", str(ini), "-t", str(fim - ini),
         "-i", src, "-ac", "1", "-ar", "16000", dest],
        check=True,
    )
    w = wave.open(dest)
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    return x


def bandas(x, quadros=24, n_bandas=16, sr=16000):
    n, hop = 512, 96
    if len(x) < n + hop:
        return None, None
    J = np.array([np.abs(np.fft.rfft(x[i:i + n] * np.hanning(n)))
                  for i in range(0, len(x) - n, hop)])
    f = np.fft.rfftfreq(n, 1 / sr)
    mel = 2595 * np.log10(1 + f / 700)
    lim = np.linspace(mel[1], mel[-1], n_bandas + 1)
    B = np.array([J[:, (mel >= lim[i]) & (mel < lim[i + 1])].sum(axis=1)
                  for i in range(n_bandas)]).T
    energia = B.sum(axis=1)
    L = np.log(B + 1e-6)
    idx = np.linspace(0, len(L) - 1, quadros)
    R = np.array([np.interp(idx, np.arange(len(L)), L[:, k]) for k in range(n_bandas)]).T
    R = (R - R.mean()) / (R.std() + 1e-9)
    return R.ravel(), energia


def nucleos(energia):
    """Quantos nucleos silabicos: picos do envelope acima de 40% do maximo.

    Serve para pegar vogal de apoio a mais, que e o efeito colateral tipico de
    uma grafia fonetica escrita para forcar a tonica.
    """
    e = energia / max(energia.max(), 1e-9)
    n = 0
    for i in range(1, len(e) - 1):
        if e[i] >= e[i - 1] and e[i] > e[i + 1] and e[i] > 0.4:
            n += 1
    return n


def medida(caminho_audio, caminho_stt, palavra):
    m = acha(caminho_stt, palavra)
    if not m:
        return None
    x = recorta(caminho_audio, m[0], m[1])
    assinatura, energia = bandas(x)
    if assinatura is None:
        return None
    return {
        "dur": len(x) / 16000,
        "pico": float(np.argmax(energia)) / len(energia),
        "nucleos": nucleos(energia),
        "assinatura": assinatura,
    }


def par(v):
    a, _, b = v.partition(":")
    if not b:
        sys.exit("formato esperado: audio.mp3:transcricao.json")
    return a, b


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("palavra")
    ap.add_argument("--referencia", required=True, help="audio.mp3:stt.json do take aprovado")
    ap.add_argument("--candidato", action="append", default=[], help="audio.mp3:stt.json")
    a = ap.parse_args()

    ref = medida(*par(a.referencia), a.palavra)
    if not ref:
        sys.exit(f'palavra "{a.palavra}" nao encontrada na referencia')
    print(f"referencia: dur {ref['dur']:.3f}  pico {ref['pico']:.2f}  "
          f"nucleos {ref['nucleos']}")
    print()

    linhas = []
    for c in a.candidato:
        audio, stt = par(c)
        m = medida(audio, stt, a.palavra)
        if not m:
            print(f"{audio}: palavra nao encontrada")
            continue
        corr = float(np.dot(ref["assinatura"], m["assinatura"]) /
                     (np.linalg.norm(ref["assinatura"]) * np.linalg.norm(m["assinatura"])))
        ok = m["nucleos"] == ref["nucleos"] and abs(m["dur"] / ref["dur"] - 1) < 0.25
        linhas.append((corr, ok, audio, m))

    for corr, ok, audio, m in sorted(linhas, key=lambda r: -r[0]):
        print(f"{'  ' if ok else '! '}{audio.split('/')[-1]:14s} corr {corr:.3f}  "
              f"dur {m['dur']:.3f}  pico {m['pico']:.2f}  nucleos {m['nucleos']}")
    print()
    print("!  = fora do criterio de nucleos silabicos ou de duracao")


if __name__ == "__main__":
    main()
