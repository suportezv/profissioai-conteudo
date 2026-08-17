# Profissio.ai Conteúdo Studio: FRAMEWORK

Estúdio de edição e agendamento para as redes da **Profissio.ai**. Espelha a infraestrutura e as assinaturas de edição dos estúdios irmãos (`ana-conteudo`, `eita-conteudo`, `normalyze.conteudo`), com posicionamento próprio.

> **Seções marcadas PENDENTE ainda não foram definidas pela equipe.** Não preencher por inferência e não herdar do `eita-conteudo`. Perguntar antes de produzir qualquer texto público.

## Persona e voz do perfil

- Produto / proposta da Profissio.ai: **PENDENTE**.
- Quem fala no perfil (persona, tom, nível de formalidade): **PENDENTE**.
- Credencial de quem assina, quando citada: **PENDENTE**.
- CTA padrão: **PENDENTE**.
- Bordões e vocabulário próprio: **PENDENTE**.

### REGRAS INEGOCIÁVEIS

1. **Nunca usar travessão em texto público.** Reescrever a frase.
2. **Palavrão bipa, não corta** (sine 1000 Hz curto, voz mutada no trecho).
3. **Loudness final: -14 LUFS.**
4. Credencial de quem assina sempre completa e literal: **PENDENTE definir**.

## Pilares de conteúdo

**PENDENTE.** Definir com a equipe antes do primeiro vídeo. Formato da tabela, para preencher:

| Pilar | Formato | Referência |
|---|---|---|
| A | | |
| B | | |
| C | | |
| D | | |

## Assinaturas de edição

Herdadas dos estúdios irmãos (validadas nos testes 01 e 02 do `ana-conteudo` e na leva @luxosobrerodas). São craft técnico, aplicáveis a qualquer marca:

- Hook verbal ou visual + título na tela nos **2 primeiros segundos**.
- Lettering condensado caps branco com sombra dura (fonte: Helvetica Neue Condensed Black no Mac; Liberation Sans Bold como fallback Linux).
  - Cor de acento nas ênfases: **PENDENTE** (usar a cor da identidade da Profissio.ai. O amarelo `#FFE234` é do ecossistema EITA, não usar aqui).
- Legendas frase a frase em branco (não karaokê), terço inferior, **SEMPRE por último no filter chain**.
- Cortes secos; punch-ins de zoom 1.10 a 1.22x; freeze frames P&B com card para punchlines; cutaways como payoff de piada.
- Palavrão não corta: **bipa**.
- Trilha discreta (vol ~0.12 a 0.15) gerada via ElevenLabs `sound-generation`; SFX (whoosh, impact, riser, scratch) sincronizados aos cortes.
- Duração alvo: **20 a 60s**. Loudness final: **-14 LUFS**.

## Fórmula da caption

Estrutura herdada; o conteúdo de cada bloco depende do posicionamento **PENDENTE**:

1. Hook em 1 linha (dor ou cena concreta, sem travessão)
2. 2 a 3 parágrafos curtos
3. CTA (**PENDENTE** definir a frase padrão)
4. Pergunta de engajamento

## Fluxo por vídeo

1. Bruto (Drive público ou anexo na conversa) + briefing (pilar, mensagem central, duração, data)
2. Proxy SDR (se HLG) + transcrição Scribe (timestamps por palavra)
3. Decupagem/cortes (mapear falas de impacto e picos de áudio)
4. Cor
5. Lettering/motion (PIL, PNGs com fade de alpha)
6. **Legendas por último**
7. Trilha + SFX (`sound-generation`; batidas detectadas por script)
8. **Preview 720p+ para aprovação na conversa** (não agendar antes da aprovação)
9. Caption
10. Agendamento no Metricool como rascunho (marca Profissio.ai, blog_id **6736175**; melhor horário: medir com `getBestTimeToPostByNetwork` quando houver histórico)

## Gotchas técnicos

Ver a seção "Gotchas essenciais" do `CLAUDE.md` deste repo (herdados e validados nos estúdios irmãos). Histórico completo: repo `suportezv/ana-conteudo`.
