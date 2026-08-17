# Setup do Profissio.ai Conteúdo Studio

Espelho do setup dos estúdios irmãos. No cloud, basta:

```bash
bash scripts/setup.sh
bash scripts/validate.sh
```

## Environment (Claude Code cloud)

Network **Custom** com `drive.google.com`, `drive.usercontent.google.com` e `api.elevenlabs.io` na lista de domínios, mais a env var `ELEVENLABS_API_KEY` e o setup script `bash scripts/setup.sh`. Configura-se no seletor de nuvem acima da caixa de mensagem em claude.ai/code (não nas Configurações gerais). **Mudanças valem para sessões novas.**

## Conectores (cada um exige ação do usuário)

- **Google Drive**: conector oficial do Claude + pastas de brutos com "qualquer pessoa com o link: leitor" (download direto por curl, qualquer tamanho). Pasta de brutos da Profissio.ai: **PENDENTE**.
- **Metricool**: conectado pela conta **suporte@profissio.ai**. Marca "Profissio.ai", **blog_id 6736175**. Instagram, Facebook, LinkedIn e YouTube conectados; **TikTok não**.
- **Kairogen**: conta **suporte@profissio.ai**, plano **FREE com 0 créditos**. B-roll por IA indisponível até upgrade ou troca para a conta da agência.
- **ElevenLabs**: chave `sk_...` (51 chars). Escopos presentes: `text_to_speech`, `speech_to_text`, `sound_generation`, `voices_read`. Faltam `user_read` e `models_read`.

## Validação final

1. `ffmpeg -filters | grep -cE "subtitles|zscale"` >= 2.
2. Transcrever 10s de um vídeo com o helper do video-use: JSON com timestamps por palavra.
3. Rede: `curl -s -o /dev/null -w "%{http_code}" https://drive.google.com/` responde HTTP (não 000).
4. Metricool: `getBrandSettings` lista "Profissio.ai" com blog_id 6736175.
5. Kairogen: `get_me_context` mostra plano e créditos.
6. Memória persistente: `CLAUDE.md` deste repo.

## Pendências de marca (bloqueiam produção de texto público)

Ver as seções marcadas **PENDENTE** no `FRAMEWORK.md`: produto, persona, credencial de quem assina, CTA, pilares, cor de acento do lettering e voz da ElevenLabs.
