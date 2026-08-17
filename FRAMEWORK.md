# Profissio.ai Conteúdo Studio: FRAMEWORK

Estúdio de edição e agendamento para as redes da **Profissio.ai**. Espelha a infraestrutura e as assinaturas de edição dos estúdios irmãos (`ana-conteudo`, `eita-conteudo`, `normalyze.conteudo`), com posicionamento próprio.

> **Seções marcadas PENDENTE ainda não foram definidas pela equipe.** Não preencher por inferência e não herdar do `eita-conteudo`. Perguntar antes de produzir qualquer texto público.

## Persona e voz do perfil

**Produto**: IA sob medida, 24/7, para Vendas, Atendimento, Suporte, Experiência e Produtividade. Plataforma unificada que integra os pontos de contato com o cliente por IA. Tagline do site: "AI built for your business's day-to-day". Detalhes e limites da fonte no `CLAUDE.md`, seção "A marca".

**Público: B2B.** Quem assiste é decisor ou operador de empresa (dono, head de vendas, head de CX, gerente de suporte), não consumidor final. O conteúdo mostra trabalho sendo resolvido, não autoajuda.

**Referência de estilo**: `@elevenlabsio` no Instagram. Marca de produto de IA que comunica por demo do produto funcionando, recorte curto e limpo, sem influencer falando para a câmera o tempo todo. Serve como referência de **formato e ritmo**, não de posicionamento.

Ainda **PENDENTE**, precisa da equipe:

- Quem fala no perfil (persona, tom, nível de formalidade; se há rosto humano recorrente ou se a marca fala sozinha).
- Credencial de quem assina, quando citada.
- CTA padrão (o site é B2B, então provavelmente agendamento de demo ou fale com especialista, mas a frase exata precisa ser definida).
- Bordões e vocabulário próprio; termos do produto a usar com consistência (extrair da Central de Ajuda).

### REGRAS INEGOCIÁVEIS

1. **Nunca usar travessão em texto público.** Reescrever a frase.
2. **Palavrão bipa, não corta** (sine 1000 Hz curto, voz mutada no trecho).
3. **Loudness final: -14 LUFS.**
4. Credencial de quem assina sempre completa e literal: **PENDENTE definir**.

## Pilares de conteúdo

**Hipóteses iniciais, a validar com a equipe e com desempenho.** Derivadas do que a Profissio.ai faz e do modelo do `@elevenlabsio`. Não produzir em cima disso sem aprovação.

| Pilar | Formato | Origem |
|---|---|---|
| A | **Demo do agente funcionando**: conversa real no WhatsApp virando reel (botões inteligentes, indicador de digitação, reações). Mostra o produto resolvendo, não explicando. | Stack visível do produto |
| B | **Caso de uso por área**: um problema concreto de Vendas, Atendimento, Suporte, Experiência ou Produtividade e como o agente resolve. | Proposta do produto |
| C | **Bastidor da engenharia**: como informação bruta vira prompt estruturado, orquestração de agentes, os três níveis de validação (IA testadora, engenharia, cliente). Diferencial forte e pouco explorado por concorrente. | Processo da empresa |
| D | **Educação e termos do produto**: explicar conceitos e funcionalidades da Central de Ajuda em formato curto. | **Central de Ajuda (Notion), fonte principal segundo o usuário** |

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
