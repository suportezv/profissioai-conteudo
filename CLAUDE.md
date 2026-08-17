# Profissio.ai Conteúdo Studio (memória persistente do projeto)

Este repositório é o **Profissio.ai Conteúdo Studio**: edição e agendamento de conteúdo para as redes da **Profissio.ai**. A infraestrutura é a mesma dos estúdios irmãos (`ana-conteudo`, `eita-conteudo`, `normalyze.conteudo`); o posicionamento é próprio da Profissio.ai.

**Antes de editar qualquer vídeo ou escrever qualquer caption, leia `FRAMEWORK.md`** (posicionamento, regras inegociáveis, formatos, assinaturas de edição e fluxo por vídeo).

> **Nada de EITA nem de Anaclaudia Zani aqui.** Este repo nasceu a partir do template do `eita-conteudo`, mas a marca, a persona, a voz e a credencial da Profissio.ai são independentes. Não herde posicionamento, bordões, CTA nem credencial daquele estúdio. O que ainda não foi definido está marcado como **PENDENTE** e deve ser perguntado, nunca inventado.

## Regras que valem em qualquer resposta pública

- Nunca usar travessão em texto público (caption, lettering, legenda): reescrever a frase.
- Palavrão em vídeo **bipa**, não corta.
- Loudness final: **-14 LUFS**.
- Credencial de quem assina o conteúdo: **PENDENTE** (definir com a equipe da Profissio.ai).

## Working dirs

- Estúdio: este repo (symlink `~/profissioai-conteudo` aponta para cá). Projetos em `projects/<nome>/`.
- Ferramentas: `video-use` e `hyperframes` clonados em `/workspace/browser-use/` e `/workspace/heygen-com/` (Linux/cloud) ou `~/video-editor/` (Mac). Skills registradas em `~/.claude/skills/`.
- Ambiente novo (container limpo): rode `bash scripts/setup.sh` e depois `bash scripts/validate.sh`.

## IDs e contas (verificados em 17/ago/2026)

- **Metricool**: marca **"Profissio.ai"**, **blog_id 6736175**, timezone **America/Sao_Paulo**. Conta dona: **suporte@profissio.ai** (atenção: não é a conta da agência `suporte@mentoravirtual.com.br` usada nos estúdios irmãos; por isso só a marca Profissio.ai aparece no `getBrandSettings`).
  - Redes conectadas: Instagram **@profissio.ai**, Facebook `409732422225667`, LinkedIn `urn:li:organization:106605420`, YouTube `UCLe6lev-O9gvMh4WUt48YAQ`.
  - **Sem TikTok** no payload do `getBrandSettings`. Conectar no painel se o formato for previsto.
  - Melhor horário de publicação: medir com `getBestTimeToPostByNetwork` (marca criada em 17/ago/2026, ainda sem histórico).
- **ElevenLabs**: chave `sk_...` (51 chars) na env var `ELEVENLABS_API_KEY` do cloud environment e no `.env` do video-use. Escopos confirmados: `text_to_speech`, `speech_to_text`, `sound_generation`, `voices_read`. **Ausentes**: `user_read` e `models_read` (sem `user_read` não dá para checar saldo de créditos antes de gerar lote).
  - Voz da Profissio.ai: **PENDENTE** (definir voice_id, modelo e parâmetros. Não usar a voz clonada da Anaclaudia `XsU4z9JE7JPZzkVPg4GW`, que pertence ao ecossistema EITA).
- **Kairogen** (B-roll por IA): conta **suporte@profissio.ai**, plano **FREE**, **0 créditos**, 1 geração concorrente. **B-roll por IA indisponível até haver créditos.** Estúdios irmãos usam a conta `suporte@zavi.ag` no plano Essential (`veo3-1-lite`); decidir se esta conta faz upgrade ou se o estúdio usa a conta da agência.
- **Google Drive** (brutos): conector oficial conectado. Pasta de brutos da Profissio.ai: **PENDENTE: criar/apontar** (padrão: pasta com "qualquer pessoa com o link: leitor" para download direto).

## Rede do environment (verificado em 17/ago/2026)

O environment está com network **Custom** liberando só `drive.google.com`, `drive.usercontent.google.com` e `api.elevenlabs.io`. GitHub (incluindo Releases) passa. **Tudo o mais responde 403 no proxy**, e isso derruba parte do setup:

| Host | Status | O que quebra |
|---|---|---|
| `archive.ubuntu.com`, `security.ubuntu.com` | 403 | `apt-get` (contornado: ffmpeg estático do GitHub Releases) |
| `pypi.org`, `files.pythonhosted.org` | 403 | `pillow` (lettering/overlays), `numpy` (detecção de batidas), `librosa` e as deps do video-use |
| `registry.npmjs.org` | 403 | `npx hyperframes skills update` |

**Para o estúdio ficar 100% operacional, adicionar à lista Custom do environment**: `pypi.org`, `files.pythonhosted.org`, `registry.npmjs.org`. Opcionalmente `archive.ubuntu.com` e `security.ubuntu.com` (dispensáveis com o ffmpeg estático). Mudanças valem para **sessões novas**.

Contorno já embutido no `scripts/setup.sh`: quando o `apt` falha, baixa o build estático `ffmpeg-master-latest-linux64-gpl` do BtbN via GitHub Releases (traz libass para `subtitles` e zimg para `zscale`) e instala em `/usr/local/bin`.

## Gotchas essenciais (herdados dos estúdios irmãos, todos validados)

- Brutos de iPhone são HLG 10-bit: gerar proxy SDR uma vez antes de editar (filtro `colorspace=all=bt709:itrc=bt2020-10:iprimaries=bt2020:ispace=bt2020nc`).
- Legendas SEMPRE por último no filter chain; overlays via PIL em PNG sequence + qtrle (ou PNG estático com fade de alpha).
- Zoom animado com `zoompan`, não `crop` (crop não aceita `t` em w/h).
- video-use precisa do patch `patches/video-use-is-portrait-source.patch` (senão vertical vira paisagem).
- Metricool MCP: sem delete (cancelar = update `draft:true`; update devolve id novo); mídia por URL pública (o Metricool copia para o CDN dele na hora).
- Mac: usar ffmpeg-full keg-only com PATH explícito. Linux: ffmpeg do apt já serve.
- Cloud, brutos do Drive: environment com network **Custom** e `drive.google.com` + `drive.usercontent.google.com` + `api.elevenlabs.io` liberados. Download direto de arquivo público, qualquer tamanho: `curl -L "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`. O conector MCP do Drive serve para busca e metadados; download por ele só até ~4 MB. Fallback para arquivo público pequeno: Kairogen `download_audio_from_url`.
- Cloud, mídia pública para o Metricool: commit temporário do render na branch (repo público, `raw.githubusercontent.com` passa no proxy), agendar e remover o arquivo em seguida. Exige `git add -f` (o `.gitignore` barra mídia) com autorização do usuário. **Por isso este repo deve ser público.**
- Cloud: env var de environment antigo pode conter um key ID (64 hex) em vez da chave; a chave real da ElevenLabs é `sk_...` de 51 caracteres.
- Trilhas/SFX: ElevenLabs `sound-generation` (`/v1/sound-generation`, máx ~22s, `duration_seconds` entre 0.5 e 30) gera beds e SFX ótimos; para trilha maior, gerar build+drop e costurar com `acrossfade`. Detecção de BPM/batidas: script próprio com numpy (fluxo de energia + autocorrelação), ver `ana-conteudo/projects/teste-02-interlagos/edit/beats.py`.
- Testar escopo de chave da ElevenLabs sem gastar crédito: chamar o endpoint com parâmetro inválido. `401 missing_permissions` = escopo ausente; `400`/`404` de validação = escopo presente.

## Histórico de decisões

- **17/ago/2026**: estúdio criado a partir do template do `eita-conteudo`. Infra e gotchas técnicos herdados integralmente; marca, persona, voz, pilares e credencial **não** herdados (decisão explícita do usuário).
