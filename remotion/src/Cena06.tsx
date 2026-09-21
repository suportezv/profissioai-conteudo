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
import { janela, entra, s } from "./anim";
import { Sfx } from "./Sfx";

/**
 * Cena 06 do case: as tres escolhas.
 *
 * 16,5 s, narracao de 14,86 s. Um cartao aceso por vez, com borda azul no
 * ativo e o resto apagado no cinza de apoio. Sem glow: a revisao 3 marca
 * estado por borda, nao por brilho.
 *
 * Os tres "nao" entram no fim, discretos, e ficam ate o corte. Nao e
 * disclaimer juridico enfiado no rodape: e o limite do produto, e o roteiro
 * exige tempo de tela para ele.
 */

export const CENA06_FRAMES = s(16.5);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

const ESCOLHAS = [
  {
    n: "01",
    titulo: "Autolimitação",
    texto: "Percebe uso excessivo e reduz o próprio acesso.",
    acende: s(4.2),
  },
  {
    n: "02",
    titulo: "Sinalização de risco",
    texto: "Um segundo modelo lê o risco e aciona especialistas.",
    acende: s(7.6),
  },
  {
    n: "03",
    titulo: "Memória contínua",
    texto: "Quem sofre não deveria se explicar de novo.",
    acende: s(11.4),
  },
];

const NAOS = ["não diagnostica", "não prescreve", "não substitui terapia"];

export const Cena06: React.FC = () => {
  const f = useCurrentFrame();
  // a sobrelinha nao sai: era ela saindo que deixava um terco morto no alto
  const titulo = janela(f, s(0.6), CENA06_FRAMES, 14, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao/cena-06.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 500,
            letterSpacing: "-1.96px",
            lineHeight: 1.18,
            maxWidth: 1240,
            ...entra(titulo, 14),
          }}
        >
          Três escolhas, e nenhuma veio de boa prática de mercado
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {ESCOLHAS.map((e) => {
            const vivo = janela(f, e.acende, CENA06_FRAMES, 16, 0);
            // o cartao aceso e o ultimo que entrou; os anteriores recuam
            const proximo = ESCOLHAS.find((o) => o.acende > e.acende);
            const ativo = vivo > 0.4 && (!proximo || f < proximo.acende + 8);
            return (
              <div
                key={e.n}
                style={{
                  flex: 1,
                  background: marca.branco,
                  border: `1px solid ${ativo ? marca.azul : marca.linha}`,
                  borderRadius: marca.raio.painel,
                  padding: 44,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  minHeight: 340,
                  ...entra(vivo, 22),
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: ativo ? marca.azul : m.apoio,
                    letterSpacing: "-0.84px",
                  }}
                >
                  {e.n}
                </div>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 500,
                    letterSpacing: "-1.61px",
                    lineHeight: 1.2,
                    color: ativo ? m.tinta : m.apoio,
                  }}
                >
                  {e.titulo}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    letterSpacing: "-0.91px",
                    lineHeight: 1.5,
                    color: m.apoio,
                  }}
                >
                  {e.texto}
                </div>
              </div>
            );
          })}
        </div>

        {/* o limite do produto, com tempo de tela e sem dramatizar */}
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {NAOS.map((n, i) => (
            <span
              key={n}
              style={{
                fontSize: 26,
                letterSpacing: "-0.91px",
                color: m.apoio,
                ...entra(janela(f, s(13.4) + i * 8, CENA06_FRAMES, 12, 0), 10),
              }}
            >
              {n}
            </span>
          ))}
        </div>
      </AbsoluteFill>

      {/* um por cartao que acende, e um tique por "nao" */}
      {ESCOLHAS.map((e) => (
        <Sfx key={e.n} som="surge" em={e.acende} volume={0.2} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sfx key={"n" + i} som="marca" em={s(13.4) + i * 8} volume={0.12} />
      ))}
    </AbsoluteFill>
  );
};
