#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera locucao pela ElevenLabs a partir de um JSON de falas.

Generico: a voz e os textos vem do arquivo de lote, nao do codigo.

Dois cuidados que a pratica deste estudio impos e que valem para qualquer
marca:

  * **A pronuncia se resolve na grafia, nao no ajuste de voz.** Escrever uma
    marca com ponto (`Profissio.ai`) faz o modelo ler "ponto a i". O jeito e
    escrever foneticamente no texto de locucao (`Proficio ei ai`) e conferir
    depois com STT, nao mexer em estabilidade e estilo esperando que mude.
  * **Conferir com o Scribe sai mais barato que ouvir tudo.** Mandar o mp3 de
    volta por `/v1/speech-to-text` e comparar com o texto pedido acha palavra
    comida e nome errado sem ninguem precisar escutar faixa por faixa. E o que
    `--confere` faz.
  * **Enfase se pede por fala, nao pelo lote.** Cada item aceita um bloco
    `ajustes` proprio, que sobrescreve o do lote so naquela faixa. Serve para o
    caso comum de uma frase de efeito precisar de mais expressao (estabilidade
    mais baixa) sem soltar o resto do filme junto.

Uso:
    python3 gera_locucao.py lote.json --pasta remotion/public/locucao --confere
"""
import argparse
import json
import os
import subprocess
import sys

API = "https://api.elevenlabs.io/v1"


def fala(chave, voz, texto, saida, ajustes):
    corpo = json.dumps({
        "text": texto,
        "model_id": ajustes.get("modelo", "eleven_multilingual_v2"),
        "voice_settings": {
            "stability": ajustes.get("estabilidade", 0.55),
            "similarity_boost": ajustes.get("similaridade", 0.75),
            "style": ajustes.get("estilo", 0.0),
            "use_speaker_boost": ajustes.get("speaker_boost", True),
        },
    })
    r = subprocess.run(
        ["curl", "-s", "--max-time", "180", "-X", "POST",
         "%s/text-to-speech/%s" % (API, voz),
         "-H", "xi-api-key: " + chave,
         "-H", "Content-Type: application/json",
         "-d", corpo], capture_output=True)
    if r.stdout[:3] != b"ID3" and r.stdout[:2] != b"\xff\xfb":
        return "a API nao devolveu mp3: " + r.stdout[:200].decode("utf-8", "replace")
    with open(saida, "wb") as f:
        f.write(r.stdout)
    return None


def transcreve(chave, caminho):
    r = subprocess.run(
        ["curl", "-s", "--max-time", "180", "-X", "POST",
         "%s/speech-to-text" % API,
         "-H", "xi-api-key: " + chave,
         "-F", "file=@" + caminho,
         "-F", "model_id=scribe_v1",
         "-F", "language_code=por"], capture_output=True, text=True)
    try:
        return json.loads(r.stdout).get("text", "")
    except ValueError:
        return ""


def dur(caminho):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                          "format=duration", "-of", "csv=p=0", caminho],
                         capture_output=True, text=True).stdout.strip()
    return float(out) if out else 0.0


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("lote", help='JSON: {"voz":"id","falas":[{"nome":"cena-06","texto":"..."}]}')
    a.add_argument("--pasta", default=".")
    a.add_argument("--confere", action="store_true",
                   help="manda o mp3 de volta pelo Scribe e imprime o que voltou")
    a.add_argument("--refazer", action="store_true",
                   help="regera mesmo se o arquivo ja existir")
    a = a.parse_args()

    chave = os.environ.get("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit("falta ELEVENLABS_API_KEY no ambiente")

    with open(a.lote, encoding="utf-8") as f:
        lote = json.load(f)
    voz = lote["voz"]
    ajustes = lote.get("ajustes", {})
    os.makedirs(a.pasta, exist_ok=True)

    for it in lote["falas"]:
        saida = os.path.join(a.pasta, it["nome"] + ".mp3")
        if os.path.exists(saida) and not a.refazer:
            print("  pulando: %s (ja existe)" % it["nome"], flush=True)
            continue
        # o bloco `ajustes` da fala sobrescreve o do lote, campo a campo
        deste = dict(ajustes, **it.get("ajustes", {}))
        erro = fala(chave, voz, it["texto"], saida, deste)
        if erro:
            print("  FALHOU %s: %s" % (it["nome"], erro), flush=True)
            continue
        print("  %-14s %5.2fs  %5.0f KB" % (it["nome"], dur(saida),
                                            os.path.getsize(saida) / 1024.0), flush=True)
        if a.confere:
            print("    volta: %s" % transcreve(chave, saida), flush=True)


if __name__ == "__main__":
    main()
