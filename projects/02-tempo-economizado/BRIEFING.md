# Projeto 02: Tempo economizado (motion)

**Pilar**: D (Central de Ajuda em vídeo), cruzado com Operação/Produtividade.
**Feature**: cartão "Tempo economizado" da aba Geral do Painel de Análises: "mostra quantas horas de atendimento humano o Agente poupou".
**Formato**: motion graphic vertical contínuo, gramática @elevenlabsio, com locução.
**Duração alvo**: ~33s. **Canvas**: 1080x1920 (9:16), 30fps.
**Execução**: Claude Design, cena a cena (`CENAS.md`). Pós, sonorização e agendamento pelo fluxo do projeto 01 (`../01-funil-automatico/POS.md` tem o pipeline completo).

## Por que esta feature

Vice-campeã da seleção do projeto 01, agora titular. Ganha porque:

1. **É a métrica mais vendedora do produto.** "Horas que você não gastou" é ROI direto, o argumento que decide compra B2B. A Ficha de Marketing fala em "custo menor que o de um analista humano"; este cartão é a prova visual disso.
2. **Número que conta para cima é motion puro.** Contador subindo é um device validado da gramática da referência (o vídeo Ads Engine usa contadores). Não precisa inventar metáfora.
3. **Continua a série do Painel de Análises** sem repetir o vídeo 01: o Funil mostrou a IA agindo; este mostra o resultado medido.
4. **Fala com o decisor**: dono e gestor de operação olham exatamente para essa linha do dashboard.

## Roteiro

| Cena | Tempo | Função | Texto em tela (sentence case) |
|---|---|---|---|
| 1 | 0:00–0:05 | Gancho | Tem uma métrica que quase ninguém mede. |
| 2 | 0:05–0:12 | Dor | Cada conversa custa minutos de alguém. Todo dia. |
| 3 | 0:12–0:20 | Virada | O Painel de Análises mostra as horas que o Agente poupou. (contador 0 → 127 h) |
| 4 | 0:20–0:27 | Aprofundamento | Seu time fica com o que só humano resolve. |
| 5 | 0:27–0:33 | CTA | Quanto tempo o seu negócio recuperaria? + Fale com a Agente Profissio.ai |

**Nota de honestidade**: o "127 h" é dado ilustrativo de UI demo (como a Hit&Fit do site), com micro rótulo "últimos 30 dias" para ler como painel real. Não é promessa de resultado; não usar números de cliente real sem autorização.

## Sistema visual

O mesmo do projeto 01 (fixo em todas as cenas): fundo aurora oficial da marca (base clara, manchas desfocadas `#FDA4F5` / `#FACD7C` / `#A5C2FE`-`#A289F2`, drift lento, grão 2%), tinta `#15101F`, acento rosa `#E255A0`, Sora sentence case, painéis brancos flutuantes, easing `cubic-bezier(0.16,1,0.3,1)`, área segura 220/420, peça contínua sem cortes, nunca travessão.

## Locução (pronúncia nova: "Profício ei ái", com ênfase no ái)

| Cena | Locução |
|---|---|
| 1 | "Tem uma métrica que quase ninguém mede." |
| 2 | "Cada conversa que seu time responde custa minutos. Todo dia." |
| 3 | "O Painel de Análises da Profício ei ái mostra quantas horas o Agente poupou." |
| 4 | "São conversas resolvidas sem tirar seu time do que importa." |
| 5 | "Quanto tempo o seu negócio recuperaria? A Agente Profício ei ái te espera no WhatsApp." |

Voz: `LetL52AJ3xLLkD3x88iE` (aprovada no projeto 01), eleven_multilingual_v2, stability 0.5, similarity 0.75. Linhas curtas de fecho: gerar com `previous_text` da frase anterior (entonação). Validar pronúncia por STT antes de mixar.

## Sonorização

**Reutilizar a biblioteca `assets/sfx/`** (gerada no projeto 01, custo zero): pop nas conversas chegando, tick nos minutos, **counter no número subindo** (o herói deste vídeo), sweep nas transições, shimmer nas palavras rosa, typing no CTA, swell no fecho, bed_a+bed_b como trilha (acrossfade 3s, volume 0.16, ducking pelo VO). Master **-14 LUFS**.

## Pendências herdadas

- Link real do WhatsApp para o CTA (`wa.me` segue placeholder).
- Conector do Metricool desabilitado nesta conversa: agendar via sessão filha no environment Default (fluxo validado no projeto 01) ou corrigir o environment antes.
