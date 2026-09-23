#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera video com o Veo pela API do Gemini, com teto de gasto que ele respeita.

Generico: nao tem nada de marca. Serve para qualquer estudio.

Detalhes que a documentacao nao deixa obvios e que estao resolvidos aqui:

  * A chamada e `:predictLongRunning`, nao `:generateContent`. Ela devolve so o
    nome de uma operacao; o video sai de um polling em `GET /v1beta/{nome}`.
  * O arquivo final fica na File API e **o download exige o cabecalho
    `x-goog-api-key`**. Passar a chave na query string devolve 401.
  * O arquivo expira em ~48 h. Baixar na mesma sessao, sempre.
  * `durationSeconds` aceita de 4 a 8. **Esse e o maior controle de custo que
    existe**, porque a cobranca e por segundo: um corte de 4 s custa metade de
    um de 8 s. Pedir 12 devolve 400 e o job nem comeca.
  * `resolution` e `aspectRatio` sao aceitos por parte dos modelos. Quando
    recusados a API responde 400, entao o erro e impresso inteiro em vez de
    virar um "falhou" generico.

## O teto de gasto

Video por IA se paga por segundo e some rapido, ainda mais porque um plano
sempre precisa de repeticao: raramente o primeiro take serve. Por isso o
script mantem um **livro de gastos** (um JSON ao lado da pasta de saida) e
aceita `--teto-usd`. Antes de comecar, soma o que ja foi gasto com o que o
lote vai custar e **recusa o lote inteiro** se passar do teto, em vez de
descobrir no meio.

**A tabela de precos comeca sem valor e precisa ser informada**, por
`--preco-seg` ou pelo arquivo `precos.json` ao lado do livro. Preco chutado
vira orcamento errado com cara de exato, entao o script prefere parar e pedir.
Para descobrir o preco real de uma conta sem depender de tabela publicada:
rodar `--simular` nao gasta nada; rodar um clipe de 4 s e comparar o saldo
antes e depois da a divisao exata.

Uso:
    python3 gera_video_veo.py --lote lote.json --pasta broll/ --teto-usd 30 --simular
    python3 gera_video_veo.py --prompt "..." --saida clipe.mp4 --duracao 4
"""
import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime

API = "https://generativelanguage.googleapis.com/v1beta"
LIVRO = "veo-gastos.json"
PRECOS = "veo-precos.json"


# ------------------------------------------------------------- utilitarios --

def curl(args, binario=False):
    r = subprocess.run(["curl", "-s", "--max-time", "180"] + args, capture_output=True)
    return r.stdout if binario else r.stdout.decode("utf-8", "replace")


def carrega(caminho, padrao):
    if not os.path.exists(caminho):
        return padrao
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except ValueError:
        return padrao


def preco_de(precos, modelo, resolucao):
    """Preco por segundo. A chave pode ser o modelo ou modelo@resolucao."""
    for chave in ("%s@%s" % (modelo, resolucao or ""), modelo):
        if chave in precos:
            return float(precos[chave])
    return None


# ------------------------------------------------------------------ gastos --

def ja_gasto(livro):
    return sum(float(e.get("usd") or 0) for e in livro.get("geracoes", []))


def registra(caminho, livro, modelo, resolucao, segundos, usd, nome, ok):
    livro.setdefault("geracoes", []).append({
        "quando": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "nome": nome, "modelo": modelo, "resolucao": resolucao,
        "segundos": segundos, "usd": usd, "ok": ok,
    })
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(livro, f, indent=2, ensure_ascii=False)


# ------------------------------------------------------------------- envio --

def envia(chave, modelo, prompt, aspecto, resolucao, negativo, duracao):
    params = {"aspectRatio": aspecto}
    if resolucao:
        params["resolution"] = resolucao
    if negativo:
        params["negativePrompt"] = negativo
    if duracao:
        params["durationSeconds"] = int(duracao)
    corpo = json.dumps({"instances": [{"prompt": prompt}], "parameters": params})
    out = curl(["-X", "POST", "%s/models/%s:predictLongRunning?key=%s" % (API, modelo, chave),
                "-H", "Content-Type: application/json", "-d", corpo])
    try:
        d = json.loads(out)
    except ValueError:
        return None, "resposta nao e JSON:\n" + out[:900]
    if "name" not in d:
        return None, "a API recusou o job:\n" + json.dumps(d, indent=2, ensure_ascii=False)[:1200]
    return d["name"], None


def espera(chave, operacao, limite_s=900, intervalo=15):
    t0 = time.time()
    while time.time() - t0 < limite_s:
        try:
            d = json.loads(curl(["%s/%s?key=%s" % (API, operacao, chave)]))
        except ValueError:
            time.sleep(intervalo); continue
        if d.get("done"):
            if "error" in d:
                return None, "operacao falhou:\n" + json.dumps(d["error"], indent=2, ensure_ascii=False)
            amostras = (d.get("response", {}).get("generateVideoResponse", {})
                         .get("generatedSamples", []))
            if not amostras:
                return None, "operacao concluiu sem video:\n" + json.dumps(d, indent=2)[:900]
            return amostras[0]["video"]["uri"], None
        time.sleep(intervalo)
    return None, "estourou o tempo esperando %s" % operacao


def baixa(chave, uri, destino):
    # a File API exige a chave no cabecalho; na query string devolve 401
    dados = curl(["-L", "-H", "x-goog-api-key: " + chave, uri], binario=True)
    if len(dados) < 20000 or dados[4:8] != b"ftyp":
        return None, "o download nao veio como MP4 (%d bytes): %s" % (len(dados), dados[:200])
    with open(destino, "wb") as f:
        f.write(dados)
    return len(dados), None


# ------------------------------------------------------------------- lote ---

def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("--prompt")
    a.add_argument("--saida")
    a.add_argument("--lote", help='JSON: [{"nome":"cena01","prompt":"...","duracao":4}]')
    a.add_argument("--pasta", default=".")
    a.add_argument("--modelo", default="veo-3.1-fast-generate-preview")
    a.add_argument("--aspecto", default="16:9")
    a.add_argument("--resolucao", help="ex.: 1080p; omitir para o padrao do modelo")
    a.add_argument("--duracao", type=int, help="segundos por clipe, de 4 a 8")
    a.add_argument("--negativo")
    a.add_argument("--teto-usd", type=float,
                   help="recusa o lote se o acumulado passar deste valor")
    a.add_argument("--preco-seg", type=float,
                   help="preco por segundo deste modelo, em USD")
    a.add_argument("--simular", action="store_true",
                   help="so mostra o plano e o custo, nao gera nada")
    a = a.parse_args()

    chave = os.environ.get("GEMINI_API_KEY")
    if not chave and not a.simular:
        sys.exit("falta GEMINI_API_KEY no ambiente")

    os.makedirs(a.pasta, exist_ok=True)
    cam_livro = os.path.join(a.pasta, LIVRO)
    cam_precos = os.path.join(a.pasta, PRECOS)
    livro = carrega(cam_livro, {"geracoes": []})
    precos = carrega(cam_precos, {})

    if a.lote:
        with open(a.lote, encoding="utf-8") as f:
            itens = json.load(f)
    elif a.prompt and a.saida:
        itens = [{"nome": os.path.splitext(os.path.basename(a.saida))[0],
                  "prompt": a.prompt}]
        a.pasta = os.path.dirname(a.saida) or "."
    else:
        sys.exit("use --prompt com --saida, ou --lote com --pasta")

    # ---- plano e custo, antes de qualquer chamada
    plano, segundos_total, custo_total, sem_preco = [], 0, 0.0, set()
    for it in itens:
        nome = it["nome"]
        destino = os.path.join(a.pasta, nome + ".mp4")
        modelo = it.get("modelo", a.modelo)
        resol = it.get("resolucao", a.resolucao)
        dur = int(it.get("duracao") or a.duracao or 8)
        if not 4 <= dur <= 8:
            sys.exit("duracao de '%s' e %d s; a API so aceita de 4 a 8" % (nome, dur))
        pronto = os.path.exists(destino)
        p = a.preco_seg if a.preco_seg is not None else preco_de(precos, modelo, resol)
        if p is None and not pronto:
            sem_preco.add(modelo)
        custo = (p or 0) * dur if not pronto else 0.0
        if not pronto:
            segundos_total += dur
            custo_total += custo
        plano.append((it, destino, modelo, resol, dur, custo, pronto))

    gasto = ja_gasto(livro)
    print("ja gasto neste livro: US$ %.2f (%d geracoes)"
          % (gasto, len(livro.get("geracoes", []))))
    print("este lote: %d clipes novos, %d s de video" %
          (sum(1 for x in plano if not x[6]), segundos_total))

    if sem_preco:
        print("\nSEM PRECO para: %s" % ", ".join(sorted(sem_preco)))
        print("Informe com --preco-seg, ou crie %s com {\"<modelo>\": <usd por segundo>}."
              % cam_precos)
        print("Preco chutado vira orcamento errado com cara de exato, entao paro aqui.")
        sys.exit(2)

    print("custo previsto: US$ %.2f · acumulado ficaria em US$ %.2f"
          % (custo_total, gasto + custo_total))
    for it, destino, modelo, resol, dur, custo, pronto in plano:
        print("  %-26s %s %ds %-8s US$ %5.2f%s" % (
            it["nome"], modelo.replace("veo-3.1-", "").replace("-generate-preview", ""),
            dur, resol or "padrao", custo, "   (ja existe, nao gera)" if pronto else ""))

    if a.teto_usd is not None and gasto + custo_total > a.teto_usd + 1e-9:
        sys.exit("\nRECUSADO: o lote levaria o acumulado a US$ %.2f, acima do teto de US$ %.2f.\n"
                 "Reduza a duracao dos clipes, troque de modelo ou corte itens do lote."
                 % (gasto + custo_total, a.teto_usd))

    if a.simular:
        print("\n--simular: nada foi gerado.")
        return

    # ---- execucao
    for it, destino, modelo, resol, dur, custo, pronto in plano:
        if pronto:
            print("pulando:  %s (ja existe)" % it["nome"], flush=True)
            continue
        print("enviando: %s" % it["nome"], flush=True)
        op, erro = envia(chave, modelo, it["prompt"], it.get("aspecto", a.aspecto),
                         resol, it.get("negativo", a.negativo), dur)
        if erro:
            # job recusado nao e cobrado, entao nao entra no livro
            print("  FALHOU no envio: %s" % erro, flush=True)
            continue
        uri, erro = espera(chave, op)
        if erro:
            registra(cam_livro, livro, modelo, resol, dur, custo, it["nome"], False)
            print("  FALHOU na geracao: %s" % erro, flush=True)
            continue
        n, erro = baixa(chave, uri, destino)
        registra(cam_livro, livro, modelo, resol, dur, custo, it["nome"], erro is None)
        if erro:
            print("  FALHOU no download: %s" % erro, flush=True)
        else:
            print("  pronto:  %s (%.1f MB) · acumulado US$ %.2f"
                  % (it["nome"], n / 1e6, ja_gasto(livro)), flush=True)

    print("\nacumulado no livro: US$ %.2f" % ja_gasto(livro))


if __name__ == "__main__":
    main()
