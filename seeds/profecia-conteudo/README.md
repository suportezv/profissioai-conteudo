# Profecia Conteúdo Studio

Estúdio de edição e agendamento de conteúdo para as redes do **Profecia** (`profec.ia.br`), agente de IA do ecossistema Profissio. Estúdio irmão do [`profissioai-conteudo`](https://github.com/suportezv/profissioai-conteudo) (repositório de referência técnica do grupo).

- **`FRAMEWORK.md`**: persona, regras, pilares, assinaturas e fluxo por vídeo.
- **`CLAUDE.md`**: memória persistente (IDs, contas, gotchas, PENDENTES de marca).
- **`projects/`**: um subdiretório por vídeo. **`scripts/`**: setup e validação. **`patches/`**: correções de ferramentas. **`assets/sfx/`**: biblioteca de sons do grupo.

## Primeiro uso (cloud)

```bash
bash scripts/setup.sh
bash scripts/validate.sh
```

> Este repositório é **público** de propósito: o agendamento no Metricool depende de servir o render por `raw.githubusercontent.com`. Nunca commitar chaves.
