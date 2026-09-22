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

const trilhaEscolhida = (): string | null => {
  const p = getInputProps() as { trilha?: string | null };
  return p.trilha === undefined ? null : p.trilha;
};

/**
 * A curva de volume, igual a do case anterior e pelo mesmo motivo: tres
 * movimentos e nada mais, sem degrau por cena. Trilha que sobe e desce a cada
 * corte chama atencao para si.
 */
const TRILHA_BASE = 0.26;
const TRILHA_ALTA = 0.42;
const FADE = s(2.5);

export const COMPLETO_FRAMES =
  CENA01_FRAMES +
  CENA02_FRAMES +
  CENA03_FRAMES +
  LACUNA_04 +
  CENA05_FRAMES +
  CENA06_FRAMES +
  CENA07_FRAMES +
  CENA08_FRAMES +
  CENA09_FRAMES;

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
  const saida = interpolate(f, [COMPLETO_FRAMES - FADE, COMPLETO_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(entrada, leito) * saida;
};

export const Completo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {trilhaEscolhida() ? (
      <Audio src={staticFile(trilhaEscolhida() as string)} volume={volumeTrilha} />
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

      <Series.Sequence durationInFrames={LACUNA_04}>
        <Placeholder
          cena="04"
          rotulo="Sonora a captar · a única do filme"
          titulo="Clésio Souza, na Profissio"
          detalhe="Pergunta que puxa: qual foi a parte difícil de fazer sete personas soarem como sete pessoas, e não como o mesmo agente com nomes diferentes? A resposta dele é a dobradiça do filme, entre o problema e o mecanismo."
          origem="Captação: mesma gramática de luz do case da EITA, janela e plano médio, para os dois filmes parecerem a mesma série. Sem GC de dado técnico: número vai para lettering, nunca para a boca de ninguém."
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

      <Series.Sequence durationInFrames={CENA09_FRAMES}>
        <Cena09 />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
