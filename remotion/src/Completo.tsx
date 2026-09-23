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
import { useFormato } from "./formato";

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
 * com 7,89 s de fala; o take real tem 8,02 s de fala.
 *
 * **A cena fecha em 8,30 s, logo depois da ultima palavra.** "Possivel" fecha
 * em 8,15 s e o audio cai para -57 dB no mesmo instante, entao 0,15 s ja e
 * silencio inteiro e o corte nao soa cortado. O que vem depois nao serve: em
 * 8,45 s ela comeca a se levantar para parar a gravacao, e o enquadramento
 * sobe. **Cauda de sonora nao e respiro, e o gesto de desligar a camera
 * entrando no filme.**
 *
 * O bruto trazia quatro tentativas. A escolhida e a **ultima**, e nao por ser
 * a ultima: e a unica sem hesitacao no meio (a segunda tem 0,8 s de pausa
 * depois de "fechava") e a unica que diz "mais de 20 anos", que e o que o GC
 * afirma.
 */
const CENA02_FRAMES = s(8.3);

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

/**
 * Os planos da sonora da cena 02 no corte 9:16: os **mesmos cortes, nos mesmos
 * tempos**, com zoom bem menor. A janela vertical ja e um close (607 px do
 * bruto de 1920), e os 1,45x e 1,6x do 16:9 levavam o alto do cabelo para
 * baixo do cabecalho do app. O teto aqui e 1,15x, e a alternancia entre medio
 * e close continua marcando cada oracao.
 *
 * A origem fica **abaixo do rosto** (70 a 80% da altura) de proposito: sem
 * zoom o rosto dela cai no meio do quadro e o quadro da parede ocupa o terco
 * de cima; ampliando a partir de baixo, o rosto sobe para o terco de cima e o
 * alto do cabelo continua bem abaixo dos 220 px do cabecalho.
 */
const PLANOS_ANA_VERTICAL = [
  { em: 0, zoom: 1.04, origem: "50% 80%" },
  { em: 3.0, zoom: 1.15, origem: "50% 80%" },
  { em: 4.84, zoom: 1.09, origem: "50% 80%" },
  { em: 6.42, zoom: 1.15, origem: "50% 70%" },
];

export const Completo: React.FC = () => {
  const { vertical } = useFormato();
  return (
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
      {/* O audio desta sonora foi refeito em 23/set/2026 a partir do bruto
          (WhatsApp_Video_2026-09-22_at_13.51.14.mp4, trecho de 29,425 s), porque
          o usuario o ouvia "estranho, comprimido". A causa estava medida: a
          cadeia anterior subia a presenca em 9 dB num AAC de 64 kbps, o que
          expoe o artefato do codec, e ainda passava por denoise, compressor e
          expansor. A cadeia nova e so `highpass=90`, -1,5 dB em 250 Hz e +3 dB
          largo em 3 kHz, com ganho estatico ate -18,7 LUFS. A dinamica voltou a
          14 dB, a do bruto. O piso sobe para -43 dBFS, 10 dB abaixo da trilha. */}
      <Series.Sequence durationInFrames={CENA02_FRAMES}>
        <Sonora
          arquivo="ana-missao-set26.mp4"
          nome="Anaclaudia Zani"
          papel="neurocientista e psicóloga · 20 anos de clínica"
          rotulo="Por que ela começou"
          gcEm={3.0}
          gcDura={3.4}
          // no 9:16 a janela vertical centra no rosto dela, em x ~1060 do bruto
          foco={57}
          // um plano por oracao, cortado na primeira palavra dela (Scribe)
          planos={vertical ? PLANOS_ANA_VERTICAL : [
            // "Eu percebi que a conta nao fechava": medio, apresenta ela
            { em: 0, zoom: 1.15, origem: "73.8% 100%" },
            // "e precisava levar o que eu aprendi": close
            { em: 3.0, zoom: 1.45, origem: "67.3% 81.1%" },
            // "em mais de vinte anos de consultorio": abre um pouco
            { em: 4.84, zoom: 1.28, origem: "67.1% 92%" },
            // "pro maior numero de pessoas possivel": o mais fechado, o fecho
            { em: 6.42, zoom: 1.6, origem: "64.3% 75.5%" },
          ]}
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
          // no 9:16 a janela vertical centra no rosto dele, em x ~1270 do bruto
          foco={72}
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
          // segunda entrada dela no filme: ja foi creditada na cena 02
          creditar={false}
          vertical
          fala={{
            de: 2.62,
            ate: 6.68,
            valores: ONDA_OUVINDO,
            // a ponta de cima do celular, medida nos quadros de 3,6 a 5,6 s do
            // clipe (a janela em que o audio toca): fonte (820, 880) no plano
            // de 1080x1294, que vai para o quadro por 0,8346x + 509,5
            ponta: { x: 1190, y: 735 },
            // no 9:16 o plano ocupa o quadro com a janela colada a esquerda,
            // o que deixa a ilustracao da EITA de fora e o rosto dela inteiro
            // (x 146 a 681 do bruto); a ponta foi remedida nesse quadro, no
            // ponto em que a borda de cima do celular chega perto da borda
            vertical: { foco: 0, ponta: { x: 990, y: 1318 } },
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
};
