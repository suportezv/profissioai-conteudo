# Prompts por cena para o Claude Design (Tempo economizado)

Mesma gramática validada do projeto 01 (@elevenlabsio + fundos oficiais da marca). Cada bloco é autocontido; o fundo é o mesmo em todas as cenas e costura a peça: estados se transformam, nunca cortam. Se preferir montar como composição única com timeline de cenas (como no projeto 01), use as durações como seções.

**Sistema fixo (vale para as 5 cenas):**
- Canvas 1080x1920, 30fps.
- Fundo: aurora oficial da marca. Base clara quase branca com manchas enormes e MUITO desfocadas (blur 120px+) em drift lento e contínuo: rosa/magenta #FDA4F5 no topo esquerdo, toque quente #FACD7C no topo direito, azul periwinkle #A5C2FE a #A289F2 na base. Grão de filme 2%. O fundo nunca para de se mover, quase imperceptível.
- Tinta #15101F. Secundário #4F4858. Micro rótulos #7B7589 em Inter Tight. Palavra-chave rosa #E255A0.
- Fonte: Sora em tudo, sentence case, nada de caixa alta, uma linha curta por vez. Revelação palavra a palavra: a palavra já está no lugar em cinza #B6B0C5 e escurece até #15101F, 0.25s por palavra.
- Painéis de UI: branco #FFFFFF, cantos 20px, sombra difusa grande rgba(21,16,31,0.10); cards internos #F7F4FB.
- Easing cubic-bezier(0.16, 1, 0.3, 1) em tudo. Estados seguram 2 a 3 segundos. SEM cortes.
- Área segura: nada de conteúdo nos 220px do topo nem nos 420px da base.
- Nunca usar travessão em nenhum texto de tela.

---

## CENA 1, gancho (0:00 a 0:05)

```
Motion graphic vertical 1080x1920, 30fps, 5 segundos, estilo clean tipo ElevenLabs.

FUNDO (aurora oficial da marca): base clara quase branca com manchas muito desfocadas
(blur 120px+) em drift lento: rosa #FDA4F5 no topo esquerdo, quente #FACD7C no topo
direito, periwinkle #A5C2FE/#A289F2 na base. Grão 2%. Nunca para de se mover.

0.0s a 0.8s: no centro-topo da área segura, o wordmark "profissio.ai" entra em fade,
   Sora SemiBold 40px, #15101F, pequeno e discreto. Fica o resto da cena.
1.0s a 3.4s: TEXTO CENTRAL, Sora Medium 60px, sentence case, centralizado, máx 2 linhas:
   "Tem uma métrica que quase ninguém mede."
   Revelação palavra a palavra (cinza #B6B0C5 escurecendo para #15101F, 0.25s por palavra).
   As palavras "quase ninguém" terminam em rosa #E255A0.
3.6s a 5.0s: o texto sobe 60px e encolhe para 70%. No centro, um RELÓGIO minimalista
   minúsculo aparece (círculo de 64px, mostrador branco, um ponteiro fino que gira devagar,
   sombra suave). É a semente da próxima cena.

SEM cortes. SEM caixa alta. SEM travessão.
```

---

## CENA 2, a dor (0:05 a 0:12)

```
Motion graphic vertical 1080x1920, 30fps, 7 segundos. Continuação direta: mesmo fundo
aurora oficial (manchas #FDA4F5, #FACD7C, #A5C2FE em drift lento).

0.0s a 1.0s: o relógio minúsculo do centro CRESCE e se transforma num painel branco de
   app real (860x1050px, cantos 20px, sombra difusa): uma caixa de entrada de conversas
   estilo WhatsApp Business, lista de 4 conversas (avatar redondo, barra de nome, prévia
   de mensagem em cinza). No topo do painel, um contador discreto em Inter Tight 24px
   #7B7589: "conversas hoje: 12".
1.2s a 4.2s: as conversas MULTIPLICAM: novos chips de conversa entram por cima em cascata
   acelerando (a cada entrada, a lista empurra para baixo). O contador sobe junto:
   12, 19, 27, 38, 51. Ao lado de cada conversa nova, um micro rótulo em Inter Tight
   18px #7B7589 pisca e some: "+4 min", "+6 min", "+3 min". No canto superior direito
   do painel, o relógio pequeno da cena 1 gira cada vez mais rápido.
4.4s a 7.0s: TEXTO abaixo do painel, Sora Medium 46px, #15101F, 2 linhas, revelação
   palavra a palavra: "Cada conversa custa minutos de alguém." e 0.4s depois,
   "Todo dia." com "Todo dia." em rosa #E255A0.

SEM cortes. O caos cresce mas nunca vira bagunça visual: tudo alinhado, tudo suave.
```

---

## CENA 3, a virada (0:12 a 0:20)

```
Motion graphic vertical 1080x1920, 30fps, 8 segundos. Clímax. Continuação direta: mesmo
fundo aurora oficial, mesmo painel branco central.

0.0s a 1.2s: o painel de conversas VIRA a aba Análises com uma transição de conteúdo
   (os chips de conversa se dissolvem; entra um dashboard claro e limpo). No topo,
   abas discretas em Sora 22px #7B7589: "Geral" (ativa, sublinhada em rosa), "Multimídia",
   "Engajamento". Um micro rótulo "últimos 30 dias" em Inter Tight 18px #7B7589 no canto.
1.4s a 2.2s: entre os cartões do dashboard, UM cartão ganha o palco: cresce para o centro
   (620x360px, branco, cantos 20px, borda 1px rgba(226,85,160,0.22)). Título do cartão em
   Sora 26px #4F4858: "Tempo economizado". Os outros cartões recuam desfocados.
2.4s a 5.4s: DENTRO do cartão, o NÚMERO HERÓI conta para cima, grande e confiante:
   Sora SemiBold 150px, #15101F: 0 h sobe até 127 h em 3 segundos, desacelerando no
   final (easing de contador). Quando chega em 127 h, o número dá um micro settle de
   escala e a palavra "h" acende em rosa #E255A0. Abaixo do número, linha em Inter
   Tight 22px #7B7589: "de atendimento humano poupadas".
5.6s a 8.0s: TEXTO abaixo do painel, Sora Medium 46px, #15101F, revelação palavra a
   palavra: "O Painel de Análises mostra as horas que o Agente poupou."
   A palavra "poupou." em rosa #E255A0.

SEM cortes. O momento do vídeo é o contador subindo: dar respiro e presença a ele.
```

---

## CENA 4, aprofundamento (0:20 a 0:27)

```
Motion graphic vertical 1080x1920, 30fps, 7 segundos. Continuação direta: mesmo fundo
aurora oficial. O cartão "Tempo economizado" (127 h) ENCOLHE e sobe para o terço
superior da área segura, ainda visível.

0.4s a 3.2s: no espaço central, um GRÁFICO DE BARRAS horizontal limpo entra, estilo do
   painel real: três barras com rótulos à esquerda em Sora 26px #15101F e valores em
   Inter Tight 22px #7B7589.
   Barra 1 "Agente": cresce longa, preenchimento rosa #E255A0, até "1.842 mensagens".
   Barra 2 "Usuários": média, azul #A5C2FE, "1.310 mensagens".
   Barra 3 "Humanos": curta, cinza #B6B0C5, "214 mensagens".
   As barras crescem em cascata escalonada de 0.3s, com o valor contando junto.
3.4s a 4.6s: ao lado da barra curta "Humanos", um micro rótulo em Inter Tight 20px
   #7B7589 sobe com fade: "só os casos que precisam de gente".
4.8s a 7.0s: TEXTO abaixo do gráfico, Sora Medium 48px, #15101F, revelação palavra a
   palavra, 2 linhas: "Seu time fica com o que" e "só humano resolve." com
   "só humano" em rosa #E255A0.

SEM cortes. SEM caixa alta. SEM travessão.
```

---

## CENA 5, CTA (0:27 a 0:33)

```
Motion graphic vertical 1080x1920, 30fps, 6 segundos. Fecho. Continuação direta: mesmo
fundo aurora oficial, agora um pouco mais quente (a mancha rosa #FDA4F5 cresce 10% e
sobe devagar em direção ao centro).

0.0s a 0.8s: cartão e gráfico se dissolvem em fade suave com leve subida. Tela limpa.
1.0s a 2.4s: TEXTO central, Sora Medium 54px, #15101F, revelação palavra a palavra,
   2 linhas: "Quanto tempo o seu negócio" e "recuperaria?" com "recuperaria?" em
   rosa #E255A0.
2.6s a 3.2s: o texto sobe 80px e encolhe levemente. Entra abaixo o lockup da marca
   (símbolo + wordmark "profissio.ai", usar o logo escuro oficial; aproximação: Sora
   SemiBold 44px #15101F), com a tagline em Sora Regular 26px #4F4858:
   "IA à prova do dia-a-dia do seu negócio."
3.4s a 5.2s: CTA discreto: linha em Sora Medium 34px #15101F sendo DIGITADA caractere
   a caractere com cursor | piscando: "Fale com a Agente Profissio.ai"
   Abaixo, em Inter Tight 26px #7B7589, também digitada: "wa.me/SEUNUMERO|"
   (cursor piscando até o fim).
5.2s a 6.0s: tudo estável. Último frame limpo, bom para thumbnail e loop.

SEM botão chamativo, SEM caixa alta, SEM travessão. CTA quieto e confiante.
```

---

## Para a pós (lembretes do pipeline do projeto 01)

- Render determinístico: ver `../01-funil-automatico/POS.md` (Playwright + seek frame a frame; vendorizar React/Babel; fontes @fontsource; viewport 1080x1964; crop 1080:1920).
- SFX: reutilizar `assets/sfx/` (pop, tick, **counter no número herói**, sweep, shimmer, typing, swell, bed_a+bed_b). Custo zero.
- Locução: voz `LetL52AJ3xLLkD3x88iE`, textos no BRIEFING, pronúncia "Profício ei ái" com ênfase no ái, validar por STT, `previous_text` nas frases curtas de fecho.
- Master -14 LUFS. Preview na conversa antes de agendar.
