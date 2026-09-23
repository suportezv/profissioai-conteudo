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
import { Cena09, CENA09_FRAMES } from "./Cena09";

/**
 * Corte de montagem do case Yooper, ponta a ponta.
 *
 * Duas lacunas, e elas sao de naturezas diferentes:
 *
 * - **Cena 04, sonora do cliente da Yoodash.** E a unica cena do filme
 *   projetada para poder **sair sem costura**, porque a captacao pode nao
 *   acontecer. Detalhe no `ROTEIRO.md`; o resumo e que a cena 03 fecha uma
 *   afirmacao completa, a cena 05 abre uma nova, e nada que a sonora diz e
 *   pressuposto depois. Tirar e apagar este `Series.Sequence`, sem retimar
 *   nada.
 * - **Cena 05B, sonora do Clesio.** Esta **nao sai**. Ela existe porque a cena
 *   05 e a afirmacao mais arriscada do filme, um agente que escreve na base do
 *   cliente, e e a primeira coisa que um juri questiona. Testemunha existe
 *   para cobrir o buraco que o juri vai procurar, e este e o buraco.
 *
 * **As duas sonoras do Clesio, esta e a do case Soldiers, se captam na mesma
 * sessao.** Sao dois filmes parados pela mesma pessoa; marcar duas captacoes
 * separadas seria desperdicio de agenda.
 *
 * ## A trilha nasce nula, de proposito
 *
 * `--props '{"trilha":"..."}'` liga um leito. A escolha se faz **depois do
 * corte inteiro**, renderizando uma vez sem musica e misturando cada candidata
 * por fora com `scripts/monta_trilha.py --alvo-dbfs`, que iguala a loudness
 * das candidatas. Sem isso a mais alta ganha sempre e a escolha vira acidente
 * de ganho.
 */

/** Onde a narracao da cena 01 entra, contado do inicio do filme. */
const NARRACAO_01_EM = CENA00_FRAMES + s(0.5);

/** A lacuna removivel: a sonora do cliente. */
const LACUNA_04 = s(11);
/** A lacuna que nao sai: o Clesio sobre governanca. */
const LACUNA_05B = s(13);

/**
 * A trilha aprovada, uma por corte: as bordas das secoes caem nos cortes de
 * cena, entao o corte sem lacunas tem mapa proprio (`trilha/mapa-sem-lacunas`).
 *
 * **Ela e o padrao, nao uma prop.** Enquanto nascia nula, o master horizontal
 * saiu certo porque o render passava `--props`, e o corte vertical, que usa a
 * mesma composicao, saiu sem musica (23/set). Quem quiser comparar candidatas
 * continua passando `--props '{"trilha":null}'`.
 */
const trilhaPadrao = (lacunas: boolean) =>
  lacunas ? "yooper/trilha.mp3" : "yooper/trilha-sem-lacunas.mp3";

const trilhaEscolhida = (lacunas: boolean): string | null => {
  const p = getInputProps() as { trilha?: string | null };
  return p.trilha === undefined ? trilhaPadrao(lacunas) : p.trilha;
};

const TRILHA_BASE = 0.24;
const TRILHA_ALTA = 0.4;
const FADE = s(2.5);

const SOMA_CENAS =
  CENA00_FRAMES +
  CENA01_FRAMES +
  CENA02_FRAMES +
  CENA03_FRAMES +
  CENA05_FRAMES +
  CENA06_FRAMES +
  CENA07_FRAMES +
  CENA08_FRAMES +
  CENA09_FRAMES;

/**
 * Duracao do corte. As lacunas de sonora sao **opcionais**: a
 * composicao aprovada as mantem, e a previa sem elas usa o mesmo
 * componente com `lacunas={false}`, entao nao existe uma segunda
 * copia do corte para envelhecer sozinha.
 */
export const framesDoCorte = (lacunas = true) =>
  SOMA_CENAS + (lacunas ? LACUNA_04 + LACUNA_05B : 0);

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
    {trilhaEscolhida(lacunas) ? (
      <Audio src={staticFile(trilhaEscolhida(lacunas) as string)} volume={volumeTrilha(framesDoCorte(lacunas))} />
    ) : null}

    <Series>
      {/* a abertura conceitual em Veo: padrao da casa desde o case 03 */}
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
      {lacunas ? (
        <Series.Sequence durationInFrames={LACUNA_04}>
          <Placeholder
            cena="04"
            rotulo="Sonora a captar · removível"
            titulo="Um cliente da Yoodash que usa o agente todo dia"
            detalhe="Pergunta que puxa: sobre o que você conversa com o time da Yooper agora, que não era sobre o que vocês conversavam antes? Ela responde satisfação e relacionamento, que é o critério onde o filme está mais fraco. Funcionalidade não, que as cenas 05 e 06 já provam sozinhas."
            origem="Se a captação não acontecer, esta cena sai inteira e o filme fecha 11 s mais curto. Nada aqui é pressuposto depois: a cena 03 fecha uma afirmação completa e a 05 abre outra."
          />
        </Series.Sequence>
      ) : null}

      <Series.Sequence durationInFrames={CENA05_FRAMES}>
        <Cena05 />
      </Series.Sequence>

      {/* NAO REMOVIVEL: a governanca e a afirmacao que o juri questiona */}
      {lacunas ? (
        <Series.Sequence durationInFrames={LACUNA_05B}>
          <Placeholder
            cena="05B"
            rotulo="Sonora a captar · Profissio"
            titulo="Clésio Souza, na Profissio"
            detalhe="Pergunta que puxa: por que um agente que pode mudar meta e orçamento nunca muda nada sozinho? A resposta é sobre governança e confiança, e ela cobre a objeção que a cena anterior acabou de abrir. Sem dado técnico na boca: número vai para lettering."
            origem="Mesma gramática de luz das sonoras dos cases anteriores, janela e plano médio, para os filmes parecerem a mesma série. A sonora do Clésio no case Soldiers se capta na mesma sessão."
          />
        </Series.Sequence>
      ) : null}

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
