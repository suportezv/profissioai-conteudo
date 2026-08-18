# Prompts por cena para o Claude Design

Cada bloco é autocontido. Executar na ordem. O sistema visual está repetido em todos de propósito, para cada prompt funcionar sozinho.

---

## CENA 1, gancho (0:00 a 0:03)

```
Motion graphic vertical, 1080x1920, 30fps, duração 3 segundos.

FUNDO: #07060B sólido. Vinheta radial sutil violeta rgba(107,60,184,0.14) no canto superior direito.

CENA: um quadro kanban visto de cima, levemente inclinado em perspectiva (rotateX 12 graus).
Três colunas verticais, superfície #15101F, cantos 16px, borda 1px rgba(255,255,255,0.06).
Cabeçalhos das colunas em Sora 20px, cor #7B7589: "NOVO LEAD", "EM CONVERSA", "PRONTO PRA FECHAR".
Na primeira coluna, quatro cards empilhados (#1B1428, cantos 12px). Cada card tem uma linha
de nome em barra cinza e uma bolinha de avatar. Os cards estão DESSATURADOS, opacidade 0.5.

ANIMAÇÃO:
0.0s a 0.6s: o quadro entra com fade e leve subida (translateY 40px para 0), easing cubic-bezier(0.16,1,0.3,1).
0.4s: um selo de tempo aparece sobre o card do topo, Inter Tight 16px, cor #7B7589: "parado há 6 dias".
0.8s a 1.2s: o selo troca para "parado há 9 dias", depois "parado há 14 dias", em cortes secos de 0.2s.
   A cada troca, o card pulsa 1 vez em vermelho muito sutil rgba(226,85,160,0.15).
1.4s: TEXTO PRINCIPAL entra, sobreposto e centralizado na metade superior segura da tela.
   Archivo Black, 108px, caixa alta, branco, line-height 0.95, alinhado à esquerda com margem 80px:
   "SEU FUNIL
    ESTÁ DESATUALIZADO
    AGORA"
   A palavra "AGORA" em rosa #E255A0.
   Entrada por linha, 3 linhas em cascata de 0.08s, cada uma com clip-path revelando de baixo para cima.
2.6s a 3.0s: tudo mantém, apenas o quadro ao fundo continua o drift lento (2px).

SEM narração, sem legenda. Sem travessão em nenhum texto.
```

---

## CENA 2, a dor (0:03 a 0:09)

```
Motion graphic vertical, 1080x1920, 30fps, duração 6 segundos. Continuação direta da cena anterior.

FUNDO: #07060B. Mesmo quadro kanban de três colunas, agora ocupando a tela inteira, sem o texto da cena 1.

ANIMAÇÃO:
0.0s a 1.2s: um cursor de mouse branco entra pela direita, agarra o card do topo da coluna 1
   e o arrasta lentamente até a coluna 2. O movimento é deliberadamente TRABALHOSO:
   o card acompanha com atraso, treme levemente, e o cursor faz uma micro correção antes de soltar.
   Ao soltar, um clique sutil de escala (0.98 para 1.0).
1.2s a 1.6s: o cursor volta para a coluna 1. Repete o arrasto com o segundo card, agora mais rápido.
1.6s a 2.6s: a repetição ACELERA e MULTIPLICA. O quadro faz zoom out revelando 6 colunas e
   dezenas de cards. Múltiplos cursores fantasma (opacidade 0.4) arrastam cards em paralelo,
   cada vez mais rápido, sobrepostos, caóticos.
2.6s a 3.4s: os cursores começam a FALHAR. Cards são soltos no meio do caminho e ficam
   flutuando fora de coluna, tortos, com opacidade 0.35. Uma pilha se acumula na base da tela.
   O ritmo desacelera até parar. Silêncio visual.
3.6s: TEXTO entra na metade inferior segura, Sora SemiBold 64px, branco, alinhado à esquerda,
   margem 80px, line-height 1.15:
   "Alguém precisa arrastar
    cada card.
    Toda vez."
   "Toda vez." em #E255A0.
   Entrada por linha em cascata de 0.1s, fade mais translateY 24px.
5.0s a 6.0s: sob o texto, uma linha fina em Inter Tight 28px, cor #B6B0C5, com fade lento:
   "acompanhamento e nutrição dos contatos manual"
   Essa linha tem um colchete rosa fino à esquerda, como citação.

SEM narração. Sem travessão.
```

---

## CENA 3, a virada (0:09 a 0:17)

```
Motion graphic vertical, 1080x1920, 30fps, duração 8 segundos. É o clímax da peça.

FUNDO: #07060B.

ANIMAÇÃO:
0.0s a 0.5s: os cursores da cena anterior DESAPARECEM, um a um, com um fade rápido e um leve
   colapso de escala. A tela respira. Os cards tortos se reorganizam sozinhos nas colunas,
   voltando a saturação plena e opacidade 1.0.
0.6s a 1.4s: a câmera aproxima em UM card específico na coluna "EM CONVERSA".
   Ao lado dele, abre um balão de conversa de WhatsApp, superfície #15101F, cantos 18px,
   largura 520px. Dentro, uma mensagem em Sora 30px, branco:
   "beleza, e quanto fica pra fechar os 3?"
   As mensagens entram com o comportamento real de chat: aparece indicador de digitando
   (três pontos pulsando) por 0.4s antes do balão.
1.6s a 2.4s: dentro da mensagem, DUAS expressões acendem em rosa #E255A0, uma após a outra,
   com um sublinhado que se desenha da esquerda para a direita:
   "quanto fica" e "pra fechar".
   Sobre cada uma, um chip minúsculo em Inter Tight 18px sobe e some:
   "intenção: preço" e "intenção: fechamento".
2.6s a 3.4s: um PULSO de luz rosa viaja do balão até o card, por uma linha fina curva.
   Ao chegar, o card acende na borda com glow rosa rgba(226,85,160,0.45).
3.6s a 4.6s: o card SE MOVE SOZINHO da coluna "EM CONVERSA" para "PRONTO PRA FECHAR".
   Movimento suave, confiante, com trilha de rastro rosa que se dissipa. Nenhum cursor em cena.
   Ao assentar, a coluna de destino pulsa uma vez.
4.8s a 6.0s: a câmera afasta. Agora DEZENAS de cards fazem o mesmo, em cascata escalonada,
   cada um com seu micro pulso e seu deslocamento. O quadro inteiro fica vivo. Nenhum cursor.
   Sensação: uma orquestra se afinando sozinha.
6.2s: TEXTO entra por cima, Archivo Black 92px, caixa alta, branco, margem 80px, line-height 1.0:
   "O FUNIL LÊ A CONVERSA
    E MOVE O LEAD
    SOZINHO"
   "SOZINHO" em #E255A0, com uma leve expansão de letter spacing na entrada.
7.4s a 8.0s: mantém, quadro seguindo vivo ao fundo, texto estável.

SEM narração. Sem travessão.
```

---

## CENA 4, aprofundamento (0:17 a 0:25)

```
Motion graphic vertical, 1080x1920, 30fps, duração 8 segundos.

FUNDO: #07060B. O quadro kanban recua para o fundo, desfocado (blur 12px) e com opacidade 0.25,
seguindo vivo, com cards se movendo devagar. Ele vira textura, não protagonista.

ANIMAÇÃO:
0.0s a 0.4s: TÍTULO entra no terço superior seguro, Sora SemiBold 58px, branco, margem 80px:
   "Ela classifica por intenção,
    não por formulário."
   "não por formulário." em #B6B0C5.

0.8s a 3.2s: três CARTÕES DE CRITÉRIO entram em sequência vertical, escalonados 0.35s.
   Cada cartão: superfície #15101F, cantos 20px, borda 1px rgba(226,85,160,0.22),
   altura 200px, largura 880px, centralizado. Entrada por translateX 60px mais fade.
   Cada um tem, à esquerda, um micro visual animado em 120x120px, e à direita o rótulo
   em Sora Medium 38px branco.

   Cartão 1, rótulo "o conteúdo das mensagens":
     micro visual = três linhas de texto que se escrevem sozinhas e depois acendem em rosa.
   Cartão 2, rótulo "o tipo de interação":
     micro visual = três ícones alternando em loop, ponto de interrogação, balão, coração.
   Cartão 3, rótulo "palavras-chave e intenções":
     micro visual = uma nuvem de 6 palavrinhas onde 2 delas destacam em rosa e sobem.

3.6s a 5.0s: os três cartões se COMPRIMEM em uma única linha horizontal de três chips pequenos,
   que então convergem para um ponto central e viram um único selo:
   pílula rosa #E255A0, texto em Sora Bold 34px, cor #07060B: "estágio atualizado".
   O selo dá um pulso único.

5.4s a 6.6s: o fundo desfocado volta ao foco por 1 segundo, mostrando o quadro completo com
   todos os cards já distribuídos corretamente pelas colunas. Números sobem em contador
   em cada cabeçalho de coluna (0 até 12, 0 até 27, 0 até 8), Inter Tight 32px, #B6B0C5.

6.8s a 8.0s: TEXTO DE FECHO da seção, Sora SemiBold 52px, branco, centralizado:
   "Seu time chega antes."
   Entrada por fade e leve escala de 0.96 para 1.0.

SEM narração. Sem travessão.
```

---

## CENA 5, CTA (0:25 a 0:30)

```
Motion graphic vertical, 1080x1920, 30fps, duração 5 segundos.

FUNDO: #07060B. O quadro kanban se dissolve em partículas rosa que sobem e somem (0.0s a 0.8s).
Entra um bloom radial rosa rgba(226,85,160,0.34) partindo do centro baixo, respirando devagar.

ANIMAÇÃO:
0.6s a 1.4s: LOGO Profissio.ai entra no centro, branco, com fade e leve escala de 0.94 para 1.0.
   Abaixo, a assinatura em Sora Regular 34px, cor #B6B0C5:
   "IA à prova do dia-a-dia do seu negócio."
   Entrada 0.2s depois do logo.

2.0s a 2.8s: BOTÃO DE CTA entra abaixo, subindo com translateY 40px mais fade.
   Pílula de 760x120px, preenchimento em gradiente de #E255A0 para #BE3F84,
   cantos totalmente arredondados, sombra rosa rgba(226,85,160,0.40) difusa.
   Dentro, ícone do WhatsApp em branco 48px, e ao lado o texto em Sora Bold 40px, branco:
   "Fale com a Agente Profissio.ai"
   O botão tem um brilho que atravessa da esquerda para a direita a cada 1.2s, sutil.

3.2s a 3.6s: abaixo do botão, linha em Inter Tight 30px, cor #7B7589:
   "no WhatsApp, agora"

4.0s a 5.0s: tudo mantém. O bloom rosa pulsa uma vez, lento. Último frame limpo e estável,
   bom para thumbnail e para o loop do Reels.

SEM narração. Sem travessão.
```

---

## Locução opcional (para a etapa de sonorização)

Se decidirmos colocar voz na pós, este é o texto, cronometrado para caber:

| Cena | Locução |
|---|---|
| 1 | "Seu funil de vendas está desatualizado agora." |
| 2 | "Porque alguém precisa arrastar cada card. Toda vez." |
| 3 | "O funil da Profissio.ai lê a conversa e move o lead sozinho." |
| 4 | "Ela classifica por intenção, não por formulário. Seu time chega antes." |
| 5 | "Fale com a Agente Profissio.ai no WhatsApp." |

Voz da marca ainda **PENDENTE** de definição. Sem isso, a v1 sai sem locução, só com trilha e SFX.

## Sonorização prevista (etapa seguinte, ElevenLabs sound-generation)

- Trilha: bed eletrônico contido, tensão crescente nas cenas 1 e 2, resolução na 3.
- SFX cena 2: cliques de mouse secos, cada vez mais frequentes, virando ruído.
- SFX cena 3: um "silêncio" marcado quando os cursores somem, depois um sweep suave no pulso rosa, e um tick macio a cada card que se move.
- SFX cena 4: três ticks curtos, um por cartão de critério.
- SFX cena 5: um swell curto no bloom.
- Master final: -14 LUFS.
