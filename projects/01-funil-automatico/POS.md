# Pós-produção v1 (18/ago/2026)

## Render

O zip do Claude Design traz a composição (`Reel Funil Profissio.dc.html` + `animations-v3.jsx` + `aurora-piece.jsx`), não um vídeo. Render próprio, determinístico:

- Servidor local + Playwright (`playwright-core` + Chromium do Playwright, `--no-proxy-server`).
- **Gotchas**: `support.js` puxa React/Babel do unpkg (bloqueado): vendorizar via npm e apontar cópia `support.local.js`. Google Fonts bloqueado no Chromium: `@fontsource/sora` e `@fontsource/inter-tight` locais. Viewport `1080x1964` dá scale exatamente 1 (fórmula: `min(w/1080,(h-44)/1920)`).
- Transporte de exportação da composição: evento `data-om-seek-to-time-frame` com `detail {time, sync:true}` no `svg[data-om-exportable-video-with-duration-secs]`; screenshot por frame. 1317 frames, 30fps, 43.9s.
- Frames têm 1 px extra de altura: `crop=1080:1920:0:0` antes do x264 (height ímpar quebra o encoder).

## Voz

**v2 (escolha do usuário, 18/ago/2026): voice_id `LetL52AJ3xLLkD3x88iE`**, eleven_multilingual_v2. Histórico: v1 usou Ana Alice (`ORgG8rwdAiMYRug8RJwR`); a entonação de "Seu time chega antes." saiu estranha isolada, corrigir dando contexto prosódico via `previous_text`.

- **Pronúncia oficial da marca: "profício ei ai"** (o ".ai" em inglês, sem falar "ponto"). Em TTS escrever "Profício ei ái" (refinamento do usuário: mais intensidade no "ái" final; vale dos próximos vídeos em diante) e validar com STT. A grafia v1 "Profissio ponto A I" está descontinuada.
- **"com a Agente" soa como "com a gente"**: evitar essa sequência. CTA final virou "A Agente Profissio.ai te espera no WhatsApp", que desfaz a ambiguidade.
- Conferir pronúncia sem ouvir: gerar TTS e passar no Scribe (STT). Barato e pega erro.

## Mapa de eventos (lido dos frames renderizados)

Cenas (playback): Gancho 0-3.9 · Dor 3.9-10.9 · Virada 10.9-29.4 · Aprofundamento 29.4-37.9 · CTA 37.9-43.9.

VO: vo1@0.55 · vo2@6.5 · vo3@26.2 · vo4a@34.6 ("Classificado por intenção...") · vo4b@38.9 ("Seu time chega antes.") · vo5@40.3. Na v2, vo4b é gerado com `previous_text` da vo4a para a entonação não sair isolada; se as durações mudarem, manter os starts e reconferir que vo5 termina antes de 43.8.

SFX (33 instâncias de 11 sons ElevenLabs sound-generation): shimmer na palavra rosa (2.35, 9.7, 13.95, 14.75, 28.2, 39.0) · pop nas mensagens/logo (3.25, 12.35, 20.5, 22.85, 40.45) · click+drag+settle nos dois arrastos manuais (5.15-8.0) · sweep nas linhas do grafo (15.85, 20.95, 23.85, 29.5, 35.3) · move nos cards que andam sozinhos (16.75, 21.35, 24.95) · tick nos chips do grafo (30.9, 31.4, 31.9) · ping no "estágio atualizado" (33.4) · counter (35.9) · typing no CTA digitado (41.3) · swell final (42.3).

Trilha: 2x22s de sound-generation costurados com acrossfade (41s), volume 0.16, sidechain ducking pelo VO (threshold 0.02, ratio 6), fade out 2.5s.

Master: loudnorm 2 passes para **-14 LUFS** / TP -1.0. Medido final: -13.84 LUFS, pico -1.0 dB, mean_volume -18.4 dB (referências: -15 a -17).

## Pendências desta versão

- Placeholder `wa.me` na tela final segue genérico: trocar quando o link real do WhatsApp chegar (exige re-render só da cena 5 ou pós com overlay).
- Caption e agendamento no Metricool aguardando aprovação do preview.
