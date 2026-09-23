# Plano de execução · Case MODO Soldiers

Segundo case da série. **O que já foi resolvido no case da EITA não se resolve de novo**: componentes, scripts, voz, trilha e gramática vêm prontos. O que este plano decide é o que é específico da Soldiers.

---

## Bloco 1 · Locução completa — **feito**

Oito faixas em `remotion/public/locucao-soldiers/cena-NN.mp3`, voz Lair, todas conferidas pelo Scribe (o texto volta igual ao pedido).

| Cena | Reservado | Medido | Sobra |
|---|---|---|---|
| 01 | 10,0 s | 9,94 s | **+0,06 s** |
| 02 | 8,0 s | 5,76 s | +2,24 s |
| 03 | 14,0 s | 11,94 s | +2,06 s |
| 05 | 14,0 s | 9,75 s | +4,25 s |
| 06 | 18,0 s | 12,82 s | +5,18 s |
| 07 | 10,0 s | 7,89 s | +2,11 s |
| 08 | 18,0 s | 11,94 s | +6,06 s |
| 09 | 14,0 s | 5,02 s | +8,98 s |
| **total** | **106 s** | **75,06 s** | **+30,9 s** |

**A estimativa errou 29% para mais, de novo.** No case da EITA foram 17%; aqui, quase o dobro disso. A lição já estava escrita e agora tem duas medições: **tabela de roteiro serve para ordenar cenas, não para reservar tempo**. Com a sonora do Clésio em ~14 s, o filme tem ~89 s de conteúdo falado para 120 s de tela, ou seja 31 s de respiro para distribuir.

**A cena 01 é a única apertada, e é a que menos podia ser.** 9,94 s de fala num slot de 10 s não deixa nem meio segundo de entrada, e ela abre o filme. Passa para **11,5 s**, com 1 s de silêncio antes da primeira palavra.

Onde gastar os outros 30 s, em ordem de prioridade:

1. **Cena 06**, o coração: a repetição do lembrete precisa de tempo para virar repetição. Ganha 4 s.
2. **Cena 03**, os influenciadores: os clipes reais precisam respirar para as pessoas serem vistas. Ganha 4 s.
3. **Cena 02**, o vazio: os 2 s de nada depois da régua acabar viram 3 s.
4. O resto vira respiro antes e depois de cada bloco, não cena nova.

---

## Bloco 2 · Motion, o que é novo e o que é herdado

**Herdado sem reescrever**: `Superficie` (com os halos derivando), `marca`, `anim`, `Sfx`, `BalaoAudio`, `Icones`, `Sonora`, `Placeholder`, `whatsapp.ts`, `digitacao.ts`.

**Novo, específico deste case**, em ordem de dificuldade:

| Componente | Cena | O que faz |
|---|---|---|
| `DoisPotes` | 01 | Dois produtos iguais, só o preço muda. O cursor escolhe o mais barato |
| `ReguaJornada` | 02 | A jornada de compra em régua de 1px, que **acaba** na entrega |
| `GradeInfluencers` | 03 | Vários clipes reais tocando ao mesmo tempo, um cresce e fica |
| `CupomChave` | 05 | O mesmo objeto girando em 3D, de cupom para chave. Reusa a curva do `Balao3D` |
| `RitualDiario` | 06 | O relógio marcando o mesmo horário em dias diferentes, com o balão chegando |
| `CartoesPersona` | 07 | Sete cartões entrando sobre a mesma grade |
| `Numeros` | 08 | Adaptação direta da `Cena08` do case anterior, com a sonorização de contagem já pronta |

**O `RitualDiario` é o que decide o filme.** Ele precisa ler como repetição sem ficar monótono: a solução é manter o relógio e o balão fixos e **trocar só o que muda no fundo** (a luz do dia, o dia da semana no cabeçalho), acelerando o intervalo entre as repetições. Cinco repetições em 6 s, cada uma mais curta que a anterior.

---

## Bloco 3 · Pedidos externos, disparados agora

Não bloqueiam o motion, mas têm o prazo mais longo.

- **Sonora do Clésio** (cena 04). Pergunta que puxa: *qual foi a parte difícil de fazer sete personas soarem como sete pessoas, e não como o mesmo agente com nomes diferentes?* Mesma luz do case da EITA, para os dois filmes parecerem a mesma série.
- **Aprovação da Soldiers sobre os influenciadores**: quem pode aparecer em imagem e quem pode ser nomeado em lettering. Sem isso a cena 03 e a 07 não fecham.
- **Lockup da Soldiers**, em SVG ou PNG com alfa.
- **Rebaixar os MP4 dos influenciadores.** As 20 peças finais existem e estão documentadas em `projects/soldiers-agradecimentos/`, mas **os arquivos não estão no git**. Vêm do ZIP no Drive (`1WsbDCMhLDiTuvf67jwIr1kcABnldfcNQ`), e o `scripts/zip_index_remoto.py` lê o índice sem baixar os 11,5 GB.
- **Print da landing page** `modo.soldiersnutrition.com.br`.

---

## Bloco 4 · Trilha

A orgânica do case da EITA serve de base e já está no repo, mas **o andamento deste filme é outro**: lá era saúde mental e pedia contenção, aqui é suplementação esportiva e pede energia. Vale gerar duas candidatas com mais pulso pelo endpoint de música e comparar com `scripts/monta_trilha.py`, que renderiza o filme uma vez sem leito e mistura as candidatas por fora.

**Não repetir o erro do primeiro case**: não pedir "seamless and even throughout" ao gerador. Otimizar uma trilha para emendar é otimizá-la contra ter movimento.

---

## O que custa dinheiro

**Nada, no plano atual.** Não há b-roll gerado previsto: as imagens são motion no Remotion, os clipes reais dos influenciadores e uma sonora filmada. Isso é consequência direta da lição do case anterior, em que o b-roll gerado foi recusado por não acrescentar informação e a cena virou motion.

Se em algum momento fizer falta uma imagem de ambiente, o teto e o método já existem em `scripts/gera_video_veo.py`, com livro de gastos e `--simular`.

---

## O risco número um deste case, e ele não é técnico

**A categoria pede resultado de recompra e o case ainda não tem.** Os primeiros 90 dias vencem no início de novembro.

O roteiro trata isso como eixo, não como buraco: afirma que a retenção foi **desenhada na mecânica** e mostra o **hábito diário já medido**, declarando em tela a janela de medição. É a mesma coisa que o formulário escrito diz.

**A tentação a evitar é escrever "aumentou a recompra" em algum lettering.** Além de violar o `Comunicacao_Profissio.md`, o júri confere o vídeo contra o formulário, e vídeo que promete mais que o formulário perde nos dois.

---

## Ordem de execução

Igual à do case anterior, por trilha e não por cena, pelo mesmo motivo: cada cena mistura origens com prazos diferentes.

1. **Locução** — feito
2. **Motion das cenas sem dependência externa**: 01, 02, 05, 06, 08, 09
3. **Pedidos externos em paralelo**: sonora, aprovações, lockup, MP4 dos influenciadores
4. **Cenas 03 e 07**, que dependem das aprovações
5. **Trilha e mixagem**, com o master a -14 LUFS por último
