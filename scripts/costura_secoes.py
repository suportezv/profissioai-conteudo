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

## A emenda do laco, que custou um clique audivel

`-stream_loop` **cola o fim do arquivo no comeco dele sem cruzamento nenhum**.
Enquanto a secao cabe dentro do stem isso nunca aparece; quando ela e mais
longa, a volta do laco cai dentro do filme e o corte seco vira um clique. No
case 06 a secao de 81,3 a 102,5 s pedia 24 s de um stem de 22, e o usuario
ouviu um "pequeno salto" em 1:41. A conta fecha exata: a secao comeca em
`81,3 - 1,4` de cruzamento e `79,9 + 22 = 101,9`.

Por isso, quando o laco e necessario, o stem e **refeito para dar a volta sem
emenda**: a cauda dele e cruzada por cima da propria cabeca, o que encurta o
arquivo em um cruzamento e faz o ultimo quadro encostar no primeiro de forma
continua por construcao. Dai `-stream_loop` pode repetir a vontade.

O cruzamento do laco usa `qsin` nos dois lados, e nao a rampa linear do
`afade` padrao: as duas pontas sao o mesmo material em fases diferentes, ou
seja **sinais nao correlacionados**, e somar duas rampas lineares deixa um
buraco de 3 dB no meio do cruzamento. Curva de potencia constante nao deixa.

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
import tempfile


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


def duracao(caminho):
    """Duracao do arquivo em segundos."""
    r = roda(["ffprobe", "-v", "error", "-show_entries", "format=duration",
              "-of", "csv=p=0", caminho])
    try:
        return float(r.stdout.strip())
    except ValueError:
        return None


def laco_sem_emenda(caminho, cruz, destino):
    """Reescreve o stem para que ele de a volta sem corte seco.

    A cauda de `cruz` segundos e somada por cima da cabeca, as duas em curva de
    potencia constante. O arquivo fica `cruz` segundos mais curto e o sample
    seguinte ao ultimo passa a ser, por construcao, o que ja seguia aquele
    ponto no material original.
    """
    dur = duracao(caminho)
    if dur is None or dur <= cruz * 2:
        return caminho
    corpo = dur - cruz
    filtro = (
        "[0:a]atrim=0:%.4f,asetpts=N/SR/TB,afade=t=in:st=0:d=%.4f:curve=qsin[c];"
        "[0:a]atrim=%.4f:%.4f,asetpts=N/SR/TB,"
        "afade=t=out:st=0:d=%.4f:curve=qsin[t];"
        "[c][t]amix=inputs=2:normalize=0:dropout_transition=0[out]"
        % (corpo, cruz, corpo, dur, cruz)
    )
    r = roda(["ffmpeg", "-v", "error", "-y", "-i", caminho,
              "-filter_complex", filtro, "-map", "[out]",
              "-c:a", "pcm_s16le", destino])
    return destino if r.returncode == 0 else caminho


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
    temp = tempfile.mkdtemp(prefix="costura-")
    lacados = {}
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
        # **A secao so pode passar da duracao do stem se o laco for sem
        # emenda.** `-stream_loop` cola o fim no comeco sem cruzamento, e esse
        # corte seco e audivel como clique quando a volta cai dentro do filme.
        origem = duracao(caminho)
        if origem is not None and dura > origem - 0.001:
            if s["stem"] not in lacados:
                lacados[s["stem"]] = laco_sem_emenda(
                    caminho, a.cruzamento,
                    os.path.join(temp, s["stem"] + "-laco.wav"),
                )
                print("  %-10s laco sem emenda (%.1fs pedidos de %.1fs)"
                      % (s["stem"], dura, origem))
            caminho = lacados[s["stem"]]
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
