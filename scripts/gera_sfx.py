#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera um banco de SFX e trilha pela ElevenLabs, a partir de um JSON.

Generico: os sons vem do arquivo de lote, nao do codigo.

O endpoint e `/v1/sound-generation`. Dois limites que mandam no desenho do
banco: **`duration_seconds` vai de 0,5 a 22** e o retorno e mp3. Para trilha
mais longa que isso, gerar um trecho que fecha em si e costurar com
`acrossfade`, que e o que `costura_trilha` faz aqui.

Um cuidado que a pratica impos: **som de interface pede prompt que diga o que
NAO ter**. Sem "no reverb, no music, dry" o modelo entrega um efeito com cauda
longa, que numa peca com locucao vira sujeira.

Uso:
    python3 gera_sfx.py lote_sfx.json --pasta remotion/public/sfx
"""
import argparse
import json
import os
import subprocess
import sys


def gera(chave, prompt, segundos, saida, influencia=0.3):
    corpo = json.dumps({
        "text": prompt,
        "duration_seconds": segundos,
        "prompt_influence": influencia,
    })
    r = subprocess.run(
        ["curl", "-s", "--max-time", "180", "-X", "POST",
         "https://api.elevenlabs.io/v1/sound-generation",
         "-H", "xi-api-key: " + chave,
         "-H", "Content-Type: application/json",
         "-d", corpo], capture_output=True)
    if r.stdout[:3] != b"ID3" and r.stdout[:2] != b"\xff\xfb":
        return "a API nao devolveu mp3: " + r.stdout[:200].decode("utf-8", "replace")
    with open(saida, "wb") as f:
        f.write(r.stdout)
    return None


def dur(caminho):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", caminho], capture_output=True, text=True).stdout.strip()
    return float(out) if out else 0.0


def costura_trilha(entrada, alvo_s, saida, cruzamento=3.0):
    """Repete o trecho com crossfade ate passar do alvo, e corta no alvo.

    Crossfade em vez de emenda seca porque emenda seca em trilha da um clique
    audivel justo no silencio, que e onde a peca mais expoe o som.
    """
    d = dur(entrada)
    if d <= 0:
        return "nao consegui medir " + entrada
    if d >= alvo_s:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", entrada, "-t", str(alvo_s),
                        "-c:a", "libmp3lame", "-b:a", "192k", saida], check=False)
        return None

    passo = d - cruzamento
    n = int(alvo_s // passo) + 2
    entradas = []
    filtro = []
    for i in range(n):
        entradas += ["-i", entrada]
    atual = "[0:a]"
    for i in range(1, n):
        alvo = "[a%d]" % i
        filtro.append("%s[%d:a]acrossfade=d=%s:c1=tri:c2=tri%s" %
                      (atual, i, cruzamento, alvo))
        atual = alvo
    cmd = ["ffmpeg", "-v", "error", "-y"] + entradas + [
        "-filter_complex", ";".join(filtro), "-map", atual,
        "-t", str(alvo_s), "-c:a", "libmp3lame", "-b:a", "192k", saida]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        return "acrossfade falhou:\n" + r.stderr[:500]
    return None


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("lote", help='JSON: [{"nome":"tecla","prompt":"...","segundos":0.3}]')
    a.add_argument("--pasta", default=".")
    a = a.parse_args()

    chave = os.environ.get("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit("falta ELEVENLABS_API_KEY no ambiente")

    os.makedirs(a.pasta, exist_ok=True)
    with open(a.lote, encoding="utf-8") as f:
        itens = json.load(f)

    for it in itens:
        saida = os.path.join(a.pasta, it["nome"] + ".mp3")
        if os.path.exists(saida):
            print("  pulando: %s (ja existe)" % it["nome"], flush=True)
            continue
        erro = gera(chave, it["prompt"], float(it.get("segundos", 1.0)), saida,
                    float(it.get("influencia", 0.3)))
        if erro:
            print("  FALHOU %s: %s" % (it["nome"], erro), flush=True)
            continue
        print("  %-16s %5.2fs  %5.0f KB" % (it["nome"], dur(saida),
                                            os.path.getsize(saida) / 1024.0), flush=True)
        if it.get("estender_para"):
            longo = os.path.join(a.pasta, it["nome"] + "-longo.mp3")
            erro = costura_trilha(saida, float(it["estender_para"]), longo)
            if erro:
                print("    costura falhou: %s" % erro, flush=True)
            else:
                print("    %-14s %5.2fs  %5.0f KB (costurado)" % (
                    os.path.basename(longo), dur(longo),
                    os.path.getsize(longo) / 1024.0), flush=True)


if __name__ == "__main__":
    main()
