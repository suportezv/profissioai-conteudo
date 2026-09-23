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
import { Cena00, CENA00_FRAMES } from "./Cena00";
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
 * Corte de montagem do case Polishop A.IChef, ponta a ponta.
 *
 * Uma lacuna: **a sonora da Polishop**, na cena 04, e ela é removível. O resto
 * está montado com a locução real e motion pronto.
 *
 * ## Por que a sonora é dessa pessoa e sobre esse assunto
 *
 * O case tem uma pergunta que nenhuma cena de motion responde: **por que
 * revisitar em 2025 um projeto que não engajou em 2023, em vez de enterrar.**
 * É o coração da história e só uma pessoa da Polishop pode contar. Testemunha
 * existe para cobrir o buraco que o júri vai procurar.
 *
 * Ela é removível pela mesma arquitetura do case anterior: a cena 03 fecha uma
 * afirmação completa, a 05 abre outra, e nada que a sonora diz é pressuposto
 * depois. Tirar é apagar este `Series.Sequence`, sem retimar nada, e o filme
 * fecha 11 s mais curto.
 *
 * ## A trilha nasce nula
 *
 * `--props '{"trilha":"..."}'` liga um leito. A escolha se faz depois do corte
 * inteiro, e o material se monta com `scripts/costura_secoes.py`: **uma trilha
 * só, com variação de densidade por filtro e pontos de tensão**, que foi onde
 * o case anterior chegou depois de três rodadas de recusa.
 */

const NARRACAO_01_EM = s(0.7);

/** A única lacuna: a sonora da Polishop. */
const LACUNA_04 = s(11);

const TRILHA_PADRAO: string | null = null;

const trilhaEscolhida = (): string | null => {
  const p = getInputProps() as { trilha?: string | null };
  return p.trilha === undefined ? TRILHA_PADRAO : p.trilha;
};

const TRILHA_BASE = 0.24;
const TRILHA_ALTA = 0.4;
const FADE = s(1.6);

export const COMPLETO_FRAMES =
  CENA00_FRAMES +
  CENA01_FRAMES +
  CENA02_FRAMES +
  CENA03_FRAMES +
  LACUNA_04 +
  CENA05_FRAMES +
  CENA06_FRAMES +
  CENA07_FRAMES +
  CENA08_FRAMES +
  CENA08B_FRAMES +
  CENA09_FRAMES;

const volumeTrilha = (f: number) => {
  const entrada = interpolate(f, [0, FADE], [0, TRILHA_ALTA], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leito = interpolate(
    f,
    [NARRACAO_01_EM, NARRACAO_01_EM + s(1.2)],
    [TRILHA_ALTA, TRILHA_BASE],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const saida = interpolate(f, [COMPLETO_FRAMES - s(2.5), COMPLETO_FRAMES], [1, 0], {
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
      <Series.Sequence durationInFrames={CENA00_FRAMES}>
        <Cena00 />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CENA01_FRAMES}>
        <Cena01 />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CENA02_FRAMES}>
        <Cena02 />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CENA03_FRAMES}>
        <Cena03 />
      </Series.Sequence>

      {/* REMOVIVEL: apagar este bloco tira a cena 04 inteira, sem retimar nada */}
      <Series.Sequence durationInFrames={LACUNA_04}>
        <Placeholder
          cena="04"
          rotulo="Sonora a captar · removível"
          titulo="Alguém da Polishop que estava na decisão de 2025"
          detalhe="Pergunta que puxa: o QR code de 2023 não engajou. Por que vocês voltaram nele em vez de começar outra coisa? É a única pergunta do case que nenhuma cena de motion responde, e é o coração da história."
          origem="Se a captação não acontecer, esta cena sai inteira e o filme fecha 11 s mais curto. A cena 03 fecha uma afirmação completa e a 05 abre outra, então nada é retimado."
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
      <Series.Sequence durationInFrames={CENA08B_FRAMES}>
        <Cena08B />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CENA09_FRAMES}>
        <Cena09 />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
