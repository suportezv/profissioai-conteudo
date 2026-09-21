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

### Bloco 2 · Motion no Remotion — próximo, também sem dependência externa

Seis composições. A 01 já existe (`CaseEitaCena01`), as outras saem do mesmo
sistema de tokens, agora no modo claro.

| Cena | Composição | Estado |
|---|---|---|
| 01 | tela de WhatsApp, um check | **pronta** |
| 03 | contexto em motion sobre a superfície clara | a fazer |
| 06 | três cartões, um aceso por vez | a fazer |
| 07 | mesma tela da 01, dois checks e o áudio chegando | a fazer |
| 08 | números um por vez, com base e período | a fazer |
| 09 | lockups EITA e Profissio | a fazer |

Feitas contra os mp3 do bloco 1, não contra a tabela: o tempo de cada
composição é a duração real do arquivo de locução daquela cena.

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

### Bloco 4 · B-roll no Veo — por último

Só depois que a locução estiver cortada e o motion montado, porque aí se sabe
exatamente quais segundos sobraram sem imagem. Gerar antes é comprar tinta
antes de medir a parede.

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

### Primeiro: medir o preço, não estimar

`ai.google.dev` e a página de preços da Vertex estão fora da allowlist deste
environment, e a API do Gemini não expõe consumo. **Não dá para confirmar o
preço daqui.** Duas coisas a fazer no `ai.studio/projects` antes de gerar:

1. **Ler quanto já foi gasto.** Foram 7 gerações cobráveis até aqui: 1 teste
   em Fast, 2 sondagens de capacidade (1080p e 9:16) e os 4 clipes do lote.
2. **Medir o preço por segundo**: gerar um clipe de 4 s e comparar o saldo
   antes e depois. A divisão dá o número exato, sem depender de tabela.

Com esse número, `scripts/gera_video_veo.py` faz a aritmética sozinho e
**recusa o lote** que passar do teto.

```
python3 scripts/gera_video_veo.py \
  --lote projects/03-case-eita-whatsapp/lote-veo.json \
  --pasta projects/03-case-eita-whatsapp/broll \
  --teto-usd 30 --preco-seg <o numero medido> --simular
```

O script mantém um livro de gastos em `broll/veo-gastos.json` e soma o
acumulado a cada geração. Sem preço informado ele **para** em vez de chutar.

### Os três controles de custo, do mais forte para o mais fraco

1. **Duração.** A cobrança é por segundo e o mínimo é 4 s. Um insert de 4 s
   custa metade de um de 8 s, e insert de documentário não precisa de 8 s.
   Todo o lote planejado usa 4 s.
2. **Modelo.** O Fast custa uma fração do padrão. Insert de atmosfera, com
   movimento lento e sem detalhe crítico, não distingue os dois. Usar Fast por
   padrão e só subir para o padrão no clipe que falhar.
3. **Repetição.** É o custo que os planos esquecem: raramente o primeiro take
   serve. Orçar **2 tentativas por clipe** e tratar isso como custo normal,
   não como erro.

### Os dois cenários

**Cenário A, recomendado: bastidor da cena 04 filmado.**
4 inserts de 4 s = 16 s. Com repetição de 2x, 32 s.

**Cenário B: bastidor da cena 04 gerado.**
Mais 3 clipes de 8 s = 40 s. Com repetição, 80 s. Além de custar mais, é pior
para o júri: o roteiro já registra que bastidor real é mais forte, e um case
documentário que mostra um bastidor que não aconteceu tem um problema que não
é de orçamento.

**A recomendação é o cenário A**, e ela não é só financeira.

### Primeira coisa a testar depois de repor o crédito

**Se o Fast aceita `resolution: 1080p`.** Só foi testado em 720p. Se aceitar,
é a maior economia disponível e o cenário B volta a caber no teto. Se não
aceitar, os inserts em 720p ainda servem, porque entram desfocados e curtos.
