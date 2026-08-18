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

## Mix v2 (feedback do usuário, 18/ago/2026)

- **Shimmer removido de todas as ocorrências** (soava como chimbal). Palavras rosa ficam sem acento sonoro; a locução cobre.
- **Tique-taque de relógio real** (`ticktock.mp3`, novo na biblioteca) sincronizado ao surgimento do ícone do relógio (4.2s, com fade antes de o painel crescer). Substitui o pop genérico.
- **Swell movido de 31.6s para 29.75s**, com o pico casando com o surgimento do lockup da Profissio.ai (~30.2 a 30.6s). O pop da logo saiu.
- **Trilha nova composta no Eleven Music** (a conta tem a permissão `music`, descoberta neste ajuste): 33s sob medida, acordes quentes com progressão, groove leve de percussão, ~95 bpm, intro suave, build no meio, resolução no fim. Salva na biblioteca como `trilha-tech-warm-33s.mp3`. Volume 0.28 com ducking pelo VO. Substitui o bed do sound-generation, que era estático demais para o ritmo do vídeo.
- Master v2: -14.01 LUFS, TP -1.0.

Aprendizado: para trilha musical, usar o **Eleven Music** (`POST /v1/music`, `music_length_ms` até 600000) em vez do sound-generation; o sound-generation fica para SFX.

## Agendamento (18/ago/2026)

- **Post Metricool ID 363780635** (id final, após o update da legenda; o id original do create foi substituído, gotcha do update confirmado na prática), Instagram Reel, marca Profissio.ai (blog_id 6736175), **rascunho** para **19/08/2026 às 20:00** (America/Sao_Paulo).
- Legenda final sem a linha de abertura (ajuste do usuário): direto na frase de valor.
- Correção feita na própria sessão executora via trigger com `persistent_session_id` + `fire_trigger`: a sessão manteve contexto (id do post) e o conector, rota validada para follow-ups em sessões filhas.
- Mídia temporária removida do repo após o Metricool copiar para o CDN.
