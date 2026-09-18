# O produto: como o App Profissio funciona de verdade

Leitura integral da Central de Ajuda (Notion) em **18/set/2026**: 28 artigos em 4 seções, **incluindo as respostas dos FAQs em toggle**, que a leitura de agosto não tinha conseguido puxar.

Este documento existe para uma coisa: **escrever conteúdo sem inventar**. Cada afirmação aqui saiu de um artigo. Quando o produto tem um limite, uma regra da Meta ou um custo, está escrito com o número.

> Rota técnica para reler: `POST https://profissio.notion.site/api/v3/loadPageChunk` com `{"pageId":"<id>","limit":300,"cursor":{"stack":[]},"chunkNumber":0}`. O `recordMap.block` traz a árvore, com o valor aninhado em `value.value`. **Os filhos de um `toggle` não vêm no chunk da página**: é preciso chamar o mesmo endpoint passando o id do próprio toggle como `pageId`. O `syncRecordValues` está bloqueado. Script: `scripts/extrai_notion.py`.

---

## As cinco abas

| Aba | O que é |
|---|---|
| **Conversas** | Todas as interações com clientes, em tempo real. Busca, etiquetas, assumir conversa, enviar texto/áudio/imagem/documento |
| **Funil** | Pipeline por estágio, com filtro por etiqueta e período, e resumo das conversas |
| **Análises** | Cinco painéis de métrica (detalhe abaixo) |
| **Contatos** | CRM. Cadastro **automático** a partir da primeira interação, sem cadastro manual |
| **Ativações** | Envio de mensagem em escala, segmentado e agendado |

---

## Conversas: os quatro status

Esse é o conceito central do produto e o mais fácil de virar conteúdo, porque é visual e resolve uma dor real de operação.

- **Aguardando Atendente**: precisa de humano, ninguém assumiu ainda.
- **Atendente Gerenciando**: já está sob responsabilidade de uma pessoa.
- **IA Gerenciando**: o Agente está respondendo sozinho.
- **Conversas Passadas**: finalizadas ou sem interação recente.

**"Assumir conversa"** é um botão. Ao ativar, **o Agente para de responder** e o humano passa a controlar. O campo de mensagem é liberado. Ao terminar, **devolver a conversa para a IA** para o fluxo seguir.

### A janela de 24 horas

Limite da **Meta**, não da Profissio. Dentro dela você escreve livremente, manda áudio e anexo. Fora dela aparece **"Janela expirada"** e **só template funciona**. É o conceito que reaparece em quase todo artigo.

### O que dá para fazer ao assumir

Texto com **negrito e itálico** (ícones B e I), **áudio** pelo microfone, e anexo de **PDF, imagem (.jpg, .png) e documento (.doc, .xlsx)**.

---

## Quem vê o quê: três perfis

| Perfil | Pode |
|---|---|
| **Administrador** | Tudo: configurações, usuários, conversas e dados |
| **Analista** | Conversas, funil, contatos e dados — mas **não assume conversas** |
| **Operador** | Conversas, funil e contatos. Assume conversas, mas **não acessa a área de dados** |

Só administrador adiciona, define função e remove usuário. O novo usuário entra como **Pendente** até criar a senha pelo e-mail.

**Status do atendente** (canto superior direito): **Disponível** (verde) recebe conversas roteadas para humano; **Indisponível** (vermelho) não recebe novas, mas **mantém as já atribuídas**.

### Evitando dois atendentes na mesma conversa

- **Avatar colorido** = atendente ativo agora. **Avatar cinza** = já participou antes. **Vários avatares** = histórico de quem passou por ali.
- **Bloqueio temporário da caixa de texto**: enquanto a conversa está atribuída a alguém, os outros não conseguem digitar.
- Chave **"Limitar operadores às próprias conversas"** em Configurações > Geral. Com ela, o operador vê só as que aguardam atendimento, as que ele atende e as que já atendeu. **Admin e Analista continuam vendo tudo.**

---

## Etiquetas, e a parte nova: a IA etiqueta sozinha

Etiquetas organizam por etapa, temperatura do lead, tema ou urgência.

**A novidade que vale conteúdo**: ao criar a etiqueta dá para ligar a **etiquetagem por IA**. Você escreve **em linguagem natural, em até 500 caracteres**, quando aquela etiqueta deve ser aplicada, e o Agente passa a ler as conversas e colar a etiqueta sozinho.

Três regras de funcionamento, e a terceira é a mais interessante:

1. A IA só aplica **uma** etiqueta por contato: escolhe a que faz mais sentido.
2. A IA **pode trocar** a etiqueta que ela mesma colocou, se a conversa mudar de rumo.
3. **A IA nunca remove uma etiqueta colocada por humano.**

---

## Modelos de Mensagem (respostas rápidas)

Atalho digitando **`/`** mais o nome (ex.: `/saudacao`), ou pelo ícone na caixa de texto. Gerenciados em Configurações > Modelos de Mensagem.

**Variáveis disponíveis**: `{{nome}}` (nome completo do cliente como aparece no WhatsApp), `{{primeiro_nome}}`, `{{atendente}}` (quem está atendendo) e `{{saudacao}}` (bom dia / boa tarde / boa noite conforme o horário).

---

## Templates: agora criados dentro do app

Antes só pela Meta Business; hoje **também direto no App Profissio**, em Configurações > Canais > WhatsApp > aba Templates.

Campos: nome interno, texto (**até 1024 caracteres**), mídia de cabeçalho opcional (imagem, vídeo ou PDF) e **até 3 botões de resposta rápida, de 25 caracteres cada**.

**Orçamento mensal (R$)**: teto de gasto com campanhas de WhatsApp, configurado na mesma tela.

### As regras da Meta que pegam gente desprevenida

- Todo template **precisa de aprovação da Meta** antes do uso.
- Criado na Business Manager, o nome **tem que começar com `profissio_`**.
- **Não pode conter variável de nome** (`{{nome}}` não é aceito em template).
- Categorias: Marketing, Alertas, Atendimento.

### Custo

**US$ 0,06 por disparo**, cobrado só quando o template é realmente enviado. O valor é **da Meta**, cobrado direto no Business Manager por cartão. **A Profissio não põe taxa em cima.**

### Boa prática de opt-out

Incluir botão neutro de recusa ("Agora não", "Não tenho interesse", "Sair da lista"). Dar saída clara evita que o cliente marque como spam ou use o "Denunciar e Bloquear" nativo do WhatsApp — o que derruba a reputação do número e põe a conta em risco.

---

## Funil: a classificação é automática

O sistema analisa **o conteúdo das mensagens, o tipo de interação e as palavras-chave e intenções extraídas**, e **move a conversa de estágio sozinho**. Filtra por etiqueta e por data.

---

## Painel de Análises: cinco abas

**1. Geral.** Mensagens trocadas separadas por usuário / Agente / humano; **tempo economizado** (quantas horas de atendimento humano o Agente poupou); total de mensagens; total de conversas; mensagens por conversa; novas conversas iniciadas por dia.

**2. Multimídia.** Tipo de conteúdo por usuário vs Agente: texto, áudio, imagem, documento.

**3. Engajamento.** Usuários ativos diários, semanais e mensais; **taxa de retorno** (quem voltou a conversar mais de uma vez); mensagens por usuário; distribuição de atividade em faixas (1 msg, 2–5, 6–10, 11–20, 20+); e um anel com o **status da janela de 24h** (aberta em verde, fechada em vermelho).

**4. Menções.** Palavras-chave cadastradas, com total, quantas vieram **do usuário** vs **do assistente**, e conversas únicas. A coluna "pelo usuário" mede interesse espontâneo; a "pelo assistente" mostra o quanto o fluxo está empurrando o tema.

**5. Público.** País, região do Brasil e **top 20 cidades**. A localização é **inferida pelo DDD** do telefone, então não reflete a cidade exata — está escrito no artigo e **não deve ser apresentado como precisão de endereço**.

Filtros de tempo: 7, 30, 90 dias, último ano, ou período personalizado.

---

## Dados de vendas: onde o produto para de medir conversa e passa a medir dinheiro

Importação de CSV, XLS ou XLSX, de qualquer origem (ERP, planilha, e-commerce, CRM), em Configurações > Dados de Vendas.

**Campos obrigatórios**: telefone, valor da venda e data da compra. Se o sistema não mapear sozinho, dá para escolher a coluna à mão.

O sistema cruza isso com as conversas do WhatsApp, os leads atendidos e as interações do Agente, aplicando uma **janela de atribuição de 30 dias**, e separa:

- 🟢 **vendas geradas diretamente** pelo agente;
- 🟡 **vendas em que o agente participou** do processo (nutrição, qualificação, atendimento inicial).

A frase do próprio artigo resume: *"Sem essa importação, a IA só mede conversa. Com ela, a IA mede resultado financeiro real."*

> **Cuidado de comunicação**: o `Comunicacao_Profissio.md` do kit de marca é explícito — venda atribuída a conversa **não comprova receita incremental**, e porcentagem de resultado não se publica sem contexto, base e método. A atribuição é um recurso do produto, não uma prova de ROI.

---

## Ativações: disparo em escala

Nova campanha com nome, data (imediata ou agendada), lista e template.

A lista sai de **filtros**: última conversa, total de mensagens, etiquetas, **DDD** e estágio do contato. **É obrigatório pelo menos um filtro** — o produto impede lista sem segmentação, justamente para evitar disparo indevido.

Cada template disparado **gera cobrança unitária**: 3 templates para 3 pessoas = 3 envios pagos.

Acompanhamento pós-disparo: status, número de destinatários e progresso de envio.

---

## Outras funções

- **Filtro avançado de conversas**: por etiqueta, estágio, tipo de atendimento e atendente. **Salva a última escolha** e reaplica ao recarregar a página.
- **Menções**: cadastra palavra-chave e monitora em tempo real, com clique para abrir as conversas relacionadas.
- **Personalizar conversa** (ícone de varinha mágica): anotações sobre o cliente que **o Agente usa para ajustar o atendimento**. Ficam internas, o cliente não vê.
- **Gravação de áudio** direto na caixa de texto, depois de assumir a conversa.
- **Horário de atendimento**: define dias e horários em que há humano disponível. Muda **o que o Agente fala** ao cliente (se o atendimento já vai começar ou se pode demorar até o próximo dia útil), mas **o Agente transfere assim mesmo** — a conversa fica em "Aguardando Atendente".

---

## Acessos

- **PWA, não passa por loja**: iOS pelo Safari (compartilhar > "Adicionar a tela de início") e Android pelo Chrome ("Adicionar à Tela Inicial" > Instalar). Também roda no navegador em `app.profissioai.com/login`.
- **Recuperação de senha só via suporte ou CS**: não há autoatendimento. Troca de senha em avatar > Configurações > Minha conta.

### Escolher o número do WhatsApp: a decisão irreversível

A API oficial da Meta impõe:

1. O número **não pode estar** no WhatsApp comum nem no WhatsApp Business App.
2. Precisa ser verificável por SMS ou ligação.
3. Passa a ser **exclusivamente controlado pela plataforma**.
4. Uma vez na API, **não dá mais para usar no celular** — o uso vira 100% web/API.

Recomendado: chip novo só para o agente, ou fixo comercial que aceite URA. Se o número já estiver num app, ou exclui a conta lá (**apaga todo o histórico**) ou contrata número novo.

Verificação da empresa no Meta Business exige CNPJ, site, telefone comercial e contrato social, e a aprovação leva de **24h a 5 dias**.

---

## Pagamentos

- **Stripe**: o Agente envia **link seguro**; **o Agente não coleta dados de cartão no chat**. Cobrança recorrente mensal, trimestral ou anual. O cliente precisa dar **acesso de desenvolvedor** ao e-mail da Profissio no painel da Stripe.
- **Banco Inter**: conta PJ para Pix via API, com gestão de usuário por perfil (Financeiro, Contador, Administrativo) sem passar a senha mestra.

> **Habilitação por agente**: Stripe, Banco Inter e "Personalizar conversa" podem não estar ativos em todos os agentes. O artigo repete isso em cada um. Não prometer como se fosse padrão.

---

## O que isso vira em conteúdo

Cada artigo tem **vídeo de passo a passo e prints**, então há matéria-prima gravada. As pautas mais fortes, por já resolverem uma dor nomeada:

| Território | Por que funciona |
|---|---|
| Os quatro status da conversa | Visual, e resolve a dor de "quem está falando com esse cliente?" |
| A IA etiqueta sozinha, e nunca apaga o que o humano marcou | Regra com limite claro; mostra IA que respeita o trabalho da equipe |
| A janela de 24 horas | Dúvida número 1 de quem usa WhatsApp Business, e a resposta é concreta |
| Dois atendentes na mesma conversa | Bloqueio da caixa de texto é um detalhe pequeno que mostra cuidado de operação |
| Do contato ao estágio, sozinho | É a capacidade nomeada no Mapeamento Institucional ("atualização do funil de vendas") |
| Tempo economizado | Métrica que o próprio painel entrega pronta |
| Dados de vendas | Território de ROI, **com os cuidados de comunicação acima** |
| US$ 0,06 por template | Número real, e a Profissio não põe taxa: transparência vira conteúdo |

A **sequência oficial de demonstração**, que veio do kit de marca, encaixa direto: demanda recebida → contato registrado → participação humana → estágio no funil → segmentação e campanha de retomada. Mostrar **o que a pessoa faz e o que a IA faz** em cada momento.
