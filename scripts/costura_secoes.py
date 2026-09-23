#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Monta uma trilha em movimentos, a partir de um mapa de secoes.

Generico: as secoes vem do JSON, nao do codigo.

## Por que isto existe

Um loop unico por cima de um filme inteiro **nao acompanha nada**. Ele comeca
no mesmo lugar que termina, entao a virada do roteiro passa e a musica nao
sabe. O sintoma que o usuario reporta e sempre o mesmo: "generica" e "nao
parece sincronizada com o que esta acontecendo".

A correcao nao e escolher uma musica melhor, e **trocar de musica nas viradas
do corte**. Cada secao aponta para um trecho gerado com carater proprio, e os
limites de secao caem exatamente nos cortes de cena.

## Como o cruzamento e feito

Cada secao vira uma faixa propria que:

  * repete o trecho de origem ate cobrir a duracao pedida (`-stream_loop`);
  * entra com `afade in` e sai com `afade out`;
  * e atrasada com `adelay` para o seu instante no filme.

As faixas sao somadas com `amix`. Como cada secao comeca `cruzamento` segundos
antes do fim da anterior e as duas estao em fade oposto, **o cruzamento sai da
soma**, sem precisar de `acrossfade` encadeado, que exigiria montar a cadeia
inteira de uma vez e erra quando uma secao e mais curta que o cruzamento.

Dois cuidados que a pratica impos:

  * `amix` divide o volume pelo numero de entradas. Com `normalize=0` ele
    soma, que e o que queremos, e o ganho de cada secao fica no proprio JSON.
  * o `adelay` quer milissegundos **por canal**, entao `all=1` evita que so o
    canal esquerdo seja atrasado, o que soa como eco e nao como atraso.

Uso:
    python3 costura_secoes.py mapa.json saida.mp3 --pasta trilha/
"""
import argparse
import json
import os
import re
import subprocess
import sys


def lufs(caminho):
    """Loudness integrada do arquivo, pelo `ebur128` do ffmpeg."""
    r = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", caminho,
         "-af", "ebur128=framelog=quiet", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    m = re.search(r"Integrated loudness:\s*\n\s*I:\s*(-?[\d.]+)", r.stderr)
    return float(m.group(1)) if m else None


def roda(args):
    return subprocess.run(args, capture_output=True, text=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("mapa", help='JSON: [{"stem":"a","inicio":0,"fim":12,'
                                 '"ganho":0.5,"corte":1600}]')
    ap.add_argument("saida")
    ap.add_argument("--pasta", default=".", help="onde estao os stems")
    ap.add_argument(
        "--normaliza", type=float, default=None, metavar="LUFS",
        help="mede cada stem e iguala a loudness antes de aplicar os ganhos do "
             "mapa (ex.: -16). Sem isso o ganho do mapa multiplica material de "
             "volumes diferentes e o mesmo numero soa diferente em cada secao.",
    )
    ap.add_argument("--cruzamento", type=float, default=1.4,
                    help="segundos de sobreposicao entre secoes")
    a = ap.parse_args()

    secoes = json.load(open(a.mapa))
    if not secoes:
        sys.exit("mapa vazio")
    total = max(s["fim"] for s in secoes)

    # **Igualar a loudness dos stems antes de aplicar os ganhos.**
    # Sem isso o numero do mapa nao quer dizer nada: um pad gerado a -44 LUFS
    # com ganho 0,46 vira silencio ao lado de um trecho a -14, e o que o
    # espectador ouve e um buraco na trilha, nao um leito.
    correcao = {}
    if a.normaliza is not None:
        for s in secoes:
            nome = s["stem"]
            if nome in correcao:
                continue
            caminho = os.path.join(a.pasta, nome + ".mp3")
            if not os.path.exists(caminho):
                continue
            medido = lufs(caminho)
            correcao[nome] = 1.0 if medido is None else 10 ** ((a.normaliza - medido) / 20)
            print("  %-10s %6.1f LUFS -> x%.3f" % (nome, medido or 0.0, correcao[nome]))

    entradas, filtros, rotulos = [], [], []
    for i, s in enumerate(secoes):
        caminho = os.path.join(a.pasta, s["stem"] + ".mp3")
        if not os.path.exists(caminho):
            sys.exit("stem nao encontrado: " + caminho)
        # a secao comeca antes e termina depois, para o cruzamento existir
        ini = max(0.0, s["inicio"] - a.cruzamento)
        fim = min(total, s["fim"] + a.cruzamento)
        dura = fim - ini
        ent = a.cruzamento if s["inicio"] > 0 else 0.8
        sai = a.cruzamento if s["fim"] < total else 2.0
        entradas += ["-stream_loop", "-1", "-i", caminho]
        # `corte` e a densidade da secao: um passa-baixa tira o brilho e a
        # percussao de cima sem mudar tom nem andamento, que e o que garante
        # que as secoes continuem soando como a mesma peca.
        corte = s.get("corte")
        passa = ("lowpass=f=%d," % int(corte)) if corte else ""
        filtros.append(
            "[%d:a]atrim=0:%.3f,asetpts=N/SR/TB,%s"
            "afade=t=in:st=0:d=%.3f,afade=t=out:st=%.3f:d=%.3f,"
            "volume=%.4f,adelay=%d:all=1[s%d]"
            % (i, dura, passa, ent, max(0.0, dura - sai), sai,
               float(s.get("ganho", 1.0)) * correcao.get(s["stem"], 1.0),
               int(ini * 1000), i)
        )
        rotulos.append("[s%d]" % i)

    filtros.append("%samix=inputs=%d:normalize=0:dropout_transition=0,"
                   "atrim=0:%.3f[out]" % ("".join(rotulos), len(secoes), total))
    cmd = (["ffmpeg", "-v", "error", "-y"] + entradas +
           ["-filter_complex", ";".join(filtros), "-map", "[out]",
            "-c:a", "libmp3lame", "-b:a", "192k", a.saida])
    r = roda(cmd)
    if r.returncode != 0:
        sys.exit(r.stderr[-1200:])

    out = roda(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "csv=p=0", a.saida]).stdout.strip()
    print("%s  %.2fs  %d secoes" % (a.saida, float(out), len(secoes)))
    for s in secoes:
        print("  %6.1f a %6.1f  %-16s ganho %.2f"
              % (s["inicio"], s["fim"], s["stem"], s.get("ganho", 1.0))
              + ("  passa-baixa %d Hz" % s["corte"] if s.get("corte") else ""))


if __name__ == "__main__":
    main()
