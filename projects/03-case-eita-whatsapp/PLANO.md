# Plano de execução · Case EITA no WhatsApp

Roteiro aprovado, moodboard aprovado, voz escolhida: **Lair** (`4r3G9XKliGgVZLKMgjik`).
Teto de gasto com vídeo gerado: **US$ 30**.

---

## Como executar: por trilha, não por cena

Cada cena mistura material de quatro origens diferentes, e cada origem tem um
prazo próprio. Executar cena a cena obriga a parar em toda cena para esperar
uma captação que não foi agendada. Executar tudo de uma vez é pior, porque
gera b-roll antes de saber de quantos segundos é o buraco.

A ordem abaixo põe primeiro o que não depende de ninguém, e deixa o que custa
dinheiro para o fim, quando o buraco já está medido.

### Bloco 1 · Locução completa — **feito**

Seis arquivos em `locucao/cena-NN.mp3`, um por cena de narração, na voz Lair.
Separados de propósito: locução em bloco único obriga a cortar no editor e o
tempo de cada cena deixa de ser verificável.

| Cena | Reservado | Medido | Sobra |
|---|---|---|---|
| 01 | 7,0 s | 6,36 s | +0,64 s |
| 03 | 16,0 s | 12,45 s | +3,55 s |
| 04 | 19,0 s | 15,84 s | +3,16 s |
| 06 | 17,0 s | 14,86 s | +2,14 s |
| 08 | 12,0 s | 9,85 s | +2,15 s |
| 09 | 7,0 s | 5,48 s | +1,52 s |
| **total** | **78 s** | **64,8 s** | **+13,2 s** |

**Os 13 segundos de sobra são o achado deste bloco.** A tabela do roteiro era
estimativa; o arquivo é fato. Documentário precisa de ar, então a sobra não
vira cena nova: vira respiro antes e depois de cada fala, e folga para a
imagem segurar mais um beat. Nenhuma cena ficou apertada.

Texto de locução difere do texto do roteiro em dois pontos deliberados: a marca
vai na grafia fonética (**Profício ei ái**) e a sigla IA vai soletrada, senão o
sintetizador lê "ia" como palavra. As seis faixas foram conferidas por
transcrição automática e voltaram corretas.

### Bloco 2 · Motion no Remotion — **feito**

Seis composições registradas em `remotion/src/Root.tsx`, renderizadas e
conferidas frame a frame. Duração tirada do mp3 de cada cena, não da tabela.

| Cena | Composição | Duração | O que faz |
|---|---|---|---|
| 01 | `CaseEitaCena01` | 7,0 s | a mensagem com **um** check |
| 03 | `CaseEitaCena03` | 14,0 s | linha do tempo 2017 · 2020 · 2025, com o dado em chip |
| 06 | `CaseEitaCena06` | 16,5 s | três cartões, um aceso por vez, e os três "não" no fim |
| 07 | `CaseEitaCena07` | 8,0 s | mesma tela, **dois** checks azuis, o áudio chegando e tocando |
| 08 | `CaseEitaCena08` | 11,5 s | um número por vez, cada um com a sua base |
| 09 | `CaseEitaCena09` | 7,5 s | a tese e a assinatura |

Renders em `remotion/out/`, e a versão para montagem em `remotion/out/tv/`,
já com a faixa de cor corrigida.

**Três coisas que só apareceram olhando o render**, e que ficam de aviso:

1. **A 07 perdeu o enquadramento por causa do teclado.** Sem ele a área de
   conversa cresce, a mensagem desce e sai do quadro no corte fechado. O
   teclado voltou (e é o que acontece de verdade: ninguém fecha o teclado para
   esperar resposta), e virou `TecladoWhatsApp.tsx`, compartilhado com a 01.
   As duas cenas precisam ser reconhecidamente a **mesma** conversa.
2. **Layout centralizado num quadro de 1080p engana.** A 03 e a 06 nasceram com
   a massa no terço de cima e um vazio embaixo que parecia bug. Resolvido com a
   grade da marca: sobrelinha no alto, conteúdo no meio, apoio na base.
3. **Contador tem que parar no número exato.** O de 75,7% foi conferido no
   último frame: parar em 74,2% seria erro de dado na tela, não detalhe de
   animação.

**A faixa de cor precisa de um passo a mais.** O Remotion entrega `yuvj420p`,
faixa cheia; player e editor esperam faixa de TV. `scripts/corrige_faixa.sh`
converte e **confere o resultado**, em vez de confiar no comando.

### Corte de montagem, com lacunas — **feito**

`CaseEitaCompleto` no Remotion junta tudo que existe e **ocupa com cartão de
lacuna o que falta**, no tempo que a cena vai ter. Serve para julgar o filme
antes da captação: se o ritmo não funciona aqui, não vai funcionar depois.

| Entra em | Trecho | Duração | Estado |
|---|---|---|---|
| 0:00 | 01 · o campo digitando, nunca enviado | 8,0 s | **pronto** |
| 0:08 | 02 · sonora Anaclaudia | 13,0 s | lacuna |
| 0:21 | 03 · a tentativa de 2017 | 14,0 s | **pronto** |
| 0:35 | 04 · o desafio | 17,5 s | **pronto**, b-roll gerado |
| 0:52 | 05 · sonora Clésio | 12,0 s | lacuna |
| 1:04 | 06 · as três escolhas | 16,5 s | **pronto** |
| 1:21 | 07 · dois checks e o áudio | 8,0 s | **pronto** |
| 1:29 | 07 · sonora, a reação | 7,8 s | **pronto**, material real |
| 1:37 | 08 · os números | 11,5 s | **pronto** |
| 1:48 | 09 · a tese e a assinatura | 7,5 s | **pronto** |
| | **total** | **1:56** | |

**O corte dá 1:56, não 2:00, e a diferença é real, não arredondamento.** Duas
causas: a locução saiu 17% mais curta que a estimativa do roteiro, e a cena 01
tem os **8 s do clipe do Veo**, não os 11 s da tabela (o modelo não passa de 8 s
por clipe). Os 4 s que faltam vão aparecer sozinhos quando as duas sonoras
reais entrarem, porque gente falando raramente cabe no tempo que alguém previu:
a reação da Anaclaudia, que estava reservada em 5 s, já chegou com 7,8 s. Se
sobrar, o lugar de gastar é respiro antes e depois de cada sonora, não cena
nova.

**Se for preciso fechar 2:00 sem as sonoras**, o caminho barato é a cena 01: o
plano pode rodar a 0,73x e virar 11 s sem tocar no motion, que é independente
do vídeo. Fica mais lento, o que ajuda a cena. Não fiz porque a 01 está
aprovada como está.

**O corte já tem trilha e efeitos, mas não está mixado.** Cada elemento está no
ganho em que foi colocado; o master a -14 LUFS é o último passo, depois das
sonoras.

- **Efeitos**: banco de seis sons gerados na ElevenLabs (`remotion/public/sfx/`),
  colocados pelo componente `Sfx`. Os toques de tecla da cena 01 **saem da mesma
  linha do tempo que desenha o texto** (`toques()` em `digitacao.ts`), então
  imagem e som não podem divergir: não existe uma segunda tabela para manter em
  dia. Um som por caractere vira zumbido a 19 caracteres por segundo, então o
  passo é a cada 2 digitando e a cada 3 apagando.
- **Trilha**: um leito só, do primeiro ao último frame, com a curva de volume
  escrita em `Completo.tsx` (`volumeTrilha`). Entra de baixo, desce para o leito
  quando a primeira narração começa, sai no fim. **Sem degrau por cena**: trilha
  que sobe e desce a cada corte chama atenção para si, e o pedido era o
  contrário.

### Bloco 3 · Pedidos externos, disparados em paralelo com o bloco 2

Não bloqueiam nada dos blocos 1 e 2, mas têm o prazo mais longo, então saem no
mesmo dia em que o bloco 2 começa.

- **Agendar as duas sonoras.** Anaclaudia (cenas 02 e 07) e Clésio (cena 05).
  Mesma gramática de luz nas duas: janela, cortina fina, plano médio, tripé
  travado. A referência de luz está no artboard de fotografia do moodboard.
- **Pedir à EITA**: print ou vídeo do app de 2017, o áudio real do produto na
  voz clonada (com aprovação e checagem de LGPD) e o logo para o lockup.
- **Decidir o bastidor da cena 04**: filmar a equipe real ou gerar. Ver o
  orçamento abaixo, porque essa é a única decisão que muda o custo de verdade.

### Bloco 4 · B-roll no Veo — **feito para a cena 04**

Só depois que a locução estiver cortada e o motion montado, porque aí se sabe
exatamente quais segundos sobraram sem imagem. Gerar antes é comprar tinta
antes de medir a parede.

**Gasto: US$ 4,80 de US$ 30.** Três clipes de 4 s, `lote-veo-cena04.json`.

**Os cortes da cena 04 saem das pausas da própria locução.** Os silêncios do
arquivo foram medidos com `silencedetect` e caem em 1,96 / 11,48 / 14,24 /
15,53 s; somado o atraso de 0,6 s, é neles que a imagem vira. Cortar em cima da
respiração é o que faz um corte seco parecer intencional em vez de apressado.

**O clipe de bastidor que já existia não podia carregar a cena sozinho.** Ele é
o laboratório azul escuro de banco de imagem, e sozinho empurra um filme de
saúde mental para thriller de tecnologia, que é exatamente a leitura recusada no
moodboard. Ele continua na cena, mas **no meio e cercado de luz de dia**: alguém
desenhando o fluxo num quadro, dupla conversando na frente do laptop, mãos no
teclado com luz de janela. O arco vira gente → foco → gente, e o azul frio passa
a ler como concentração em vez de cenário.

Três coisas que a geração ensinou, e que custam dinheiro quando esquecidas:

1. **Sem `--resolucao 1080p` a API entrega 720p**, e o padrão não avisa. Os três
   primeiros clipes saíram pequenos e foram para `broll/720p-descartado/`; o
   material em uso é o mesmo, reescalado com `lanczos`. Refazer em 1080p custaria
   outros US$ 4,80 e **esbarrou na cota diária** (429 sem `QuotaFailure` nos
   detalhes, que é limite de requisições e não falta de crédito — a falta de
   crédito vem como 402 com "prepayment credits are depleted"). Fica como
   pendência barata: regerar no dia seguinte com a flag certa.
2. **Vídeo gerado traz marca de terceiro sem avisar.** O plano das mãos no
   teclado tinha o logo de um fabricante no monitor ao fundo. Resolvido com
   `crop` de 1,25x, que ainda melhorou o enquadramento. Conferir cada clipe
   quadro a quadro antes de montar, não depois.
3. **O preço por segundo continua não verificado.** O orçamento usa US$ 0,40/s,
   que é o teto conservador: se o real for menor, sobra. Ver "medir o preço"
   acima.

---

## O que custa dinheiro e o que não custa

Dos 120 segundos do filme, vídeo gerado aparece em **cerca de 16**, ou 13%.

| Origem | Segundos | Custo em Veo |
|---|---|---|
| Motion no Remotion (01, 06, 07, 08, 09 e parte da 03) | ~60 s | zero |
| Sonoras filmadas (02, 05 e a reação da 07) | ~30 s | zero |
| Bastidor filmado (04) | 19 s | zero no cenário A |
| Arquivo da EITA (app de 2017, áudio do produto) | ~6 s | zero |
| **Inserts em Veo** | **~16 s** | **pago** |

Além disso, **os quatro clipes já gerados são material final, não rascunho**:
1920x1080, 24 fps, 8 s cada, em `broll/`. Foram pagos e entram na montagem.

---

## Orçamento

**Teto: US$ 30 a partir de 21/set/2026.** O que foi gasto antes disso não conta,
por decisão do usuário, e os créditos já foram repostos. Os quatro clipes já
gerados continuam valendo como material final, então entram na montagem sem
custo novo.

### Com essa base, o modelo bom cabe

| | segundos | no modelo padrão | no Fast |
|---|---|---|---|
| Os 4 inserts, sem repetir nenhum | 16 s | ~US$ 6 | ~US$ 2 |
| Com 1 repetição por clipe, que é o realista | 32 s | ~US$ 13 | ~US$ 5 |
| Com 2 repetições, o pior caso | 48 s | ~US$ 19 | ~US$ 7 |

**Recomendação: usar `veo-3.1-generate-preview` (o padrão, não o Fast).** Com o
teto recontado, até o pior caso deixa mais de US$ 10 de folga, e a diferença de
qualidade aparece justo em plano curto com foco raso, que é o que estes inserts
são. O Fast fica como plano B se a repetição passar do previsto.

> Os valores acima usam um preço por segundo **não verificado**. `ai.google.dev`
> e a página da Vertex seguem fora da allowlist, e a API não expõe consumo. Ver
> "medir o preço" abaixo: são dois minutos e transforma a tabela em aritmética.

### Medir o preço, não estimar

No `ai.studio/projects`, gerar um clipe de 4 s e comparar o saldo antes e
depois. A divisão dá o preço exato por segundo, sem depender de tabela
publicada. Com esse número, `scripts/gera_video_veo.py` faz a conta sozinho e
**recusa o lote** que passar do teto.

```
python3 scripts/gera_video_veo.py \
  --lote projects/03-case-eita-whatsapp/lote-veo.json \
  --pasta projects/03-case-eita-whatsapp/broll \
  --modelo veo-3.1-generate-preview \
  --teto-usd 30 --preco-seg <o numero medido> --simular
```

O script mantém um livro de gastos em `broll/veo-gastos.json` e soma o
acumulado a cada geração. Sem preço informado ele **para** em vez de chutar.

### Os três controles de custo, do mais forte para o mais fraco

1. **Duração.** A cobrança é por segundo e o mínimo é 4 s. Um insert de 4 s
   custa metade de um de 8 s, e insert de documentário não precisa de 8 s.
   Todo o lote planejado usa 4 s.
2. **Modelo.** O Fast custa uma fração do padrão. Com o teto recontado não
   precisamos dele, mas ele existe se a repetição passar do previsto.
3. **Repetição.** É o custo que os planos esquecem: raramente o primeiro take
   serve. Orçar 2 tentativas por clipe e tratar isso como custo normal.

### Os dois cenários de bastidor

**Cenário A, recomendado: bastidor da cena 04 filmado.** É o que o lote assume.

**Cenário B: bastidor da cena 04 gerado.** Mais 3 clipes de 8 s. Cabe no teto
recontado, mas é pior para o júri: o roteiro já registra que bastidor real é
mais forte, e um case documentário que mostra um bastidor que não aconteceu tem
um problema que não é de orçamento.

### Primeira coisa a testar

**Se o Fast aceita `resolution: 1080p`.** Só foi testado em 720p. Deixou de ser
urgente com o teto recontado, mas continua sendo bom saber.
