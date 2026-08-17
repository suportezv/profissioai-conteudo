# Profissio.ai Conteúdo Studio

Estúdio de edição e agendamento de conteúdo para as redes da **Profissio.ai**. Mesma infraestrutura dos estúdios irmãos ([`ana-conteudo`](https://github.com/suportezv/ana-conteudo), [`eita-conteudo`](https://github.com/suportezv/eita-conteudo), [`normalyze.conteudo`](https://github.com/suportezv/normalyze.conteudo)); posicionamento próprio da Profissio.ai.

- **`FRAMEWORK.md`**: persona, regras, pilares, assinaturas de edição e fluxo por vídeo.
- **`CLAUDE.md`**: memória persistente do projeto (IDs, contas, gotchas).
- **`projects/`**: um subdiretório por vídeo (briefing, transcrição, scripts de edição, caption).
- **`scripts/`**: setup e validação do ambiente (Linux/cloud).
- **`patches/`**: correções necessárias nas ferramentas.

## Primeiro uso (cloud)

```bash
bash scripts/setup.sh
bash scripts/validate.sh
```

Depois: coloque o bruto no Drive (pasta pública) ou anexe na conversa, escreva o briefing em `projects/<nome>/` e peça a edição.

| Serviço | Uso | Configuração |
|---|---|---|
| Google Drive | Brutos | Conector oficial + domínios liberados no environment |
| Metricool | Agendamento | Marca Profissio.ai, blog_id 6736175 |
| ElevenLabs | Transcrição, trilha, SFX, TTS | Chave `sk_...` na env var e no `.env` do video-use |
| Kairogen | B-roll por IA | Conta suporte@profissio.ai (FREE, sem créditos) |

> Este repositório é **público** de propósito: o agendamento no Metricool depende de servir o render por `raw.githubusercontent.com`. Nunca commitar chaves aqui.
