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
import { Placeholder } from "../Placeholder";
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
 * Uma unica lacuna: a **sonora do Clesio**, na cena 04, que e a unica fala
 * captada do filme. Todo o resto esta pronto, com material real.
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

/** A unica lacuna: a sonora do Clesio. */
const LACUNA_04 = s(14);

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
 * Duracao do corte. As lacunas de sonora sao **opcionais**: a
 * composicao aprovada as mantem, e a previa sem elas usa o mesmo
 * componente com `lacunas={false}`, entao nao existe uma segunda
 * copia do corte para envelhecer sozinha.
 */
export const framesDoCorte = (lacunas = true) =>
  SOMA_CENAS + (lacunas ? LACUNA_04 : 0);

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
  return Math.min(entrada, leito) * saida;
};

export const Completo: React.FC<{ lacunas?: boolean }> = ({
  lacunas = true,
}) => (
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

      {lacunas ? (
        <Series.Sequence durationInFrames={LACUNA_04}>
          <Placeholder
            cena="04"
            rotulo="Sonora a captar · a única do filme"
            titulo="Clésio Souza, na Profissio"
            detalhe="Pergunta que puxa: por que amarrar o acompanhamento à compra, em noventa dias cumulativos, em vez de vender uma assinatura à parte? A resposta é sobre recompra, que é o que a categoria premia, e prepara exatamente o mecanismo da cena seguinte."
            origem="Captação: mesma gramática de luz do case da EITA, janela e plano médio, para os dois filmes parecerem a mesma série. Sem GC de dado técnico: número vai para lettering, nunca para a boca de ninguém."
          />
        </Series.Sequence>
      ) : null}

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
