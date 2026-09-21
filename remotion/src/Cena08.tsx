import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { janela, entra, conta, br, s } from "./anim";

/**
 * Cena 08 do case: o que aconteceu, em numero.
 *
 * 11,5 s, narracao de 9,85 s. Um numero por vez, e **cada um com a sua base e
 * o seu periodo colados nele**. Nao e escrupulo de rodape: o
 * `Comunicacao_Profissio.md` proibe porcentagem sem contexto, base e metodo, e
 * o juri confere o video contra o formulario escrito.
 *
 * Os 35 mil e os 625 tem bases diferentes de proposito. 35 mil e o total
 * atendido no periodo; 625 e a coorte medida em agosto. Numero sem base vira
 * duvida, entao as duas aparecem.
 */

export const CENA08_FRAMES = s(11.5);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

type Dado = {
  entra: number;
  sai: number;
  alvo: number;
  casas: number;
  sufixo: string;
  prefixo?: string;
  titulo: string;
  base: string;
};

const DADOS: Dado[] = [
  {
    entra: s(1.1),
    sai: s(4.0),
    alvo: 35,
    casas: 0,
    sufixo: " mil",
    titulo: "usuários",
    base: "jun/2025 a set/2026",
  },
  {
    entra: s(4.0),
    sai: s(6.6),
    alvo: 2.3,
    casas: 1,
    sufixo: " mi",
    titulo: "mensagens trocadas",
    base: "no mesmo período",
  },
  {
    entra: s(6.6),
    sai: s(8.4),
    alvo: 19,
    casas: 0,
    sufixo: "%",
    titulo: "em áudio",
    base: "390 mil mensagens",
  },
  {
    entra: s(8.4),
    sai: CENA08_FRAMES,
    alvo: 75.7,
    casas: 1,
    sufixo: "%",
    titulo: "voltaram na semana seguinte",
    base: "473 de 625 pessoas · ago/2026",
  },
];

export const Cena08: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao/cena-08.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
        {DADOS.map((d, i) => {
          const ultimo = i === DADOS.length - 1;
          const o = janela(f, d.entra, d.sai, 14, ultimo ? 0 : 12);
          if (o <= 0.001) return null;
          const v = conta(f, d.entra, d.entra + s(1.1), d.alvo);
          return (
            <div
              key={d.titulo}
              style={{
                position: "absolute",
                left: MARGEM,
                right: MARGEM,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                ...entra(o, 24),
              }}
            >
              <div
                style={{
                  fontSize: 200,
                  fontWeight: 500,
                  letterSpacing: "-7px",
                  lineHeight: 1,
                  color: marca.azul,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {d.prefixo ?? ""}
                {br(v, d.casas)}
                {d.sufixo}
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 500,
                  letterSpacing: "-1.82px",
                  lineHeight: 1.15,
                }}
              >
                {d.titulo}
              </div>
              {/* a base anda junto do numero, nunca num rodape solto */}
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: "-0.91px",
                  color: m.apoio,
                  borderTop: `1px solid ${marca.linha}`,
                  paddingTop: 16,
                  maxWidth: 760,
                }}
              >
                {d.base}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
