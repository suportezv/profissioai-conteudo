# -*- coding: utf-8 -*-
"""Mede o ritmo de fala do roteiro lendo a propria tabela de cenas.

Conta palavra FALADA: numero escrito em algarismo e expandido para a forma
que a locucao diz ("2017" vale quatro palavras, nao uma). Sem isso a medida
mente justo nas cenas que carregam dado.
"""
import io, re, sys

ARQ = "projects/03-case-eita-whatsapp/ROTEIRO.md"
LIMITE = 2.45
SILENCIO = {"01": 4}          # segundos sem fala dentro da cena

def seg(mmss):
    m, s = mmss.split(":")
    return int(m) * 60 + int(s)

def por_extenso(n):
    """Quantas palavras a locucao gasta para dizer o numero."""
    n = int(n)
    if n == 0: return 1
    if n < 16: return 1                                   # quinze
    if n < 100: return 1 if n % 10 == 0 else 3            # vinte e cinco
    if n < 1000:
        c, r = divmod(n, 100)
        return (1 if c else 0) + (0 if r == 0 else 1 + por_extenso(r))
    if n < 1000000:
        mil, r = divmod(n, 1000)
        base = (0 if mil == 1 else por_extenso(mil)) + 1   # "mil" / "dois mil"
        return base + (0 if r == 0 else 1 + por_extenso(r))
    mi, r = divmod(n, 1000000)
    base = por_extenso(mi) + 1
    return base + (0 if r == 0 else 1 + por_extenso(r))

def palavras_faladas(txt):
    txt = re.sub(r"\*\(.*?\)\*", " ", txt)        # rubrica entre parenteses
    txt = re.sub(r"<br\s*/?>", " ", txt)
    # GC e lettering, nao e fala: tudo a partir dele sai da contagem, senao a
    # cena aparece corrida so porque carrega dado na tela. O corte vem antes de
    # tirar os asteriscos, senao o padrao nao casa mais.
    txt = re.split(r"\*\*GC\b", txt)[0]
    txt = txt.replace("**Narração:**", " ").replace("**", "")
    txt = re.sub(r"\*Pergunta.*", " ", txt)
    total = 0
    for tok in re.findall(r"[0-9]+|[^\s0-9]+", txt):
        if not tok.strip(".,;:!?·—-"):
            continue
        total += por_extenso(tok) if tok.isdigit() else 1
    return total

linhas = [l for l in io.open(ARQ, encoding="utf-8") if re.match(r"^\| \*\*\d\d\*\* \|", l)]
if len(linhas) != 9:
    sys.exit("esperava 9 cenas, achei %d" % len(linhas))

print("%-4s %-14s %6s %7s %7s  %s" % ("cena", "tempo", "dur", "palav", "pal/s", "voz"))
falha = []
fim_ant = 0
tot_narr_pal = tot_narr_s = tot_sonora_s = 0
for l in linhas:
    c = [x.strip() for x in l.strip().strip("|").split("|")]
    num = c[0].replace("*", "")
    ini, fim = [seg(x) for x in c[1].split(" a ")]
    if ini != fim_ant:
        falha.append("cena %s: buraco/sobreposicao na linha do tempo (%d vs %d)" % (num, ini, fim_ant))
    fim_ant = fim
    dur = fim - ini
    fala_s = dur - SILENCIO.get(num, 0)
    voz, cont = c[3], c[4]
    # a cena 01 declara a voz como "ninguem, depois narracao entra baixa":
    # comparar sem caixa, senao ela some da medida justo por ser a abertura.
    narr = "narração" in voz.lower()
    sonora_escrita = "Sonora" in voz and num != "07"   # a 07 e reacao, nao tem texto
    n = palavras_faladas(cont) if (narr or sonora_escrita) else 0
    ps = n / float(fala_s) if fala_s else 0
    if narr:
        tot_narr_pal += n; tot_narr_s += fala_s
    elif "Sonora" in voz or "áudio do produto" in voz:
        tot_sonora_s += fala_s
    alerta = "  <-- ACIMA DO LIMITE" if ps > LIMITE else ""
    if ps > LIMITE:
        falha.append("cena %s: %.2f pal/s" % (num, ps))
    print("%-4s %-14s %5ds %7d %7.2f  %s%s" % (num, c[1], dur, n, ps, voz[:26], alerta))

print("\ntotal: %ds" % fim_ant)
print("narracao: %d palavras em %d s (%.2f pal/s medio)" % (
    tot_narr_pal, tot_narr_s, tot_narr_pal / float(tot_narr_s)))
print("sonoras: %d s" % tot_sonora_s)
if fim_ant != 120:
    falha.append("duracao total %ds, esperado 120s" % fim_ant)
print("\n" + ("FALHOU:\n  " + "\n  ".join(falha) if falha else "OK: nenhuma cena acima de %.2f pal/s" % LIMITE))
sys.exit(1 if falha else 0)
