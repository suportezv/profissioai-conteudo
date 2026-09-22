# Case 05 · Yooper AI

**Categoria: Experiência do Cliente no WhatsApp.** Anunciante **Yooper**;
coautoria **Yooper + Profissio**.

**Duração do corte: 2:23** (143,2 s), 16:9 para a inscrição; cortes verticais no
fim deste documento. Sem a sonora do cliente, 2:12.

> **Os tempos abaixo são os do corte montado**, não mais os de escrita. Foram
> refeitos depois da montagem, contra as marcas de palavra que o Scribe devolveu
> em cada arquivo de locução. A locução inteira deu **100,8 s** contra os ~115 s
> estimados no roteiro original, 12% a menos, que é a terceira medição seguida
> do mesmo erro para mais (case 03: −17%, case 04: −29%).

---

## Quem é quem, e por que isso importa na tela

- **Yooper** é a agência, a anunciante.
- **Yoodash** é a plataforma dela: tráfego pago e dados de e-commerce.
- **O agente** vive no WhatsApp e lê o data lake da Yoodash.

A tela precisa ser rígida com isso, porque são três nomes parecidos num filme de
dois minutos. Regra: **a marca que assina é Yooper; a plataforma citada é
Yoodash; o agente não recebe nome próprio.**

---

## Duas sonoras, e só uma delas é removível

O filme tem **duas falas captadas**, e elas cobrem buracos diferentes:

| Cena | Quem | Sobre o quê | Sai? |
|---|---|---|---|
| **04** | um cliente da Yoodash | satisfação e relacionamento | **sim**, sem costura |
| **05B** | Clésio Souza, Profissio | governança: por que ele nunca muda nada sozinho | **não** |

**A do Clésio não sai porque ela responde a objeção que a cena 05 abre.** Um
agente que escreve na base do cliente é a primeira coisa que um júri questiona,
e nenhuma cena de motion responde "por que confiar nisso" tão bem quanto a
pessoa que desenhou a regra. Testemunha existe para cobrir o buraco que o júri
vai procurar.

> **As duas sonoras do Clésio, esta e a do case MODO Soldiers, se captam na
> mesma sessão.** São dois filmes parados pela mesma pessoa.

### Por que a do cliente pode sair

A cena 04 foi desenhada para sair sem costura, porque a captação pode não
acontecer.

Como isso é garantido, e não só torcido:

1. **A cena 03 fecha uma afirmação completa** e não anuncia a sonora. Nenhuma
   narração diz "veja o que o cliente conta".
2. **A cena 05 abre uma afirmação nova** ("E ele não só responde"), que se liga
   igualmente bem à 03 ou à 04.
3. **Nada que a sonora diz é pressuposto depois.** Ela carrega experiência, não
   informação: se sair, nenhum dado do filme fica sem origem.
4. No `Completo.tsx` ela é **um `Series.Sequence` isolado**. Tirar é apagar um
   bloco, sem retimar nada em volta.

**Sem ela o filme perde 11 s e nada mais** (2:23 vira 2:12). O que ele perde de argumento é o
critério "satisfação dos clientes", que passa a depender só do NPS.

---

## O que a categoria pede, e onde cada critério é respondido

| Critério | Cena | Como o filme responde |
|---|---|---|
| **Qualidade da experiência** | 03, 05, 06 | Linguagem natural sobre a base inteira, resposta em áudio, relatório dentro da conversa |
| **Personalização** | 03, 08 | O agente cruza campanhas e regras **daquela conta**, não relatório pré-formatado. O ROAS de 40 minutos é exatamente isso |
| **Eficiência no atendimento** | 07, 08 | 75% dos usuários sem intervenção humana, 38,9% fora do horário, 40 minutos virando segundos |
| **Satisfação dos clientes** | 04, 07 | **É o critério mais fraco hoje.** O NPS não chegou e a sonora pode não acontecer |
| **Fortalecimento do relacionamento** | 06, 09 | O agente antecipa sem ser perguntado; a conversa deixa de ser "me manda esse número" |

> **A satisfação é o buraco, e é por isso que a sonora fala dela.** Se a
> captação não sair, a cena 07 fica sozinha nesse critério com o NPS pendente, e
> vale avisar o júri no formulário escrito em vez de deixar a lacuna implícita.

---

## Cena a cena

| # | Tempo (corte) | Imagem | Voz | Divergência do plano |
|---|---|---|---|---|
| **00** | 0:00 a 0:04,2 | **Abertura conceitual, gerada no Veo.** Sala de reunião vazia à noite, cadeiras encostadas na mesa e a tela grande da parede ainda ligada, estourada e ilegível. Dolly lento para a frente. Sem narração, sem lettering. | silêncio + som de sala | Cena nova, e o quarto plano gerado: os três anteriores davam clima e não diziam nada sobre "toda agência entrega dashboard". Aqui a entrega aconteceu e a decisão não |
| **01** | 0:04,2 a 0:15,8 | Dashboard recriado na superfície clara, em cinza de interface. O cursor percorre cartões e tabela e **estanca** em "mas". O painel recua atrás de um véu e sobe **a pergunta que ele não responde**: "então, eu aumento o investimento em prospecção ou não?" | Narração | Era um campo de busca vazio, que fala de interface enquanto a narração fala de decisão. A pergunta real mostra a distância que o filme inteiro trata |
| **02** | 0:15,8 a 0:29,3 | Cinco mensagens do cliente em três dias, com as marcações de data entre elas, todas com **dois checks cinza**. A última, já em silêncio depois da narração, cai com **um check só**. À direita, só a sobrelinha e a frase. | Narração | A coluna da direita carregava "entregue, não lido", uma barra de espera e "três dias", e a conversa já mostrava as três coisas. Lettering que repete a tela transforma prova em legenda |
| **03** | 0:29,3 a 0:45,1 | Cinco fontes entram como chips e **convergem em curva** no nó `data lake Yoodash`. Em "na mesma base" os pulsos viajam. Só então o painel do WhatsApp cresce do nó, com a troca em linguagem natural. | Narração | O painel entrava em "dentro do WhatsApp" (3,5 s) e ficava nove segundos como retângulo preto vazio. Agora entra em 12,3 s, com o que mostrar |
| **04** | 0:45,1 a 0:56,1 | **SONORA CLIENTE, REMOVÍVEL.** Hoje é cartão de lacuna com barra escoando. | Sonora cliente | *A captar* |
| **05** | 0:56,1 a 1:10,5 | Cartão de ação no chat com dois botões. O ponteiro vai até `Confirmar` e **pressiona**; só depois a meta muda no cartão ao lado. Três ações nomeadas à direita, uma encenada. | Narração | Encenar as três ações com botão encheria a tela de repetição e tiraria o peso do único gesto que importa |
| **05B** | 1:10,5 a 1:23,5 | **SONORA CLÉSIO.** Hoje é cartão de lacuna. | Sonora Profissio | Cena nova, não prevista no plano |
| **06** | 1:23,5 a 1:40,3 | Três mensagens do agente **seguidas, sem nada do outro lado**, empilhando e saindo por cima: ruptura, relatório em PDF, projeção. Depois áudio do cliente e áudio de volta, com a onda correndo. | Narração | Os `42 relatórios enviados proativamente` migraram da cena 07 para cá: colados na frase que sustentam, são evidência |
| **07** | 1:40,3 a 1:57,2 | 131, 10.039 e 38,9% como contadores. O **75% vira contagem**: 131 pontos, 98 acesos. | Narração | O 75% ganhou desenho próprio porque é a afirmação que a categoria premia, e o desenho carrega a base junto |
| **08** | 1:57,2 a 2:13,2 | **Cliente A** e **Cliente B** ganham rosto: um ícone que abre o sorriso no frame do resultado de cada um. A barra de 40 minutos encolhe para segundos; um ponto por semana vira sete. Depois o `12,22x`, com a autoria do número separada por escrito, e o `+20%` como decisão do cliente. | Narração | Os rostos são SVG com expressão animada, não emoji de fonte: o render headless não tem fonte de emoji, e um desenho animado diz o que um caractere parado não diz |
| **09** | 2:13,2 a 2:23,2 | `uma pergunta` e `uma decisão` nascem nas bordas opostas com a distância pontilhada entre elas, e **andam uma para a outra** em "decisão". Assinatura Yooper + Profissio sobre faixa escura. | Narração | O lockup já carrega o wordmark branco real da Yooper: a arte final chegou em 22/set e a caixa tracejada saiu |

## Lettering por cena

Sempre em Sora 500, tracking -3,5%.

- **03**: `mídia paga` · `analytics` · `e-commerce` · `CRM` · `orgânico` e, no nó: `data lake Yoodash`
- **05**: `nada muda sem confirmação explícita` e, discreto: `troca de conta dentro do WhatsApp · nenhum dado se mistura entre clientes`
- **06**: `ruptura de estoque` · `relatório da semana` · `projeção de faturamento`
- **06** (fecho): `42 relatórios enviados proativamente · maio a 18/set/2026`
- **07**: `131 usuários únicos · maio a 18/set/2026` · `10.039 mensagens · no mesmo período` · `38,9% das conversas fora do horário comercial · 54 conversas · maio a 18/set/2026` · `75% dos usuários nunca precisaram falar com um humano · 98 de 131 usuários · NPS: a confirmar`
- **08**: `um cliente, um cálculo recorrente · de semanal para diário` · `ROAS faturado 12,22x no mês` · `decisão do cliente: +20% de investimento`
- **09**: `Yooper` · `Profissio`

---

## Cuidados que não são opcionais

**O agente não fez o 12,22x, ele mostrou o 12,22x a tempo.** A tela precisa
separar as duas coisas: o ROAS é resultado da operação de mídia do cliente, e o
que o case reivindica é ter posto esse número na frente de quem decide, no
momento em que decidia. Escrever "o agente gerou 12,22x" seria falso e é
exatamente o que o `Comunicacao_Profissio.md` chama de atribuição virando
resultado.

**Os 40 minutos são um caso, não uma média.** O lettering diz "um cliente, um
cálculo recorrente". Número de eficiência sem base vira dúvida quando o júri
compara com o formulário.

**O NPS e o denominador do 38,9% entram como `a confirmar` em tela**, em rosa,
não como ausência silenciosa. Buraco visível é revisável.

**O 75% é arredondamento de 74,81%**, que é o número que o cliente informou e o
que a locução diz. O arredondamento fica transparente porque a base, 98 de 131,
está na mesma tela logo abaixo dos pontos.

**Nenhuma conversa real na tela.** Todos os balões, o dashboard e os anexos são
recriados em motion. Nenhum print de cliente, nenhum dado de conta real legível.
As legendas `tela recriada · dados ilustrativos` saíram das quatro cenas a
pedido do cliente em 22/set: a regra continua valendo, mas a ressalva passa a
morar no formulário escrito, onde há espaço para explicar.

**Três nomes parecidos.** Yooper assina, Yoodash é a plataforma, o agente não
tem nome próprio. Em nenhuma cena os três aparecem juntos como se fossem pares.

---

## Pauta da sonora do cliente (cena 04)

**Quem**: um cliente da Yoodash que usa o agente no dia a dia. O do caso do ROAS
seria o ideal, porque ele vive a história da cena 08.

**Do que ela precisa falar**: **satisfação e relacionamento**, que é o critério
onde o filme está mais fraco. Não de funcionalidade, que as cenas 05 e 06 já
provam sozinhas.

**Perguntas que puxam a resposta certa**, em ordem:

1. O que mudou no seu dia depois que você passou a perguntar pelo WhatsApp em
   vez de abrir o painel?
2. Tem alguma coisa que você consulta hoje e que antes você não consultava, ou
   consultava menos?
3. Sobre o que você conversa com o time da Yooper agora, que não era sobre o que
   vocês conversavam antes?

A terceira é a que vale mais: ela é literalmente o critério de fortalecimento de
relacionamento, e é a única resposta que nenhuma cena de motion consegue dar.

**Se não rolar**: a cena sai inteira e o filme fecha em ~1:50. Nada é retimado.

---

## Assets que precisam vir de fora

| Asset | Cena | Situação |
|---|---|---|
| Sonora do cliente | 04 | **captar** · pode não acontecer, e o filme está preparado |
| Sonora do Clésio | 05B | **captar** · não sai do filme · mesma sessão da sonora do Soldiers |
| Logo Yooper (PNG com alfa) | 09 | **recebido** em 22/set · `remotion/public/marca-yooper/yooper-branco.png` |
| Avatar da Yoodash | 03, 05, 06 | **recebido** em 22/set · é o contato das três conversas recriadas |
| NPS | 07 | **pendente** · aparece como `A CONFIRMAR` até chegar |
| Contagem de **conversas** | 07 | **pendente** · ver abaixo |

---

## Dúvidas que precisam de resposta antes do master

1. ~~O 38,9% não tem denominador.~~ **Resolvido em 22/set**: são 54 conversas
   fora do horário comercial, e é esse número que vai na régua abaixo do
   percentual.
2. **O título do case diz "Campanhas geridas em um clique"**, mas o que o
   material prova é conversa com confirmação, não clique. O júri lê o formulário
   junto do vídeo; vale alinhar os dois.
3. **O NPS**: quando chega, e de que base.
4. **A sonora do cliente**: acontece ou não, e até quando dá para esperar.
5. **A pronúncia de Yooper e Yoodash.** O TTS lê "iúper" e "iúdash", e o Scribe
   devolve "Youper" e "YouDash", o que confirma que é isso que sai do arquivo.
   Se a casa pronuncia de outro jeito, as duas faixas se regravam.
6. **A trilha**: uma só, em `trilha/mapa.json`, com variação de arranjo e
   pontos de tensão. Foram duas rodadas recusadas antes: três candidatas em
   loop único ("genéricas, não acompanham o filme") e uma versão com peças
   diferentes por movimento ("uma totalmente diferente da outra, chamando
   atenção"). O material agora é um só em três densidades.

---

## Cortes derivados

**Vertical 60 s**: cenas 00, 01, 03, 06, 07, 09. O problema, a virada, a
antecipação, a prova, a tese.

**Vertical 30 s**: cenas 06 e 09. A cena 06 se explica sozinha, e é a que melhor
mostra o que a categoria premia: o agente aparecendo sem ser chamado.
