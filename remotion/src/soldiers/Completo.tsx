import React from "react";
import {
  AbsoluteFill,
  Audio,
  Series,
  getInputProps,
  interpolate,
  staticFile,
} from "remotion";
import { s } from "../anim";
import { Sonora } from "../Sonora";
import { useFormato } from "../formato";
import { Cena01, CENA01_FRAMES } from "./Cena01";
import { Cena02, CENA02_FRAMES } from "./Cena02";
import { Cena03, CENA03_FRAMES } from "./Cena03";
import { Cena05, CENA05_FRAMES } from "./Cena05";
import { Cena06, CENA06_FRAMES } from "./Cena06";
import { Cena07, CENA07_FRAMES } from "./Cena07";
import { Cena08, CENA08_FRAMES } from "./Cena08";
import { Cena08B, CENA08B_FRAMES } from "./Cena08B";
import { Cena09, CENA09_FRAMES } from "./Cena09";

/**
 * Corte de montagem do case MODO Soldiers, ponta a ponta.
 *
 * A **sonora do Clesio** entrou em 23/set, na cena 04, logo depois da fala da
 * Pietra: e a unica fala captada do filme, e ela responde o que a categoria
 * premia (recompra). Com ela o corte fecha em **120,0 s exatos**, e o espaco
 * saiu das caudas das cenas depois da ultima fala (01, 02, 05, 06, 07, 09),
 * nunca de dentro de uma narracao.
 *
 * ## A trilha entra por prop, e por isso comeca desligada
 *
 * `--props '{"trilha":null}'` rende o filme so com locucao e efeitos. Foi assim
 * que a trilha do case anterior foi escolhida: renderiza uma vez sem leito e
 * mistura cada candidata por fora com `scripts/monta_trilha.py`, o que garante
 * que **a unica diferenca entre as versoes e a musica**, e economiza um render
 * inteiro por candidata.
 *
 * Aqui ela nasce **nula de proposito**: o registro deste filme e mais rapido
 * que o do case da EITA, e a organica de la e lenta demais. A escolha e do
 * usuario, contra candidatas ouvidas, nunca minha contra um rotulo.
 */

/** Onde a narracao da cena 01 entra, contado do inicio do filme. */
const NARRACAO_01_EM = s(1.0);

/**
 * A sonora do Clesio, 15,4 s: `IMG_6269.mov` de 1,40 a 16,80 s, ou seja 0,16 s
 * antes do "A Soldier" e 0,38 s depois de "problema", onde ele ja assentou as
 * maos e nao ha gesto de fim de gravacao. O bruto e HLG 10-bit de iPhone a 60
 * fps; a conversao para Rec.709 esta no `edl.json` do projeto.
 */
const SONORA_04 = s(15.4);
const SONORA_04_EM = CENA01_FRAMES + CENA02_FRAMES + CENA03_FRAMES;

/**
 * A trilha escolhida pelo usuario, ouvindo as candidatas: **D, pulso de
 * treino**, batida marcada.
 *
 * As tres primeiras candidatas foram recusadas com um diagnostico que vale
 * registrar: "todas muito mortas", e combinadas com a locucao, que e pausada,
 * deixavam o filme tedioso. O filme e de performance e de habito diario, entao
 * a trilha precisa empurrar. Trilha discreta nao e a mesma coisa que trilha
 * sem pulso.
 *
 * `--props '{"trilha":null}'` segue rendendo o filme sem leito, que e como as
 * candidatas sao comparadas: um render so, misturado por fora com
 * `scripts/monta_trilha.py --alvo-dbfs`, para a unica diferenca entre as
 * versoes ser a musica e nao o ganho.
 */
const TRILHA_PADRAO = "soldiers/trilha-treino-pulso.mp3";

const trilhaEscolhida = (): string | null => {
  const p = getInputProps() as { trilha?: string | null };
  return p.trilha === undefined ? TRILHA_PADRAO : p.trilha;
};

/**
 * A curva de volume, igual a do case anterior e pelo mesmo motivo: tres
 * movimentos e nada mais, sem degrau por cena. Trilha que sobe e desce a cada
 * corte chama atencao para si.
 */
const TRILHA_BASE = 0.26;
const TRILHA_ALTA = 0.42;
const FADE = s(2.5);

const SOMA_CENAS =
  CENA01_FRAMES +
  CENA02_FRAMES +
  CENA03_FRAMES +
  CENA05_FRAMES +
  CENA06_FRAMES +
  CENA07_FRAMES +
  CENA08_FRAMES +
  CENA08B_FRAMES +
  CENA09_FRAMES;

/**
 * Duracao do corte. O parametro `lacunas` sobrou da fase em que a sonora do
 * Clesio era um cartao de espera; com ela captada as duas composicoes
 * registradas (`SoldiersCompleto` e `SoldiersSemLacunas`) sao o mesmo corte.
 */
export const framesDoCorte = (_lacunas = true) => SOMA_CENAS + SONORA_04;

export const COMPLETO_FRAMES = framesDoCorte(true);

const volumeTrilha = (total: number) => (f: number) => {
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
  const saida = interpolate(f, [total - FADE, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // debaixo da unica fala captada a trilha desce mais, para a voz dele nao
  // disputar com a batida; volta ao leito no corte para a cena 05
  const sonora = interpolate(
    f,
    [SONORA_04_EM - s(0.4), SONORA_04_EM + s(0.3), SONORA_04_EM + SONORA_04 - s(0.3), SONORA_04_EM + SONORA_04 + s(0.4)],
    [1, 0.6, 0.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return Math.min(entrada, leito) * saida * sonora;
};

/**
 * Os planos da sonora do Clesio, nos dois quadros. Mesmos tempos, cortados na
 * primeira palavra de cada oracao.
 *
 * **O teto e 1,15 nos dois quadros.** O bruto e um iPhone de 2102 px, e o
 * punch-in de ate 1,35 que o 16:9 tinha ampliava o rosto mais de 2,4x no
 * master 4K: o usuario viu a queda de qualidade contra os clipes dos
 * influenciadores, que vem de camera 4K (23/set). No 9:16 a janela ja e um
 * recorte apertado do plano deitado, e o mesmo teto evita tirar o cabelo do
 * quadro nos closes.
 */
const PLANOS_04 = [
  // "A Soldier ja dominava a aquisicao do cliente": medio
  { em: 0, zoom: 1.0, origem: "61% 55%" },
  // "mas em um mercado tao comoditizado": close
  { em: 2.92, zoom: 1.12, origem: "61% 22%" },
  // "E o MODO e justamente essa peca": abre, entra a resposta
  { em: 8.5, zoom: 1.04, origem: "61% 40%" },
  // "e resolve esse problema": o mais fechado, o fecho
  { em: 14.1, zoom: 1.15, origem: "61% 20%" },
];
const PLANOS_04_VERTICAL = [
  { em: 0, zoom: 1.0, origem: "61% 50%" },
  { em: 2.92, zoom: 1.1, origem: "61% 20%" },
  { em: 8.5, zoom: 1.04, origem: "61% 40%" },
  { em: 14.1, zoom: 1.15, origem: "61% 18%" },
];

export const Completo: React.FC<{ lacunas?: boolean }> = ({
  lacunas = true,
}) => {
  const { vertical } = useFormato();
  return (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {trilhaEscolhida() ? (
      <Audio src={staticFile(trilhaEscolhida() as string)} volume={volumeTrilha(framesDoCorte(lacunas))} />
    ) : null}

    <Series>
      <Series.Sequence durationInFrames={CENA01_FRAMES}>
        <Cena01 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA02_FRAMES}>
        <Cena02 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA03_FRAMES}>
        <Cena03 />
      </Series.Sequence>

      {/* A sonora do Clesio: responde por que o MODO existe, e a resposta e
          recompra, que e o criterio da categoria. Um plano por oracao, com
          corte seco na primeira palavra de cada uma (Scribe no clipe). */}
      <Series.Sequence durationInFrames={SONORA_04}>
        <Sonora
          arquivo="clesio-recompra-soldiers.mp4"
          nome="Clésio Souza"
          papel="Profissio.ai"
          rotulo="O desafio da recompra"
          gcEm={3.0}
          gcDura={3.4}
          // -13,4 LUFS no clipe contra -20,3 da narracao: 0,45 sao os -6,9 dB
          volume={0.45}
          // no 9:16 a janela vertical centra nele: o rosto fica a ~60% da
          // largura do bruto (medido nos quadros), e 66 de objectPosition poe
          // esse ponto no eixo da janela
          foco={66}
          planos={vertical ? PLANOS_04_VERTICAL : PLANOS_04}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA05_FRAMES}>
        <Cena05 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA06_FRAMES}>
        <Cena06 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA07_FRAMES}>
        <Cena07 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA08_FRAMES}>
        <Cena08 />
      </Series.Sequence>

      {/* o resultado que chegou em 22/set: conversao e reativacao. Fica
          depois da cena 08 e antes da tese, porque a 08 mede atividade (o
          habito) e esta mede o que o habito produziu. Base diferente da 08,
          declarada em tela. */}
      <Series.Sequence durationInFrames={CENA08B_FRAMES}>
        <Cena08B />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA09_FRAMES}>
        <Cena09 />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
  );
};
