# Profissio.ai Conteúdo Studio: FRAMEWORK

Estúdio de edição e agendamento para as redes da **Profissio.ai**. Espelha a infraestrutura e as assinaturas de edição dos estúdios irmãos (`ana-conteudo`, `eita-conteudo`, `normalyze.conteudo`), com posicionamento próprio.

> **Seções marcadas PENDENTE ainda não foram definidas pela equipe.** Não preencher por inferência e não herdar do `eita-conteudo`. Perguntar antes de produzir qualquer texto público.

## Persona e voz do perfil

**Produto**: a **COP (Customer OmniAI Platform)**, agentes de IA sob medida que vendem, atendem e escalam 24/7 em WhatsApp, Instagram, site e e-mail. Tagline oficial: **"IA à prova do dia-a-dia do seu negócio."** Detalhes completos, incluindo dores e soluções por eixo, no `CLAUDE.md`.

**Quem fala**: a **Agente Profissio.ai**, tratada no feminino em pt-BR (o site também usa "o Profissio.ai Agent" em inglês). A marca fala pelo produto funcionando, não por um rosto humano de autoridade. Não há credencial de criadora a citar, e a regra do estúdio EITA não se aplica aqui.

**Tom**: direto, competente e concreto. O site vende "tecnologia humana, poderosa, acessível e totalmente funcional" e "IA que não falha". Então nada de promessa vaga nem de hype de IA: mostrar o agente resolvendo, com número quando houver.

**Público: B2B.** Dono de negócio, head de vendas, head de CX, gerente de suporte, operação. O conteúdo mostra trabalho sendo resolvido, não autoajuda.

**Referência de estilo**: `@elevenlabsio`. Marca de produto de IA que comunica por demo do produto funcionando, corte curto e limpo, sem influencer falando para a câmera. Referência de **formato e ritmo**, não de posicionamento.

**CTAs oficiais** (usar estes, não inventar): "Conheça a plataforma" · "Quero conhecer a COP" · "Teste agora a diferença" · "Falar com o Profissio.ai Agent" · "Converse agora com a Agente Profissio.ai".

Ainda **PENDENTE**: definir com a equipe se há rosto humano recorrente (fundador, especialista) e qual CTA vira padrão para Instagram.

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

## Assinaturas de edição

Herdadas dos estúdios irmãos (validadas nos testes 01 e 02 do `ana-conteudo` e na leva @luxosobrerodas). São craft técnico, aplicáveis a qualquer marca:

- Hook verbal ou visual + título na tela nos **2 primeiros segundos**.
- Lettering condensado caps branco com sombra dura (fonte: Helvetica Neue Condensed Black no Mac; Liberation Sans Bold como fallback Linux).
  - Cor de acento nas ênfases: **rosa `#E255A0`** (`--rose-bright` do site). Apoio: violeta `#6B3CB8` e ciano `#3DBFF2`. Fundo escuro da marca: `#07060B`. O amarelo `#FFE234` é do ecossistema EITA, não usar aqui.
- Legendas frase a frase em branco (não karaokê), terço inferior, **SEMPRE por último no filter chain**.
- Cortes secos; punch-ins de zoom 1.10 a 1.22x; freeze frames P&B com card para punchlines; cutaways como payoff de piada.
- Palavrão não corta: **bipa**.
- Trilha discreta (vol ~0.12 a 0.15) gerada via ElevenLabs `sound-generation`; SFX (whoosh, impact, riser, scratch) sincronizados aos cortes.
- Duração alvo: **20 a 60s**. Loudness final: **-14 LUFS**.

## Fórmula da caption

Estrutura herdada; o conteúdo de cada bloco depende do posicionamento **PENDENTE**:

1. Hook em 1 linha (dor ou cena concreta, sem travessão)
2. 2 a 3 parágrafos curtos
3. CTA oficial (ver lista na seção Persona; para Instagram, "Falar com o Profissio.ai Agent" ou "Conheça a plataforma")
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
