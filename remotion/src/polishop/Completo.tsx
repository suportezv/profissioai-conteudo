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
 * ## A lacuna da sonora saiu, e o filme foi apertado para 2:00
 *
 * A cena 04 era um cartão de 11 s reservando a sonora da Polishop. Em
 * 23/set/2026 o usuário mandou tirá-la e fechar o filme em dois minutos, que é
 * o teto do formulário. Os 11 s do cartão não bastavam: faltavam mais 14,6 s.
 *
 * **As caudas já estavam apertadas** (0,7 a 0,9 s por cena) e o silêncio dentro
 * das faixas somava só 2,8 s, então o corte tinha que sair de palavra. Quatro
 * frases saíram, escolhidas por já estarem ditas na tela:
 *
 * - cena 01, "e às vezes deixa escrito, onde o próximo vai ler" (−4,2 s). Sai
 *   com ela o cartão de avaliação de duas estrelas; a grade de dezesseis
 *   funções com duas acesas continua provando a tese sozinha.
 * - cena 05, "ajuda na configuração e no cuidado do equipamento" (−4,6 s). A
 *   linha de apoio na tela já dizia isso, e agora **ela carrega informação que
 *   a voz não carrega**, que é onde lettering vale a pena.
 * - cena 07, "avisa o ponto certo da carne" (−2,5 s).
 * - cena 08, os números longos por extenso viraram "cento e quarenta mil
 *   mensagens" e "quase três mil fotos" (−3,5 s). **A tela mantém 140.630 e
 *   2.888 exatos**: quem julga lê o número, a voz só precisa dar a ordem de
 *   grandeza.
 *
 * Nenhuma cena saiu e nenhum critério da categoria ficou sem resposta.
 *
 * ## A trilha nasce nula
 *
 * `--props '{"trilha":"..."}'` liga um leito. A escolha se faz depois do corte
 * inteiro, e o material se monta com `scripts/costura_secoes.py`: **uma trilha
 * só, com variação de densidade por filtro e pontos de tensão**, que foi onde
 * o case anterior chegou depois de três rodadas de recusa.
 */

const NARRACAO_01_EM = s(0.7);

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
