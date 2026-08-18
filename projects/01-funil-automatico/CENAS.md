# Prompts por cena para o Claude Design (v2, gramática @elevenlabsio)

> **v2, reescrito em 18/ago/2026** depois da análise frame a frame de 4 vídeos reais da referência. O que mudou da v1: peça contínua sem cortes secos, fundo aurora claro no lugar do fundo preto, tipografia contida em sentence case no lugar de display caps gigante, UI clara flutuando como card, grafo de nós para os critérios, CTA discreto com URL digitada. A gramática completa está no `CLAUDE.md`, seção "Gramática de motion".

Cada bloco é autocontido. Executar na ordem. **O fundo é o mesmo em todas as cenas**, é ele que costura a peça: os estados se transformam um no outro, nunca cortam.

**Sistema fixo (vale para as 5 cenas):**
- Canvas 1080x1920, 30fps.
- Fundo: base clara `#F2EFF7` com duas manchas aurora enormes e MUITO desfocadas (blur 120px+) em drift lento e contínuo: uma rosa `#E255A0` para `#D86AA8` no terço superior direito, uma violeta `#6B3CB8` bem sutil no canto inferior esquerdo. Grão de filme sutil por cima (2 a 3% de opacidade). O fundo nunca para de se mover, mas quase não se percebe.
- Tinta do texto: `#15101F`. Texto secundário: `#4F4858`. Palavra-chave: rosa `#E255A0`.
- Fonte: **Sora** (Google Fonts) em tudo. Micro rótulos: Inter Tight. **Nada de caixa alta, nada de bold gigante.** Sentence case, uma linha curta por vez.
- Superfícies de UI: branco `#FFFFFF`, cantos 16 a 20px, sombra suave difusa rgba(21,16,31,0.10) grande e baixa.
- Easing: cubic-bezier(0.16, 1, 0.3, 1) em tudo. Movimentos lentos e confiantes. Cada estado segura 2 a 3 segundos.
- Área segura: nada de conteúdo nos 220px do topo nem nos 420px de baixo.
- Nunca usar travessão em nenhum texto de tela.

---

## CENA 1, gancho (0:00 a 0:05)

```
Motion graphic vertical 1080x1920, 30fps, 5 segundos, estilo clean tipo ElevenLabs.

FUNDO: base #F2EFF7 com duas auroras muito desfocadas (blur 120px) em drift lento:
rosa #E255A0/#D86AA8 no terço superior direito, violeta #6B3CB8 sutil no inferior esquerdo.
Grão de filme a 2% por cima. O fundo se move o vídeo inteiro, quase imperceptível.

0.0s a 0.8s: no centro-topo da área segura, o wordmark "Profissio.ai" entra em fade,
   Sora SemiBold 40px, cor #15101F, pequeno e discreto. Segura lá o resto da cena.
1.0s a 3.2s: TEXTO CENTRAL, Sora Medium 62px, sentence case, centralizado, line-height 1.2,
   máximo 2 linhas: "Seu funil está desatualizado agora."
   REVELAÇÃO PALAVRA A PALAVRA: cada palavra já está no lugar em cinza #B6B0C5 e vai
   escurecendo até #15101F, uma por vez, 0.25s por palavra, na ordem de leitura.
   A palavra "agora." termina em rosa #E255A0 em vez de escuro.
3.6s a 5.0s: o texto sobe 60px suavemente e encolhe para 70% do tamanho, abrindo espaço.
   No centro da tela, um CARD BRANCO minúsculo (60x40px, cantos 12px, sombra suave)
   aparece com fade e leve escala 0.8 para 1.0. É a semente da próxima cena.

SEM cortes. SEM caixa alta. SEM travessão. Tudo respirando devagar.
```

---

## CENA 2, a dor (0:05 a 0:11)

```
Motion graphic vertical 1080x1920, 30fps, 6 segundos, continuação direta: mesmo fundo
aurora claro #F2EFF7 (auroras rosa #E255A0 e violeta #6B3CB8 desfocadas, drift lento).

0.0s a 1.0s: o card branco minúsculo do centro CRESCE até virar um painel de app real:
   860x1100px, branco #FFFFFF, cantos 20px, sombra difusa grande rgba(21,16,31,0.10).
   Dentro, uma UI de kanban CLARA e limpa estilo SaaS: 3 colunas com cabeçalhos em
   Sora 24px #4F4858: "Novo lead", "Em conversa", "Pronto pra fechar".
   Na coluna 1, quatro cards de lead (fundo #F7F4FB, cantos 12px, avatar redondo,
   barra de nome cinza). Tudo em escala de UI real, não ilustração.
0.8s: um selo pequeno em Inter Tight 20px, #7B7589, aparece no card do topo:
   "parado há 6 dias".
1.2s a 2.6s: um CURSOR de mouse preto entra pela direita, agarra o card do topo e o
   ARRASTA da coluna 1 para a coluna 2. O gesto é trabalhoso: o card resiste com atraso,
   o cursor corrige o caminho, solta com um mini snap de escala.
2.6s a 3.6s: o cursor repete com o segundo card, um pouco mais rápido. Enquanto isso os
   selos dos cards restantes trocam em cortes secos: "parado há 9 dias", "parado há 14 dias".
3.8s a 6.0s: TEXTO abaixo do painel, dentro da área segura, Sora Medium 46px, #15101F,
   centralizado, 2 linhas: "Alguém precisa arrastar cada card." e na linha de baixo,
   0.4s depois: "Toda vez." com "Toda vez." em rosa #E255A0.
   Revelação palavra a palavra igual à cena 1 (cinza #B6B0C5 escurecendo).

SEM cortes: o painel continua em cena o tempo todo. SEM caixa alta. SEM travessão.
```

---

## CENA 3, a virada (0:11 a 0:19)

```
Motion graphic vertical 1080x1920, 30fps, 8 segundos. Clímax. Continuação direta: mesmo
fundo aurora claro, mesmo painel kanban branco central da cena anterior.

0.0s a 0.8s: o CURSOR desaparece com fade suave. Meio segundo de calma total, só o
   fundo respirando. Essa pausa é intencional e importante.
1.0s a 2.2s: um CHIP DE MENSAGEM desliza de baixo para o lado esquerdo do painel:
   pílula branca 620px de largura, cantos 24px, sombra suave, com avatar redondo à
   esquerda e texto em Sora 30px #15101F:
   "beleza, e quanto fica pra fechar os 3?"
   Entra como notificação de WhatsApp: sobe 40px com fade e um leve settle.
2.4s a 3.6s: KARAOKÊ DE INTENÇÃO: dentro da mensagem, as expressões "quanto fica" e
   "pra fechar" acendem em rosa #E255A0 uma depois da outra, cada uma com um sublinhado
   fino que se desenha da esquerda para a direita. Sobre cada expressão, um micro rótulo
   em Inter Tight 18px #7B7589 sobe e some: "intenção: preço", depois "intenção: fechamento".
3.8s a 4.8s: uma LINHA de 1px cor #D86AA8 se desenha do chip de mensagem até um card
   específico da coluna "Em conversa", com um PONTINHO rosa viajando por ela.
   Ao chegar, a borda do card acende num glow rosa suave rgba(226,85,160,0.35).
5.0s a 6.0s: o card DESLIZA SOZINHO da coluna "Em conversa" para "Pronto pra fechar".
   Movimento calmo e confiante, sem cursor nenhum em cena. Ao assentar, a coluna de
   destino pulsa uma vez, sutil. O selo do card troca para "atualizado agora" em rosa.
6.2s a 7.0s: mais dois cards fazem o mesmo em cascata escalonada de 0.3s, cada um com
   sua micro linha e seu pontinho. O painel fica vivo, se organizando sozinho.
7.0s a 8.0s: TEXTO abaixo do painel, Sora Medium 46px, #15101F, revelação palavra a
   palavra: "O Funil lê a conversa e move o lead sozinho."
   A palavra "sozinho." em rosa #E255A0.

SEM cortes. SEM caixa alta. SEM travessão. O contraste com a cena 2 é a ausência do cursor.
```

---

## CENA 4, aprofundamento (0:19 a 0:26)

```
Motion graphic vertical 1080x1920, 30fps, 7 segundos. Continuação direta: mesmo fundo
aurora claro. O painel kanban da cena anterior ENCOLHE e sobe para o terço superior
da área segura (fica a 55% da largura, ainda vivo, cards se movendo devagar).

0.6s a 3.4s: GRAFO DE NÓS no espaço central liberado: três chips brancos pequenos
   (pílulas de cantos 20px, sombra suave, Sora 26px #15101F, ícone simples à esquerda)
   entram um a um, escalonados 0.4s, dispostos em arco:
   "conteúdo das mensagens" · "tipo de interação" · "palavras-chave e intenções"
   De cada chip, uma LINHA de 1px #D86AA8 se desenha até um nó central vazio,
   com um pontinho rosa viajando por cada linha assim que ela completa.
3.6s a 4.6s: quando os três pontinhos chegam, o nó central acende e vira uma pílula
   rosa #E255A0 com texto em Sora SemiBold 28px branco: "estágio atualizado".
   Ela pulsa uma vez e ENVIA um pontinho por uma linha curva até o painel kanban
   lá em cima; no impacto, os números dos cabeçalhos das colunas sobem em contador
   (3 vira 5, 8 vira 11, 2 vira 4), Inter Tight 24px #4F4858.
5.0s a 7.0s: TEXTO central abaixo do grafo, Sora Medium 50px, #15101F, 2 linhas,
   revelação palavra a palavra: "Classificado por intenção," e depois
   "não por formulário." com "intenção" em rosa #E255A0.

SEM cortes. SEM caixa alta. SEM travessão.
```

---

## CENA 5, CTA (0:26 a 0:31)

```
Motion graphic vertical 1080x1920, 30fps, 5 segundos. Fecho. Continuação direta: mesmo
fundo aurora claro #F2EFF7, que agora fica um pouco mais quente (a aurora rosa cresce
10% e sobe devagar em direção ao centro).

0.0s a 0.8s: painel, grafo e textos anteriores se dissolvem em fade suave e leve subida.
   Tela limpa, só o fundo aurora.
1.0s a 2.2s: TEXTO central, Sora Medium 56px, #15101F, revelação palavra a palavra:
   "Seu time chega antes."
2.4s a 3.0s: esse texto sobe 80px e encolhe levemente. Entra abaixo o wordmark
   "Profissio.ai" em Sora SemiBold 44px #15101F, com a tagline em Sora Regular 26px
   #4F4858 logo abaixo: "IA à prova do dia-a-dia do seu negócio."
3.2s a 4.4s: CTA DISCRETO estilo ElevenLabs: abaixo do lockup, uma linha em Sora
   Medium 34px #15101F sendo DIGITADA caractere a caractere com cursor | piscando:
   "Fale com a Agente Profissio.ai"
   E logo abaixo, em Inter Tight 26px #7B7589, também digitada, a URL:
   "wa.me/SEUNUMERO|"  (o cursor continua piscando até o fim)
4.4s a 5.0s: tudo estável. Último frame limpo, bom para thumbnail e para o loop.

SEM botão chamativo, SEM caixa alta, SEM travessão. O CTA é quieto e confiante.
```

---

## PENDENTE antes de publicar

- **Número/link real do WhatsApp** para substituir `wa.me/SEUNUMERO` na cena 5. O site usa `wa.me` mas o número não aparece nos assets extraídos. Perguntar à equipe.
- Logo oficial: usar o wordmark real da pasta "Logo" do Drive (`1KPPS3GK9G21G0wLefLlE3mb-loBAVJD0`) na hora da pós, se o Claude Design não reproduzir fielmente.

## Locução opcional (cronometrada, para a sonorização)

| Cena | Locução |
|---|---|
| 1 | "Seu funil de vendas está desatualizado agora." |
| 2 | "Porque alguém precisa arrastar cada card. Toda vez." |
| 3 | "O Funil da Profissio.ai lê a conversa e move o lead sozinho." |
| 4 | "Classificado por intenção, não por formulário." |
| 5 | "Fale com a Agente Profissio.ai no WhatsApp." |

Voz da marca **PENDENTE**. Referência: 3 dos 4 vídeos da ElevenLabs não têm locução, então a v1 sem voz está dentro da gramática.

## Sonorização (etapa seguinte, ElevenLabs sound-generation)

Referências medidas: mean volume entre -15 e -17 dB, trilha ambiente comedida, sem SFX espalhafatoso.

- Trilha: bed ambiente minimalista e claro (não dark techno), com leve pulso; tensão sutil nas cenas 1 e 2, abertura na 3.
- SFX: cliques discretos de cursor na cena 2; um tick macio por card que se move na cena 3; três ticks curtos nos chips da cena 4; teclas de digitação bem baixas no CTA da cena 5.
- Sem riser dramático, sem impact pesado: a gramática da referência é contida.
- Master final: **-14 LUFS**.
