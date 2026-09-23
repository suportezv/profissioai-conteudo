#!/usr/bin/env python3
"""Extrai um site publico do Notion inteiro para markdown, com os toggles abertos.

Generico: nao tem nada de marca. Serve para qualquer Notion publicado.

Tres detalhes que custaram tempo e estao resolvidos aqui:

  1. O `curl` na URL do site nao traz conteudo: o Notion e uma SPA. O conteudo
     vem da API `loadPageChunk`.
  2. No recordMap o bloco vem aninhado em `value.value`, nao em `value`. Quem
     le so `value` recebe None em tudo e acha que a pagina esta vazia.
  3. **Os filhos de um `toggle` nao vem no chunk da pagina.** Sao carregados sob
     demanda, entao um FAQ em toggle aparece so com a pergunta. A solucao e
     chamar o mesmo `loadPageChunk` passando o id do proprio toggle como
     `pageId`. O `syncRecordValues`, que seria o caminho obvio para buscar
     blocos soltos em lote, responde HTML de erro (bloqueado).

Uso:
    python3 extrai_notion.py <page_id> [--dominio exemplo.notion.site] [--saida arq.md]

O <page_id> e o hash da URL, com ou sem hifens.
"""
import argparse
import json
import os
import subprocess
import sys
import time

PREFIXO = {
    "header": "## ", "sub_header": "### ", "sub_sub_header": "#### ",
    "bulleted_list": "- ", "numbered_list": "1. ", "toggle": "▸ ",
    "quote": "> ", "callout": "! ", "to_do": "- [ ] ",
}


def com_hifens(pid):
    p = pid.replace("-", "")
    if len(p) != 32:
        return pid
    return f"{p[:8]}-{p[8:12]}-{p[12:16]}-{p[16:20]}-{p[20:]}"


class Notion:
    def __init__(self, dominio, cache):
        self.api = f"https://{dominio}/api/v3/loadPageChunk"
        self.cache = cache
        os.makedirs(cache, exist_ok=True)

    def chunk(self, pid):
        """Um chunk por id. Serve tanto para pagina quanto para toggle."""
        arq = os.path.join(self.cache, f"{pid}.json")
        if os.path.exists(arq):
            with open(arq, encoding="utf-8") as f:
                return json.load(f)
        corpo = json.dumps({"pageId": pid, "limit": 300, "cursor": {"stack": []},
                            "chunkNumber": 0, "verticalColumns": False})
        for tentativa in range(4):
            r = subprocess.run(
                ["curl", "-s", "--max-time", "60", "-X", "POST", self.api,
                 "-H", "Content-Type: application/json", "-d", corpo],
                capture_output=True, text=True)
            try:
                d = json.loads(r.stdout)
            except ValueError:
                time.sleep(2 ** tentativa)
                continue
            with open(arq, "w", encoding="utf-8") as f:
                f.write(r.stdout)
            return d
        return None

    @staticmethod
    def blocos(d):
        """Desembrulha o value.value do recordMap."""
        out = {}
        for bid, w in (d or {}).get("recordMap", {}).get("block", {}).items():
            v = w.get("value")
            if isinstance(v, dict) and "value" in v:
                v = v["value"]
            if isinstance(v, dict):
                out[bid] = v
        return out

    @staticmethod
    def texto(v):
        p = (v.get("properties") or {}).get("title")
        if not p:
            return ""
        return "".join(x[0] for x in p if isinstance(x, list) and x and isinstance(x[0], str))


def render(n, pid, prof=0, visto=None, saida=None, max_prof=4):
    visto = set() if visto is None else visto
    saida = [] if saida is None else saida
    if pid in visto or prof > max_prof:
        return saida
    visto.add(pid)
    bs = n.blocos(n.chunk(pid))
    raiz = bs.get(pid)
    if not raiz:
        return saida
    saida.append(f"\n{'#' * min(prof + 1, 6)} {n.texto(raiz)}\n")
    filhas = []

    def anda(ids, ind=0):
        for cid in ids:
            v = bs.get(cid)
            if not v:
                continue
            t = v.get("type")
            if t == "page":
                filhas.append(cid)
                saida.append(f"{'  ' * ind}- [[{n.texto(v)}]]")
                continue
            tx = n.texto(v)
            if t == "code":
                tx = "```\n" + tx + "\n```"
            if tx.strip():
                saida.append(f"{'  ' * ind}{PREFIXO.get(t, '')}{tx}")
            if t == "toggle":
                # o conteudo do toggle nao veio no chunk da pagina: buscar a parte
                sub = n.blocos(n.chunk(cid))
                alvo = sub.get(cid, {})
                for c in (alvo.get("content") or []):
                    cv = sub.get(c)
                    if cv and n.texto(cv).strip():
                        saida.append(f"{'  ' * (ind + 1)}{n.texto(cv).strip()}")
                continue
            if v.get("content"):
                anda(v["content"], ind + (1 if t in ("bulleted_list", "numbered_list") else 0))

    anda(raiz.get("content", []))
    for cid in filhas:
        render(n, cid, prof + 1, visto, saida, max_prof)
    return saida


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("page_id", help="id da pagina raiz (com ou sem hifens)")
    ap.add_argument("--dominio", default="www.notion.so",
                    help="dominio do site publicado, ex.: empresa.notion.site")
    ap.add_argument("--saida", help="arquivo de saida (padrao: stdout)")
    ap.add_argument("--cache", default=".cache_notion", help="pasta de cache dos chunks")
    a = ap.parse_args()

    n = Notion(a.dominio, a.cache)
    linhas = render(n, com_hifens(a.page_id))
    if not linhas:
        sys.exit("nada extraido: confira o page_id e o dominio")
    txt = "\n".join(linhas)
    if a.saida:
        with open(a.saida, "w", encoding="utf-8") as f:
            f.write(txt)
        print(f"{len(linhas)} linhas em {a.saida}", file=sys.stderr)
    else:
        print(txt)


if __name__ == "__main__":
    main()
