# Pós-produção v1 (18/ago/2026)

Pipeline idêntico ao projeto 01 (ver `../01-funil-automatico/POS.md` para o detalhe técnico do render determinístico). Diferenças e registro desta peça:

- **Composição**: `Reel Tempo Economizado.dc.html` + `tempo-piece.jsx`, 33s, cenas exatamente nas janelas do roteiro (5/7/8/7/6). O Claude Design substituiu o placeholder de wa.me por **"Fale com a Profissio.ai" + "Link na bio"** digitados, resolvendo a pendência do link no CTA.
- **Render**: 990 frames, viewport 1080x1964, kit vendor/fonts reaproveitado do projeto 01 (+ Inter Tight 800).
- **Voz**: `LetL52AJ3xLLkD3x88iE`, pronúncia nova **"Profício ei ái"** validada por STT nas duas menções. Fechos com `previous_text`. 6 linhas (vo5 dividida em pergunta + convite).
- **VO no tempo**: vo1@1.0 · vo2@7.6 · vo3@17.5 (depois do contador, que fica só com som) · vo4@23.5 · vo5a@28.1 · vo5b@30.35.
- **SFX** (32 instâncias, 100% da biblioteca `assets/sfx/`, custo zero): pops em cascata nas conversas (6.1 a 8.2), ticks no contador de conversas, **3 counter rolls encadeados no número herói (14.2, 15.2, 16.2)** e ping no settle rosa do 127 h (17.5), ticks nas barras (21.2 a 21.8), shimmers nas palavras rosa, typing no CTA (30.8), swell final. Trilha bed_a+bed_b, ducking pelo VO.
- **Master**: -14.40 LUFS integrado, TP -1.0. 33.0s, 7.9 MB.

## Custo incremental desta peça

Só locução: 6 gerações TTS (~280 caracteres, ~280 créditos) + 2 verificações STT. SFX e trilha reutilizados da biblioteca. Render e mix locais, custo zero.

## Status

- Preview enviado na conversa, **aguardando aprovação** antes de caption e agendamento.
