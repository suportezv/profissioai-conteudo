# Case 05 · Yooper AI

**Categoria: Experiência do Cliente no WhatsApp.** Anunciante **Yooper**;
coautoria **Yooper + Profissio**.

**Duração alvo: ~2:00.** 16:9 para a inscrição; cortes verticais no fim deste
documento.

> **Estimativa, não medida.** Os tempos abaixo são de escrita. O corte se monta
> contra o arquivo de locução, nunca contra esta tabela: nos dois cases
> anteriores a estimativa errou 17% e 29% para mais.

---

## Quem é quem, e por que isso importa na tela

- **Yooper** é a agência, a anunciante.
- **Yoodash** é a plataforma dela: tráfego pago e dados de e-commerce.
- **O agente** vive no WhatsApp e lê o data lake da Yoodash.

A tela precisa ser rígida com isso, porque são três nomes parecidos num filme de
dois minutos. Regra: **a marca que assina é Yooper; a plataforma citada é
Yoodash; o agente não recebe nome próprio.**

---

## A sonora do cliente é removível, e isso é decisão de arquitetura

A **cena 04 é a única sonora do filme** e ela foi desenhada para sair sem
costura, porque a captação pode não acontecer.

Como isso é garantido, e não só torcido:

1. **A cena 03 fecha uma afirmação completa** e não anuncia a sonora. Nenhuma
   narração diz "veja o que o cliente conta".
2. **A cena 05 abre uma afirmação nova** ("E ele não só responde"), que se liga
   igualmente bem à 03 ou à 04.
3. **Nada que a sonora diz é pressuposto depois.** Ela carrega experiência, não
   informação: se sair, nenhum dado do filme fica sem origem.
4. No `Completo.tsx` ela é **um `Series.Sequence` isolado**. Tirar é apagar um
   bloco, sem retimar nada em volta.

**Sem ela o filme perde ~12 s e nada mais.** O que ele perde de argumento é o
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

| # | Tempo (estim.) | Imagem | Voz | Texto |
|---|---|---|---|---|
| **01** | 0:00 a 0:12 | Um dashboard cheio na superfície clara: cartões de métrica, gráfico, tabela. Tudo legível, tudo certo. O cursor passa por cima e **para**. Um campo de pergunta pisca e não é preenchido. | **Narração Profissio** | Toda agência de mídia entrega dashboard. O dado está lá, atualizado, completo. Mas ler um dado e decidir com ele são duas habilidades diferentes. |
| **02** | 0:12 a 0:23 | Conversa de WhatsApp recriada: a pergunta sai para o analista. O balão fica entregue. **O relógio do cabeçalho anda** e a resposta não chega. Sem drama, sem vilão. | **Narração Profissio** | Para uma pergunta mais específica, o caminho era o de sempre: mandar mensagem para o analista e esperar. Funciona. Mas depende de alguém estar disponível. |
| **03** | 0:23 a 0:38 | Cinco fontes entram como chips e convergem num nó único: mídia paga, analytics, e-commerce, CRM, orgânico. Do nó sai **uma conversa de WhatsApp**. A pergunta é em português comum; a resposta vem em número. | **Narração Profissio** | A Yooper colocou um agente de inteligência artificial dentro do WhatsApp, ligado ao data lake da Yoodash. Mídia paga, analytics, e-commerce, CRM e canais orgânicos, na mesma base, respondidos em linguagem natural. |
| **04** | 0:38 a 0:50 | **SONORA CLIENTE (removível).** Plano médio, ambiente de trabalho dele. GC com nome, cargo e empresa. | **Sonora cliente Yoodash** | *A captar.* Pauta abaixo. |
| **05** | 0:50 a 1:05 | A conversa continua e vira **ação**: "atualizar a meta de setembro?" com dois botões. O cliente confirma. A meta muda na tela do dashboard ao lado. Lettering: `nada muda sem confirmação explícita`. | **Narração Profissio** | E ele não só responde. Dentro de regras de governança, ele atualiza uma meta, ajusta um orçamento, cadastra uma demanda. Sempre com confirmação explícita antes de mudar qualquer coisa. |
| **06** | 1:05 a 1:22 | Três mensagens chegam **sem ninguém pedir**, empilhando: alerta de ruptura de estoque, relatório da semana como anexo dentro da conversa, projeção de faturamento. Depois um balão de áudio entra e outro volta, com a onda andando. | **Narração Profissio** | E antecipa. Avisa quando um produto entra em risco de ruptura, manda o relatório da semana dentro da conversa, projeta faturamento. Sem ninguém pedir. E se a pergunta vem em áudio, a resposta volta em áudio. |
| **07** | 1:22 a 1:38 | Números em motion, um por vez, com base e período colados em cada um. | **Narração Profissio** | De maio a setembro: cento e trinta e um usuários, dez mil e trinta e nove mensagens, e quase quatro em cada dez conversas fora do horário comercial. Setenta e cinco por cento dos usuários nunca precisaram falar com um humano. |
| **08** | 1:38 a 1:52 | Dois relógios: **40 minutos** encolhendo para **segundos**, e a frequência virando de semanal para diária. Depois o `12,22x` e a decisão que veio dele. | **Narração Profissio** | Um cliente pedia toda semana um ROAS que levava quarenta minutos para ser calculado. Agora leva segundos, e ele consulta todo dia. Outro viu o mês fechar em doze vírgula vinte e dois, e decidiu aumentar o investimento em vinte por cento. |
| **09** | 1:52 a 2:02 | A tese na superfície clara, e a assinatura Yooper + Profissio sobre faixa escura. | **Narração Profissio** | O valor não está em automatizar uma resposta. Está em reduzir a distância entre uma pergunta e uma decisão. |

---

## Lettering por cena

Sempre em Sora 500, tracking -3,5%.

- **03**: `mídia paga` · `analytics` · `e-commerce` · `CRM` · `orgânico` e, no nó: `data lake Yoodash`
- **05**: `nada muda sem confirmação explícita` e, discreto: `troca de conta dentro do WhatsApp · nenhum dado se mistura entre clientes`
- **06**: `ruptura de estoque` · `relatório da semana` · `projeção de faturamento`
- **07**: `131 usuários únicos · mai a 18/set/2026` · `10.039 mensagens` · `38,9% das conversas fora do horário comercial` · `75% dos usuários sem intervenção humana · 98 de 131` · `42 relatórios enviados sem pedido` · `NPS: A CONFIRMAR`
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

**O NPS entra como `A CONFIRMAR` em tela**, não como ausência silenciosa. Buraco
visível é revisável.

**Nenhuma conversa real na tela.** Todos os balões, o dashboard e os anexos são
recriados em motion. Nenhum print de cliente, nenhum dado de conta real legível.

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
| Logo Yooper (PNG com alfa ou SVG) | 09 | **pedir** |
| Logo Yoodash, se a plataforma for nomeada com marca | 03 | **pedir** · se não vier, fica só o nome em lettering |
| NPS | 07 | **pendente** · aparece como `A CONFIRMAR` até chegar |
| Contagem de **conversas** | 07 | **pendente** · ver abaixo |

---

## Dúvidas que precisam de resposta antes do master

1. **O 38,9% é de conversas, e o número de conversas não está no material.**
   Temos 10.039 mensagens, que é outra coisa. Sem o denominador, a porcentagem
   vai para a tela sem base.
2. **O título do case diz "Campanhas geridas em um clique"**, mas o que o
   material prova é conversa com confirmação, não clique. O júri lê o formulário
   junto do vídeo; vale alinhar os dois.
3. **O NPS**: quando chega, e de que base.
4. **A sonora**: acontece ou não, e até quando dá para esperar.

---

## Cortes derivados

**Vertical 60 s**: cenas 01, 03, 06, 07, 09. O problema, a virada, a
antecipação, a prova, a tese.

**Vertical 30 s**: cenas 06 e 09. A cena 06 se explica sozinha, e é a que melhor
mostra o que a categoria premia: o agente aparecendo sem ser chamado.
