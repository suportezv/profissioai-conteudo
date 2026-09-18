# Profissio.ai Conteúdo Studio: FRAMEWORK

Estúdio de edição e agendamento para as redes da **Profissio.ai**. Espelha a infraestrutura e as assinaturas de edição dos estúdios irmãos (`ana-conteudo`, `eita-conteudo`, `normalyze.conteudo`), com posicionamento próprio.

> **Seções marcadas PENDENTE ainda não foram definidas pela equipe.** Não preencher por inferência e não herdar do `eita-conteudo`. Perguntar antes de produzir qualquer texto público.

## Persona e voz do perfil

**Produto**: a **COP (Customer OmniAI Platform)**, agentes de IA sob medida que vendem, atendem e escalam 24/7 em WhatsApp, Instagram, site e e-mail. Tagline oficial: **"IA à prova do dia-a-dia do seu negócio."** Detalhes completos, incluindo dores e soluções por eixo, no `CLAUDE.md`.

**Quem fala**: a **Agente Profissio.ai**, tratada no feminino em pt-BR (o site também usa "o Profissio.ai Agent" em inglês). A marca fala pelo produto funcionando, não por um rosto humano de autoridade. Não há credencial de criadora a citar, e a regra do estúdio EITA não se aplica aqui.

**Tom**: direto, competente e concreto. A proposta central é **"Cada conversa move o seu negócio"**: nada de promessa vaga nem de hype de IA, mostrar o agente resolvendo. **Número só com contexto, base e método** — é regra explícita do `Comunicacao_Profissio.md`, não preferência de estilo. Resultado de concorrente nunca aparece como resultado da Profissio.

**Público: B2B.** Dono de negócio, head de vendas, head de CX, gerente de suporte, operação. O conteúdo mostra trabalho sendo resolvido, não autoajuda.

**Referência de estilo**: `@elevenlabsio`. Marca de produto de IA que comunica por demo do produto funcionando, corte curto e limpo, sem influencer falando para a câmera. Referência de **formato e ritmo**, não de posicionamento.

**CTA**: **"Agendar demonstração"**, em todos os botões de conversão, sem variação. A lista antiga de CTAs foi aposentada pela revisão 3 da marca.

Ainda **PENDENTE**: definir com a equipe se há rosto humano recorrente (fundador, especialista).

### REGRAS INEGOCIÁVEIS

1. **Nunca usar travessão em texto público.** Reescrever a frase.
2. **Palavrão bipa, não corta** (sine 1000 Hz curto, voz mutada no trecho).
3. **Loudness final: -14 LUFS.**
4. **Não há credencial de criadora a citar.** Quem assina é a marca. A regra do estúdio EITA não vale aqui.

## Pilares de conteúdo

Derivados das fontes primárias. **Validar desempenho antes de fixar proporção.**

| Pilar | Formato | Matéria-prima |
|---|---|---|
| **A. Demo do agente** | Conversa real de WhatsApp virando reel: a Agente qualificando, respondendo e fechando. O site já tem o roteiro pronto na simulação **Hit&Fit** (varejo de moda), da apresentação ao botão de compra. | Site + prints do app |
| **B. Dor por eixo** | Uma dor concreta de Vendas, Atendimento, Experiência ou Operação e como a COP resolve. As dores estão literalmente listadas no `CLAUDE.md` ("perda de leads por demora na resposta", "casos repetidos consumindo o time sênior", "dados isolados em planilhas"). | Site, tabela dos quatro eixos |
| **C. Bastidor da engenharia** | O processo de 5 etapas: mergulho consultivo, engenharia de IA, teste de toda incidência, lançamento, melhoria contínua. Diferencial forte e pouco usado por concorrente. | Site |
| **D. Central de Ajuda em vídeo** | Cada dúvida frequente e cada funcionalidade vira um reel curto: janela de 24 horas, assumir conversa, status das conversas, funil automático, painel de análises, ativações, modelos de mensagem com `/`. **Os artigos já têm vídeo de passo a passo e prints para aproveitar.** | **Central de Ajuda (Notion), 28 artigos** |

**Termos do produto a usar com consistência** (vocabulário próprio, extraído da Central de Ajuda): COP, Agente, App Profissio, Conversas, Funil, Análises, Contatos, Ativações, Assumir conversa, Janela de 24 horas, Aguardando Atendente, Atendente Gerenciando, IA Gerenciando, Modelos de Mensagem, Tags/Etiquetas, Templates, Meta Business, Tempo economizado, Taxa de retorno.

## Assinaturas de motion (validadas em 18/ago/2026 contra 4 vídeos reais do @elevenlabsio)

Para peças de motion graphic (pilares B, C e D), a gramática é a da referência, adaptada à paleta da Profissio.ai. Análise completa no `CLAUDE.md`, seção "Gramática de motion". Resumo operacional:

- **Peça contínua, sem cortes secos**: estados se transformam um no outro; cada estado segura 2 a 3 segundos.
- **Superfície chapada**, num dos três modos: escuro `#101218`, claro `#F4F6F9` ou azul `#2458F5`. **Sem gradiente**: a aurora foi aposentada na revisão 3. Muito espaço negativo.
- **Tipografia contida**: Sora **peso 500**, sentence case, alinhada à **esquerda**, 1 linha curta por vez, revelação palavra a palavra (apoio do modo acendendo para a tinta) ou máquina de escrever com cursor. **`letter-spacing` sempre -3,5% do corpo.** Sem display caps gigante em motion.
- **UI real como card flutuante branco** com sombra suave; cursor navega; transições por escala.
- **Grafo de nós** (chips + linhas 1px + pontinhos viajando) para critérios, canais e orquestração.
- **CTA discreto**: texto + URL digitada com cursor piscando. Sem botão chamativo.
- Palavra-chave pontual em **azul `#2458F5`** (no modo azul, o fundo já é o acento: destacar ali some, então usar branco). Cartão ativo marcado por **borda azul**, não por glow. Trilha ambiente comedida. Master **-14 LUFS**.

As assinaturas abaixo (lettering caps com sombra dura, cortes secos, punch-ins) valem para **vídeo filmado** (pilar A com gravações reais, cortes de falas), não para motion.

## Escolha do framework de motion: HyperFrames ou Remotion

O estúdio mantém os dois, e a escolha **não é preferência do momento**: cada peça declara o seu no `BRIEFING.md`, na primeira linha. Sem isso, quem pegar o projeto depois não sabe onde mexer.

**O que decide**: a ponte entre os dois só existe num sentido. Há a skill `remotion-to-hyperframes`; **não existe o inverso**. Então peça feita em HyperFrames é definitiva, e peça feita em Remotion ainda pode migrar. Na dúvida, Remotion é a aposta reversível.

| Use **HyperFrames** quando | Use **Remotion** quando |
|---|---|
| É peça da série recorrente, na gramática já documentada | A peça é exceção, fora do padrão da série |
| Você quer o fluxo pronto: brief, storyboard, registry de ~400 blocos, legendas, áudio, render em nuvem | A composição precisa de lógica de programação, dados ou parametrização |
| O visual pedido já existe no registry (scanlines, glitch, gráfico, janela de terminal) | Você vai gerar **N variações** da mesma peça mudando nome, cupom, idioma ou número |
| Ninguém vai reprocessar a peça em outro framework | Há chance real de a peça mudar de destino depois |

**Padrão declarado: HyperFrames.** Ele é o que está integrado ao fluxo do estúdio e o que tem as 20 skills. O Remotion entra por decisão consciente, não por inércia.

**Custo de manter os dois, para vigiar**: dois `node_modules`, dois caminhos de render e dois lugares onde a paleta pode divergir. O terceiro está mitigado — os tokens do Remotion vivem em `remotion/src/marca.ts` — mas **se a paleta da marca mudar, atualizar os dois lados**. Se em alguns meses o Remotion não tiver sido usado em nada, ele vira peso morto e se corta; o inverso não vale, porque o HyperFrames é o que sustenta o fluxo.

## Assinaturas de edição (vídeo filmado)

Herdadas dos estúdios irmãos (validadas nos testes 01 e 02 do `ana-conteudo` e na leva @luxosobrerodas). São craft técnico, aplicáveis a qualquer marca:

- Hook verbal ou visual + título na tela nos **2 primeiros segundos**.
- Lettering condensado caps branco com sombra dura (fonte: Helvetica Neue Condensed Black no Mac; Liberation Sans Bold como fallback Linux).
  - Cor de acento nas ênfases: **azul `#2458F5`**. Apoio: ciano `#57E3F2`. Tinta e fundo escuro: `#101218` (nunca preto puro). O amarelo `#FFE234` é do ecossistema EITA, não usar aqui. O rosa `#E255A0` era da identidade anterior e **não vale mais**.
- Legendas frase a frase em branco (não karaokê), terço inferior, **SEMPRE por último no filter chain**.
- Cortes secos; punch-ins de zoom 1.10 a 1.22x; freeze frames P&B com card para punchlines; cutaways como payoff de piada.
- Palavrão não corta: **bipa**.
- Trilha discreta (vol ~0.12 a 0.15) gerada via ElevenLabs `sound-generation`; SFX (whoosh, impact, riser, scratch) sincronizados aos cortes.
- Duração alvo: **20 a 60s**. Loudness final: **-14 LUFS**.

## Fórmula da caption

Estrutura herdada; o conteúdo de cada bloco depende do posicionamento **PENDENTE**:

1. Hook em 1 linha (dor ou cena concreta, sem travessão)
2. 2 a 3 parágrafos curtos
3. CTA: **"Agendar demonstração"**
4. Pergunta de engajamento

## Fluxo por vídeo

1. Bruto (Drive público ou anexo na conversa) + briefing (pilar, mensagem central, duração, data). **Se a peça for motion, declarar HyperFrames ou Remotion já aqui** (ver a seção de escolha do framework)
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
