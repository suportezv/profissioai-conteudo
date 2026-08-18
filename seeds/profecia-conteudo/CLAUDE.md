# Profecia Conteúdo Studio (memória persistente do projeto)

Este repositório é o **Profecia Conteúdo Studio**: edição e agendamento de conteúdo para as redes do **Profecia** (`https://profec.ia.br/`). Estúdio irmão do `profissioai-conteudo`, `eita-conteudo`, `ana-conteudo` e `normalyze.conteudo`; infraestrutura idêntica, posicionamento próprio do Profecia.

**Antes de editar qualquer vídeo ou escrever qualquer caption, leia `FRAMEWORK.md`.**

> **O que se sabe do Profecia até aqui** (18/ago/2026, fontes internas da Profissio): é um produto/agente do ecossistema Profissio, listado na Documentação de CS como cliente, segmento **"Agente IA"**, ao lado de CarBro, Spotter e Viva+. A pauta "Video Hero Profecia" existe na pasta de Pautas da agência (editoria Agentes), sem desenvolvimento. **O site `profec.ia.br` ainda não foi lido** (domínio fora da allowlist do environment). Tudo que não está confirmado abaixo é **PENDENTE**: perguntar ou ler na fonte, nunca inventar, e nunca herdar posicionamento da Profissio.ai ou dos outros estúdios sem confirmação.

## PENDENTES de marca (bloqueiam produção de texto público)

- **O que é o Profecia**: proposta, público, produto. Ler `profec.ia.br` (liberar domínio) e perguntar à equipe.
- **Identidade visual**: paleta, fontes, fundos. NÃO herdar a aurora rosa da Profissio.ai sem confirmação; o Profecia pode ter identidade própria.
- **Persona e voz do perfil**: quem fala, tom, CTAs oficiais.
- **Pronúncia da marca em TTS**: hipótese "profecia" como a palavra em português; confirmar com o usuário antes da primeira locução (regra aprendida: a Profissio.ai se fala "profício ei ái").
- **Voz ElevenLabs**: voice_id próprio ou o mesmo `LetL52AJ3xLLkD3x88iE` da Profissio.ai? Confirmar.
- **Redes e Metricool**: conectar a marca do Profecia no painel (conta `suporte@profissio.ai`) e registrar aqui o blog_id.
- **Ativos de marca**: pasta no Drive com logo/fontes/fundos do Profecia, se existir.

## Regras que valem em qualquer resposta pública (herdadas do grupo, confirmadas pelo usuário)

- Nunca usar travessão em texto público: reescrever a frase.
- Palavrão em vídeo **bipa**, não corta.
- Loudness final: **-14 LUFS**.

## Working dirs

- Estúdio: este repo (symlink `~/profecia-conteudo`). Projetos em `projects/<nome>/`.
- Ferramentas: `video-use` e `hyperframes` em `/workspace/...` (cloud). Ambiente novo: `bash scripts/setup.sh` e `bash scripts/validate.sh`.

## IDs e contas

- **Metricool**: marca do Profecia **PENDENTE conectar** (conta `suporte@profissio.ai`, a mesma da marca Profissio.ai/blog_id 6736175).
- **ElevenLabs**: mesma chave do grupo (`ELEVENLABS_API_KEY` no environment). Escopos: TTS, STT, sound_generation, voices_read e **music** (Eleven Music, `POST /v1/music`, até 600s; usar para trilhas; sound-generation fica para SFX).
- **Biblioteca de SFX**: copiar `assets/sfx/` do repo `profissioai-conteudo` (13+ sons de UI validados, custo zero). São brand-neutral; a trilha musical deve ser própria por peça.
- **Kairogen**: conta `suporte@profissio.ai`, FREE, 0 créditos (B-roll por IA indisponível).
- **Drive (brutos)**: pasta do Profecia **PENDENTE**.

## Gotchas essenciais (herdados e validados nos estúdios irmãos)

Ver o `CLAUDE.md` do `suportezv/profissioai-conteudo`, seções "Rede do environment" e "Gotchas essenciais": é o repositório de referência técnica do grupo. Resumo do que mais custa tempo:

- Environment com network Custom: `pypi`/`npm` vêm em `no_proxy` e falham com 403 mesmo na allowlist; rotear pelo agent proxy (o `setup.sh` já faz). `apt` bloqueado: ffmpeg estático via GitHub Releases (o `setup.sh` já faz). Allowlist não cobre subdomínio: usar `*.dominio.com`. WebFetch tem rota própria bloqueada: usar `curl`.
- Instagram exige login mesmo com domínio liberado; feed de referência via prints/gravação do usuário.
- Metricool MCP: sem delete (cancelar = update draft:true); **update devolve id novo**; mídia por URL pública via commit temporário no repo público (por isso este repo deve ser público), remover o arquivo após agendar.
- Conector Metricool pode estar desabilitado na conversa: agendar via sessão filha no environment **Default** (sem setup script); follow-up na mesma sessão via `create_trigger` com `persistent_session_id` + `fire_trigger`.
- Render de composição do Claude Design: ver `projects/01-funil-automatico/POS.md` do repo irmão (Playwright + seek determinístico, vendorizar React/Babel do npm, fontes @fontsource, viewport 1080x1964, crop 1080:1920).
- TTS: validar pronúncia por STT antes de mixar; frases curtas de fecho com `previous_text`; "com a Agente" soa como "com a gente", evitar a sequência.
- Legendas SEMPRE por último no filter chain; proxy SDR para brutos HLG de iPhone; zoompan para zoom animado.

## Histórico de decisões

- **18/ago/2026**: estúdio criado por réplica do `profissioai-conteudo` a pedido do usuário. Infra e gotchas herdados; marca 100% PENDENTE até a leitura de `profec.ia.br` e as definições da equipe.
