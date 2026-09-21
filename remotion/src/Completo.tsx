import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Series,
  interpolate,
  staticFile,
} from "remotion";
import { s } from "./anim";
import { Cena01, CENA01_FRAMES } from "./Cena01";
import { Cena03, CENA03_FRAMES } from "./Cena03";
import { Cena04, CENA04_FRAMES } from "./Cena04";
import { Cena06, CENA06_FRAMES } from "./Cena06";
import { Cena08, CENA08_FRAMES } from "./Cena08";
import { Cena09, CENA09_FRAMES } from "./Cena09";
import { Placeholder } from "./Placeholder";
import { Sonora } from "./Sonora";

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

/** Tempo dos cartoes de lacuna, tirado do roteiro. */
const LACUNA_02 = s(13);

/**
 * As sonoras reais, ja cortadas no silencio do proprio arquivo.
 *
 * A da Anaclaudia comeca em "Entao, mas ce sabia": o "Fala tambem" que vinha
 * antes era conversa de set, nao a fala. Cortar no primeiro som da pessoa
 * parece cuidado e e o contrario: entrega meia palavra antes do assunto.
 */
const SONORA_05 = s(8.37);
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
const TRILHA_BASE = 0.26;
const TRILHA_ALTA = 0.42;
const FADE = s(2.5);

export const COMPLETO_FRAMES =
  CENA01_FRAMES +
  LACUNA_02 +
  CENA03_FRAMES +
  CENA04_FRAMES +
  SONORA_05 +
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
    <Audio src={staticFile("sfx/trilha-longo.mp3")} volume={volumeTrilha} />

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

      <Series.Sequence durationInFrames={LACUNA_02}>
        <Placeholder
          cena="02"
          rotulo="Sonora a captar"
          titulo="Anaclaudia Zani, no consultório"
          detalhe="“Eu percebi que a conta não fechava e precisava levar o que aprendi nesses 20 anos de consultório para o máximo de pessoas possível.” GC entra depois da frase: 547 mil psicólogos no Brasil · R$ 200 a R$ 2.000 por sessão."
          origem="Captação: janela, cortina fina, plano médio, tripé travado. Referência de luz no artboard de fotografia do moodboard."
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA03_FRAMES}>
        <Cena03 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA04_FRAMES}>
        <Cena04 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SONORA_05}>
        <Sonora
          arquivo="clesio-sonora.mp4"
          nome="Clésio Souza"
          papel="Profissio.ai"
          gcEm={2.2}
          gcDura={3.4}
        />
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
          gcEm={2.8}
          gcDura={3.6}
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
