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
 * 15 s, narracao de 5,02 s que comeca em 0,6 s. Pausas em 2,11 e 4,71 s.
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
 * **O lockup da Soldiers ainda nao chegou.** Ate ele chegar, entra um campo
 * marcado, e nao um desenho aproximado: recriar a marca de um cliente a mao e
 * pior que assumir que ela falta.
 */

export const CENA09_FRAMES = s(15);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

const ASSINA_EM = s(9.4);

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();

  const tese = janela(f, s(0.8), ASSINA_EM, 16, 14);
  const janelaMedicao = janela(f, s(3.2), ASSINA_EM, 14, 14);
  const assina = janela(f, ASSINA_EM, CENA09_FRAMES, 18, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-09.mp3")} />
      </Sequence>

      {tese > 0.001 ? (
        <AbsoluteFill
          style={{
            padding: MARGEM,
            justifyContent: "center",
            gap: 48,
            opacity: tese,
          }}
        >
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
            O hábito que vai sustentar a recompra
            <br />
            <span style={{ color: marca.azul }}>já está de pé.</span>
          </div>

          {/* a janela de medicao, dita em tela e nao so no formulario */}
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "stretch",
              maxWidth: 900,
              ...entra(janelaMedicao, 16),
            }}
          >
            <div style={{ width: 3, background: marca.azul, borderRadius: 2 }} />
            <div
              style={{
                fontSize: 30,
                letterSpacing: "-1.05px",
                lineHeight: 1.45,
                color: m.apoio,
              }}
            >
              A primeira leva de 90 dias vence no início de novembro de 2026.
              <br />A recompra começa a ser medida a partir daí.
            </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 88 }}>
            {/* o lockup da Soldiers ainda nao chegou: campo marcado, nunca um
                desenho aproximado da marca do cliente */}
            <div
              style={{
                width: 420,
                height: 200,
                border: `2px dashed ${marca.linha}`,
                borderRadius: marca.raio.painel,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  letterSpacing: "-1.05px",
                  color: m.apoio,
                }}
              >
                Soldiers Nutrition
              </div>
              <div style={{ fontSize: 19, letterSpacing: "-0.66px", color: m.apoio }}>
                lockup a pedir ao cliente
              </div>
            </div>

            <div style={{ width: 1, height: 200, background: marca.linha }} />

            <Img
              src={staticFile("marca/profissio-ai-escuro.svg")}
              style={{ width: 500, height: "auto" }}
            />
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="surge" em={ASSINA_EM} volume={0.2} />
    </AbsoluteFill>
  );
};
