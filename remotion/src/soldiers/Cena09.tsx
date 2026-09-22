import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 09 do case Soldiers: a tese, a janela de medicao, e os lockups.
 *
 * 12 s, narracao de 6,50 s que comeca em 0,6 s.
 *
 * A locucao foi regravada nesta revisao: "O primeiro coorte sera medido nos
 * proximos noventa dias. O habito que vai sustentar a recompra ja esta de pe."
 * **Coorte e mais preciso que "primeira leva"** e e o termo que o formulario
 * do premio usa, o que ajuda o juri a conferir video contra formulario.
 *
 * No texto de locucao a palavra vai acentuada, **"coorte" com acento no
 * primeiro o**, porque sem ele o modelo fecha a vogal. Medido no F1 da
 * silaba tonica: 415 Hz sem o acento, que e o fechado, e 565 Hz com ele, que
 * e o aberto da pronuncia certa.
 *
 * A ordem na tela segue a ordem da fala: a janela de medicao entra primeiro,
 * a tese depois. Antes a tese vinha em cima e entrava antes de ser dita.
 *
 * ## A cena mais delicada do filme, e a razao e de integridade
 *
 * A categoria premia **resultado de recompra**, e o case ainda nao tem: os
 * primeiros clientes compraram no lancamento, em 05/ago/2026, e completam 90
 * dias no inicio de novembro.
 *
 * Esta cena declara isso em tela em vez de prometer o que nao existe. Nao e
 * fraqueza assumida por escrupulo: **o juri confere o video contra o formulario
 * escrito, e o formulario diz exatamente isso**. Video que promete mais que o
 * formulario perde nos dois.
 *
 * O que ela afirma no lugar e o que e verdade hoje e esta medido na cena 08: a
 * retencao foi desenhada na mecanica dos 90 dias cumulativos, e o habito diario
 * que vai sustentar a recompra ja esta de pe.
 *
 * ## Os lockups
 *
 * A anunciante e a Soldiers Nutrition; a Profissio assina como coautora. A
 * ordem nao e decorativa e a peca nao pode sugerir que a Profissio e dona do
 * produto.
 *
 * **As duas marcas assinam sobre uma faixa escura**, e a razao e do arquivo: o
 * logo que a Soldiers entregou e o branco, e branco sobre a superficie clara
 * nao existe. Painel escuro e a aplicacao correta dele. Como a Profissio
 * tambem tem versao branca para fundo escuro, as duas ficam na mesma condicao,
 * que e o que uma coautoria pede: recolorir a marca de um cliente para ela
 * caber no nosso fundo seria pior que trocar o fundo.
 */

export const CENA09_FRAMES = s(13.8);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

const ASSINA_EM = s(10.2);

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();

  // a fala diz a medicao primeiro e a tese depois; a tela acompanha
  const janelaMedicao = janela(f, s(0.7), ASSINA_EM, 9, 9);
  const tese = janela(f, s(6.7), ASSINA_EM, 10, 9);
  const assina = janela(f, ASSINA_EM, CENA09_FRAMES, 11, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-09.mp3")} />
      </Sequence>

      {janelaMedicao > 0.001 || tese > 0.001 ? (
        <AbsoluteFill
          style={{
            padding: MARGEM,
            justifyContent: "center",
            gap: 52,
          }}
        >
          {/* a janela de medicao, dita em tela e nao so no formulario */}
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "stretch",
              maxWidth: 1100,
              ...entra(janelaMedicao, 16),
            }}
          >
            <div style={{ width: 3, background: marca.azul, borderRadius: 2 }} />
            <div
              style={{
                fontSize: 34,
                letterSpacing: "-1.19px",
                lineHeight: 1.4,
                color: m.apoio,
              }}
            >
              A recompra já aparece nos primeiros números. O coorte completo
              de <span style={{ whiteSpace: "nowrap" }}>90 dias</span> fecha em
              novembro.
            </div>
          </div>

          <div
            style={{
              fontSize: 76,
              fontWeight: 500,
              letterSpacing: "-2.66px",
              lineHeight: 1.16,
              maxWidth: 1400,
              ...entra(tese, 20),
            }}
          >
            O hábito que sustenta esse movimento
            <br />
            <span style={{ color: marca.azul }}>já está de pé.</span>
          </div>
        </AbsoluteFill>
      ) : null}

      {assina > 0.001 ? (
        <AbsoluteFill
          style={{
            padding: MARGEM,
            alignItems: "center",
            justifyContent: "center",
            ...entra(assina, 20),
          }}
        >
          {/* a faixa escura: e onde as duas marcas brancas convivem */}
          <div
            style={{
              background: marca.tinta,
              borderRadius: marca.raio.arte,
              boxShadow: marca.sombra.painel,
              padding: "72px 110px",
              display: "flex",
              alignItems: "center",
              gap: 96,
            }}
          >
            <Img
              src={staticFile("marca-soldiers/soldiers-branco.png")}
              style={{ height: 150, width: "auto", display: "block" }}
            />

            <div
              style={{
                width: 1,
                height: 150,
                background: "rgba(255,255,255,0.22)",
              }}
            />

            <Img
              src={staticFile("marca/profissio-ai-branco.svg")}
              style={{ width: 460, height: "auto", display: "block" }}
            />
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="surge" em={ASSINA_EM} volume={0.2} />
    </AbsoluteFill>
  );
};
