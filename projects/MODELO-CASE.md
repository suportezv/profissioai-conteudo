# Modelo de case em vídeo

Destilado dos cases **03 (EITA)** e **04 (MODO Soldiers)**, os dois construídos
ponta a ponta neste estúdio. Não repete o `CLAUDE.md`, que guarda as lições
técnicas: aqui está a **ordem de execução** e o **que precisa vir de fora**, que
é o que de fato trava um case.

Formato que os dois seguiram: **16:9, ~2:00, locução da Profissio como espinha,
sonoras reais nos pontos de virada, motion no Remotion, trilha por último,
master a -14 LUFS.**

---

## A ordem, e por que ela é essa

**0. A abertura conceitual, gerada no Veo.**
Todo case abre com um plano que estabelece o **mundo** do filme, sem narração e
sem lettering, cortando seco para a primeira cena de motion. Dura 4 a 5 s. A
primeira geração vai devolver a leitura automática da categoria, que é banco de
imagem: o plano que presta é **físico em vez de conceitual-holográfico** e
aponta para o objeto de que o filme trata. O áudio do clipe não entra na peça.

**1. Roteiro cena a cena, com a narração escrita.**
Serve para escrever e decidir a estrutura. **Nunca serve para montar**: a
estimativa de duração erra para mais, e o erro cresce com a densidade. Medido:
case 03 previu 78 s e deu 64,8 (−17%); case 04 previu ~92 s e deu 75,1 (−29%).

**2. Locução gerada, antes de qualquer linha do tempo.**
Etapa obrigatória, não otimização. É dela que saem os tempos reais de cada cena
e as pausas que viram os cortes. `scripts/gera_locucao.py`, com `--confere` para
o Scribe devolver o que foi dito.

**3. Motion contra as marcas de palavra**, nunca contra a tabela do roteiro.
Cada beat de uma cena se ancora numa palavra do arquivo, e isso vai escrito no
comentário da cena. Quando a locução for regravada, os tempos se refazem contra
as marcas novas; deslocar em bloco é o que quebra primeiro.

**4. Pedidos externos em paralelo**, assim que o roteiro fecha. São eles que
determinam a data de entrega, não o motion.

**5. Trilha depois do corte inteiro, e em movimentos, não em loop.**
Renderizar sem leito (`--props '{"trilha":null}'`) e misturar por fora. Para
comparar **candidatas**, `scripts/monta_trilha.py --alvo-dbfs` iguala a loudness
das faixas: sem isso a mais alta ganha sempre e a escolha vira acidente de ganho.

Mas num filme de dois minutos **uma faixa só não serve**, por mais bonita que
seja: um loop começa onde termina, então a virada do roteiro passa e a música
não sabe. O sintoma é sempre o mesmo, "genérica" e "não acompanha o que está
acontecendo". `scripts/costura_secoes.py` monta a trilha por movimentos, com as
bordas das seções caindo **exatamente nos cortes de cena**, trechos quase mudos
sob as sonoras e a maior energia na cena que carrega a prova.

**6. B-roll pago por último**, quando o buraco já está medido. E antes de gerar
qualquer clipe, conferir se o que a cena precisa **não é informação em vez de
fotografia**: no case 03 a cena mais cara virou motion puro e ficou melhor.

---

## O que tem que vir de fora (e trava tudo)

| Item | Quem entrega | Sem isso |
|---|---|---|
| **Sonoras**: quem fala, sobre o quê | cliente + Profissio | o filme monta com placeholder, mas não fecha |
| **Números, com base, período e método** | cliente | não podem ir para a tela |
| **Logo em PNG com alfa ou SVG** | cliente | não há assinatura |
| **Liberação de nome e imagem** de terceiros | cliente | a cena tem que ler sem eles |
| **Brutos** (Drive público, link direto) | cliente | sem material filmado |

**Lacuna é elemento de projeto, não buraco.** O que faltar vira um cartão de
placeholder que diz o que falta, de quem depende e qual pergunta puxa a
resposta. O filme fica assistível ponta a ponta com o furo aberto, o que
permite revisar ritmo e trilha antes de a captação existir. Preto não permitiria.
E o cartão precisa de **movimento contínuo**, uma barra que escoa a cada frame:
cartão parado lê como render travado.

---

## Os portões de conformidade

Valem para qualquer case, e o `Comunicacao_Profissio.md` é a fonte.

1. **Número de resultado sem contexto, base e método não entra em tela.** O que
   faltar fica escrito como `a confirmar` no próprio lettering: buraco visível é
   revisável, buraco silencioso vai ao júri.
2. **Venda atribuída a conversa não é receita incremental.** Comparação entre
   dois grupos que se escolheram sozinhos mede os grupos, não o efeito.
3. **Bases diferentes em cenas vizinhas têm que aparecer na tela.**
4. **Percentual acumulado não é fatia.** Limiar encaixado se desenha como
   escada com origem comum, e a regra vai escrita em texto.
5. **Nome ou imagem de terceiro sem liberação fica de fora**, e a cena tem que
   provar o argumento sem ele.
6. **Dado técnico não vai para a boca de ninguém**, vai para GC. Quem está em
   cena conta o que viveu.

---

## A sonora captada

**Quando o filme tem um buraco que o júri vai procurar, a testemunha existe para
cobrir aquele buraco.** Não para falar do que já está provado em outra cena.

- Corte **começa no assunto**, não no primeiro som da pessoa, e **fecha na
  palavra**, não no gesto de desligar a câmera. Conferir a cauda quadro a quadro.
- Ponto de corte se acha no silêncio do arquivo, pelo Scribe com timestamp por
  palavra, nunca pelo relógio do roteiro.
- **Segunda aparição da mesma pessoa não se credita de novo** (prop `creditar`).
- **Nível se acerta por clipe**, no componente, não no master: o `loudnorm` mede
  o filme inteiro e só empurra a média.
- Material gravado sem microfone tem conserto, e o diagnóstico vem do espectro,
  não do palpite. Ver o `CLAUDE.md` para a cadeia.

---

## Fecho e entrega

- **Toda ressalva tem um contexto que a justifica.** Quando o contexto muda
  (um dado novo chega), ela precisa ser relida, não herdada.
- Master a **-14 LUFS**, conferido com `ebur128` **depois** do encode.
- Entrega: arquivo direto no chat até 30 MB; acima disso, prévia leve no chat e
  o master por commit na branch. **O GitHub recusa acima de 100 MB**: dois
  passos mirando 92 MiB resolve sem perda visível.
- O `ROTEIRO.md` se reescreve **depois** da montagem, com os tempos do corte no
  lugar dos estimados e a divergência escrita na linha da própria cena.

---

## Cortes derivados

Os dois cases preveem vertical 60 s e 30 s a partir das mesmas cenas. O corte de
30 s costuma ser o mais forte, porque sai da cena que se explica sozinha.
