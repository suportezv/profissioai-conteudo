import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Series,
  getInputProps,
  interpolate,
  staticFile,
} from "remotion";
import { s } from "./anim";
import { Cena01, CENA01_FRAMES } from "./Cena01";
import { Cena03, CENA03_FRAMES } from "./Cena03";
import {
  Cena04A,
  Cena04B,
  CENA04A_FRAMES,
  CENA04B_FRAMES,
} from "./Cena04";
import { Cena06, CENA06_FRAMES } from "./Cena06";
import { Cena08, CENA08_FRAMES } from "./Cena08";
import { Cena09, CENA09_FRAMES } from "./Cena09";
import { Sonora } from "./Sonora";
import { ONDA_OUVINDO } from "./ondas";

/**
 * Corte de montagem do case, ponta a ponta.
 *
 * Junta o que existe e **ocupa com cartao de lacuna o que ainda nao foi
 * captado**, no tempo exato que a cena vai ter. Serve para julgar o filme
 * antes da captacao: se o ritmo nao funciona aqui, nao vai funcionar depois.
 *
 * Duas coisas que este corte nao e:
 *
 *  - **Nao tem 2:00.** Soma 1:53, porque as cenas prontas ficaram mais curtas
 *    que a estimativa do roteiro (a locucao real deu 17% menos que o previsto)
 *    e a cena 01 tem os 8 s do clipe, nao os 11 s da tabela. A diferenca esta
 *    detalhada no `PLANO.md`; fechar em 2:00 e decisao de montagem, nao de
 *    codigo, e depende das sonoras reais.
 *  - **Nao esta mixado.** Tem trilha e efeitos, mas cada um no ganho em que
 *    foi colocado. O master a -14 LUFS e o ultimo passo, depois das sonoras.
 *
 * A cena 01 nao carrega a locucao dentro dela de proposito: a narracao entra
 * depois do silencio de abertura, e esse atraso e uma decisao de montagem.
 * Aqui ela e colocada por cima, com a Sequence.
 */

const FPS = 30;

/** Onde a narracao da cena 01 entra, contado do inicio do filme. */
const NARRACAO_01_EM = s(1.2);

/**
 * A cena 02 deixou de ser lacuna: o take real da Anaclaudia chegou em
 * 22/set/2026 e substituiu o cartao com voz guia.
 *
 * **E a previsao do guia errou, como sempre erra.** O guia reservava 11,9 s
 * com 7,89 s de fala; o take real tem 8,02 s de fala e o plano aguenta 9,10 s,
 * porque logo depois ela estica o braco para parar a gravacao e a mao entra no
 * quadro. O limite aqui nao e a frase, e onde a imagem para de servir.
 *
 * O bruto trazia quatro tentativas. A escolhida e a **ultima**, e nao por ser
 * a ultima: e a unica sem hesitacao no meio (a segunda tem 0,8 s de pausa
 * depois de "fechava") e a unica que diz "mais de 20 anos", que e o que o GC
 * afirma.
 */
const CENA02_FRAMES = s(9.1);

/**
 * As sonoras reais, ja cortadas no silencio do proprio arquivo.
 *
 * Cada uma comeca na primeira palavra, nao no primeiro frame do bruto. O
 * Clesio tinha 1,92 s de cabeca morta antes de "Foi construir", e a Anaclaudia
 * abria com "Fala tambem", que era conversa de set. **Cabeca de sonora nao e
 * respiro, e atraso**: o respiro quem da e o corte que vem antes.
 *
 * A do Clesio nao esta mais solta na cena 05: ela entra dentro do bloco da
 * cena 04, entre as duas metades da narracao. Solta, ela respondia uma
 * pergunta que ninguem tinha feito.
 */
const SONORA_05 = s(6.6);
const SONORA_07 = s(6.9);

/**
 * A trilha.
 *
 * Um leito so, do primeiro ao ultimo frame, **bem abaixo da locucao**. O
 * volume nao e chute, e conta: o arquivo mede -22,4 dB de media e a locucao
 * -20,2 dB; o ganho de 0,26 tira outros 11,7 dB, entao o leito toca uns **14 dB
 * abaixo da fala**, que e onde ele sustenta sem disputar. Na abertura, antes da
 * primeira narracao, ele fica em 0,42.
 *
 * Fade de 2,5 s nas duas pontas. Trilha que comeca no frame 1 em volume cheio
 * denuncia a emenda; entrando de baixo, ela parece ter comecado antes do filme.
 */
/**
 * Qual trilha toca, e como renderizar sem nenhuma.
 *
 * A escolhida e a **organica** (violao de nylon, vassourinha, Rhodes), entre
 * tres candidatas. A anterior, gerada pelo endpoint de efeitos, variava 1,4 dB
 * ao longo de dois minutos, ou seja era uma linha reta, e o defeito estava no
 * proprio pedido que eu tinha escrito: "seamless and even throughout", feito
 * para dar loop limpo. **Otimizar uma trilha para emendar e otimiza-la contra
 * ter movimento.** As tres novas saem do endpoint de musica com os 2:05
 * inteiros, entao nao precisam de emenda nenhuma.
 *
 * `--props '{"trilha":null}'` rende o filme so com locucao e efeitos. Serve
 * para comparar trilhas sem re-renderizar: renderiza uma vez sem leito e
 * mistura cada candidata por fora, o que garante que **a unica diferenca entre
 * as versoes e a musica**, e nao um detalhe de render.
 */
const trilhaEscolhida = (): string | null => {
  const p = getInputProps() as { trilha?: string | null };
  return p.trilha === undefined ? "sfx/trilha-organica.mp3" : p.trilha;
};

const TRILHA_BASE = 0.26;
const TRILHA_ALTA = 0.42;
const FADE = s(2.5);

export const COMPLETO_FRAMES =
  CENA01_FRAMES +
  CENA02_FRAMES +
  CENA03_FRAMES +
  CENA04A_FRAMES +
  SONORA_05 +
  CENA04B_FRAMES +
  CENA06_FRAMES +
  SONORA_07 +
  CENA08_FRAMES +
  CENA09_FRAMES;

/**
 * A curva de volume da trilha, quadro a quadro.
 *
 * Tres movimentos e nada mais: entra de baixo, **desce para o leito quando a
 * primeira narracao comeca** e sai no fim. E ducking escrito a mao, de
 * proposito: o `volume` do Remotion aceita funcao do frame, entao a curva mora
 * junto da montagem e se le olhando o codigo, em vez de virar um passo de
 * mixagem que ninguem lembra de refazer quando uma cena muda de duracao.
 *
 * Nao ha degrau por cena. Trilha que sobe e desce a cada corte chama atencao
 * para si, e o pedido era o contrario: presente e discreta. O acerto fino de
 * cada trecho e da mixagem final, junto do master a -14 LUFS.
 */
const volumeTrilha = (f: number) => {
  const entrada = interpolate(f, [0, FADE], [0, TRILHA_ALTA], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leito = interpolate(
    f,
    [NARRACAO_01_EM, NARRACAO_01_EM + s(1.4)],
    [TRILHA_ALTA, TRILHA_BASE],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const saida = interpolate(
    f,
    [COMPLETO_FRAMES - FADE, COMPLETO_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return Math.min(entrada, leito) * saida;
};

export const Completo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* a trilha atravessa o filme inteiro, por baixo de tudo */}
    {trilhaEscolhida() ? (
      <Audio
        src={staticFile(trilhaEscolhida() as string)}
        volume={volumeTrilha}
      />
    ) : null}

    <Series>
      <Series.Sequence durationInFrames={CENA01_FRAMES}>
        <AbsoluteFill>
          <Cena01 />
          {/* a narracao entra depois do silencio de abertura */}
          <Sequence from={NARRACAO_01_EM}>
            <Audio src={staticFile("locucao/cena-01.mp3")} />
          </Sequence>
        </AbsoluteFill>
      </Series.Sequence>

      {/* a sonora que abre o filme na voz dela: o GC entra depois da primeira
          oracao ("...que a conta nao fechava", que fecha em 2,89 s) e sai
          antes das ultimas palavras, para a frase terminar limpa */}
      <Series.Sequence durationInFrames={CENA02_FRAMES}>
        <Sonora
          arquivo="ana-missao-set26.mp4"
          nome="Anaclaudia Zani"
          papel="neurocientista e psicóloga · 20 anos de clínica"
          rotulo="Por que ela começou"
          gcEm={3.0}
          gcDura={3.4}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA03_FRAMES}>
        <Cena03 />
      </Series.Sequence>

      {/* o bloco da cena 04: a narracao enuncia o desafio, o Clesio responde
          qual foi o maior, e so entao a narracao nomeia o canal */}
      <Series.Sequence durationInFrames={CENA04A_FRAMES}>
        <Cena04A />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SONORA_05}>
        <Sonora
          arquivo="clesio-sonora.mp4"
          nome="Clésio Souza"
          papel="Profissio.ai"
          rotulo="O maior desafio"
          gcEm={1.6}
          gcDura={3.2}
          // o arquivo dele mede -12,0 LUFS contra -18,7 da Anaclaudia e -19,5
          // da narracao: 0,45 e os -7 dB que poem os tres no mesmo nivel
          volume={0.45}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA04B_FRAMES}>
        <Cena04B />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA06_FRAMES}>
        <Cena06 />
      </Series.Sequence>

      {/* a sonora real: ela pergunta, e o produto responde na voz dela. Entra
          direto, sem o motion do balao que vinha antes: aquele plano repetia a
          abertura e atrasava a unica cena em que o produto fala. */}
      <Series.Sequence durationInFrames={SONORA_07}>
        <Sonora
          arquivo="ana-ouvindo.mp4"
          nome="Anaclaudia Zani"
          papel="psicóloga · criadora da EITA"
          gcEm={0.4}
          gcDura={3.4}
          vertical
          fala={{
            de: 2.62,
            ate: 6.68,
            valores: ONDA_OUVINDO,
            // medido no frame: o celular dela fica em x 859..1061, y 720..834
            ancora: { x: 1452, y: 806 },
          }}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA08_FRAMES}>
        <Cena08 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA09_FRAMES}>
        <Cena09 />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
