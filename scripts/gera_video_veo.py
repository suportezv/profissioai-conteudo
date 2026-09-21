#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera video com o Veo pela API do Gemini: envia, espera a operacao e baixa.

Generico: nao tem nada de marca. Serve para qualquer estudio.

Detalhes que a documentacao nao deixa obvios e que estao resolvidos aqui:

  * A chamada e `:predictLongRunning`, nao `:generateContent`. Ela devolve so o
    nome de uma operacao; o video sai de um polling em `GET /v1beta/{nome}`.
  * O arquivo final fica na File API e **o download exige o cabecalho
    `x-goog-api-key`**. Passar a chave na query string devolve 401.
  * O arquivo expira em ~48 h. Baixar na mesma sessao, sempre.
  * `resolution` so e aceito por parte dos modelos; quando recusado, a API
    responde 400 e o job nem comeca. Por isso o parametro e opcional e o erro
    e impresso inteiro, em vez de virar "falhou".

Uso:
    python3 gera_video_veo.py --prompt "..." --saida clipe.mp4
    python3 gera_video_veo.py --lote lote.json --pasta broll/
"""
import argparse, json, os, subprocess, sys, time

API = "https://generativelanguage.googleapis.com/v1beta"


def curl(args, binario=False):
    r = subprocess.run(["curl", "-s", "--max-time", "180"] + args,
                       capture_output=True)
    return r.stdout if binario else r.stdout.decode("utf-8", "replace")


def envia(chave, modelo, prompt, aspecto, resolucao, negativo):
    params = {"aspectRatio": aspecto}
    if resolucao:
        params["resolution"] = resolucao
    if negativo:
        params["negativePrompt"] = negativo
    corpo = json.dumps({"instances": [{"prompt": prompt}], "parameters": params})
    out = curl(["-X", "POST", "%s/models/%s:predictLongRunning?key=%s" % (API, modelo, chave),
                "-H", "Content-Type: application/json", "-d", corpo])
    try:
        d = json.loads(out)
    except ValueError:
        sys.exit("resposta nao e JSON:\n" + out[:900])
    if "name" not in d:
        sys.exit("a API recusou o job:\n" + json.dumps(d, indent=2, ensure_ascii=False)[:1500])
    return d["name"]


def espera(chave, operacao, limite_s=900, intervalo=15):
    t0 = time.time()
    while time.time() - t0 < limite_s:
        out = curl(["%s/%s?key=%s" % (API, operacao, chave)])
        try:
            d = json.loads(out)
        except ValueError:
            time.sleep(intervalo); continue
        if d.get("done"):
            if "error" in d:
                sys.exit("operacao falhou:\n" + json.dumps(d["error"], indent=2, ensure_ascii=False))
            amostras = (d.get("response", {}).get("generateVideoResponse", {})
                         .get("generatedSamples", []))
            if not amostras:
                sys.exit("operacao concluiu sem video:\n" + json.dumps(d, indent=2)[:1200])
            return amostras[0]["video"]["uri"]
        time.sleep(intervalo)
    sys.exit("estourou o tempo esperando %s" % operacao)


def baixa(chave, uri, destino):
    # a File API exige a chave no cabecalho; na query string devolve 401
    dados = curl(["-L", "-H", "x-goog-api-key: " + chave, uri], binario=True)
    if len(dados) < 20000 or dados[4:8] != b"ftyp":
        sys.exit("o download nao veio como MP4 (%d bytes): %s" % (len(dados), dados[:300]))
    with open(destino, "wb") as f:
        f.write(dados)
    return len(dados)


def um(chave, modelo, prompt, destino, aspecto, resolucao, negativo):
    print("  enviando: %s" % os.path.basename(destino), flush=True)
    op = envia(chave, modelo, prompt, aspecto, resolucao, negativo)
    uri = espera(chave, op)
    n = baixa(chave, uri, destino)
    print("  pronto:   %s (%.1f MB)" % (os.path.basename(destino), n / 1e6), flush=True)


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("--prompt")
    a.add_argument("--saida")
    a.add_argument("--lote", help='JSON: [{"nome":"cena01","prompt":"..."}]')
    a.add_argument("--pasta", default=".")
    a.add_argument("--modelo", default="veo-3.1-fast-generate-preview")
    a.add_argument("--aspecto", default="16:9")
    a.add_argument("--resolucao", help="ex.: 1080p; omitir para o padrao do modelo")
    a.add_argument("--negativo", help="prompt negativo")
    a = a.parse_args()

    chave = os.environ.get("GEMINI_API_KEY")
    if not chave:
        sys.exit("falta GEMINI_API_KEY no ambiente")

    if a.lote:
        os.makedirs(a.pasta, exist_ok=True)
        with open(a.lote, encoding="utf-8") as f:
            itens = json.load(f)
        for it in itens:
            destino = os.path.join(a.pasta, it["nome"] + ".mp4")
            if os.path.exists(destino):
                print("  pulando:  %s (ja existe)" % it["nome"], flush=True)
                continue
            um(chave, it.get("modelo", a.modelo), it["prompt"], destino,
               it.get("aspecto", a.aspecto), it.get("resolucao", a.resolucao),
               it.get("negativo", a.negativo))
    elif a.prompt and a.saida:
        um(chave, a.modelo, a.prompt, a.saida, a.aspecto, a.resolucao, a.negativo)
    else:
        sys.exit("use --prompt com --saida, ou --lote com --pasta")


if __name__ == "__main__":
    main()
