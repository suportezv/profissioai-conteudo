import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 07 do case Soldiers: sete personas, uma arquitetura.
 *
 * 10 s, narracao de 7,89 s que comeca em 0,6 s. Pausas em 2,17 / 5,57 / 7,56 s.
 *
 * ## Os nomes ficam de fora ate a Soldiers aprovar
 *
 * O case cita Juju Salimeni, Lucas Stein e Vitor Zanelatto, e **nenhum dos tres
 * esta no material gravado**. Nome e imagem de influenciador so entram com
 * aprovacao, entao os cartoes mostram a **estrutura** (sete slots, um deles o
 * MODO base) e nao a identidade de ninguem.
 *
 * Isso nao e perda: a frase da narracao e sobre a arquitetura sustentar
 * crescimento, e e a arquitetura que precisa ser vista. Quando a aprovacao
 * chegar, e so trocar o texto de cada cartao, sem mexer no motion.
 *
 * ## A linha que liga
 *
 * Os sete cartoes descem de um unico ponto, e a linha so aparece depois que
 * todos entraram: ate la nao ha o que ligar. E o mesmo raciocinio do grafo de
 * fontes da cena 04 do case anterior.
 */

export const CENA07_FRAMES = s(10);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

/**
 * Sete slots. O primeiro e o MODO base, que o case nomeia e que nao depende de
 * aprovacao de ninguem; os outros ficam como posicao ate a Soldiers liberar.
 */
const PERSONAS = [
  { rotulo: "MODO base", base: true },
  { rotulo: "persona 02", base: false },
  { rotulo: "persona 03", base: false },
  { rotulo: "persona 04", base: false },
  { rotulo: "persona 05", base: false },
  { rotulo: "persona 06", base: false },
  { rotulo: "persona 07", base: false },
];

const PRIMEIRO = s(1.0);
const PASSO_ENTRE = 11;
const LIGA = s(6.4);

export const Cena07: React.FC = () => {
  const f = useCurrentFrame();
  const liga = passo(f, LIGA, LIGA + s(0.9));
  const base = janela(f, s(6.8), CENA07_FRAMES, 16, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-07.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 56,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: janela(f, s(0.6), CENA07_FRAMES, 14, 0),
          }}
        >
          Sete personas ao mesmo tempo
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {PERSONAS.map((p, i) => {
            const o = janela(f, PRIMEIRO + i * PASSO_ENTRE, CENA07_FRAMES, 12, 0);
            return (
              <div
                key={p.rotulo}
                style={{
                  flexGrow: 1,
                  background: p.base ? marca.azul : marca.branco,
                  border: `1px solid ${p.base ? marca.azul : marca.linha}`,
                  borderRadius: marca.raio.painel,
                  boxShadow: p.base ? marca.sombra.azul : marca.sombra.painel,
                  padding: 22,
                  minHeight: 230,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  ...entra(o, 18),
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: p.base ? marca.branco : marca.linha,
                  }}
                />
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 500,
                    letterSpacing: "-0.67px",
                    lineHeight: 1.25,
                    color: p.base ? marca.branco : m.apoio,
                  }}
                >
                  {p.rotulo}
                </div>
              </div>
            );
          })}
        </div>

        {/* a linha que liga os sete: so existe depois que todos entraram */}
        <div style={{ position: "relative", height: 60 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "7%",
              width: "86%",
              height: 1,
              background: "rgba(16,18,24,0.22)",
              transformOrigin: "center",
              transform: `scaleX(${liga})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 22,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 30,
              letterSpacing: "-1.05px",
              color: m.apoio,
              ...entra(base, 14),
            }}
          >
            a mesma arquitetura, testada uma vez
          </div>
        </div>
      </AbsoluteFill>

      {PERSONAS.map((p, i) => (
        <Sfx key={p.rotulo} som="tique" em={PRIMEIRO + i * PASSO_ENTRE} volume={0.11} />
      ))}
      <Sfx som="surge" em={LIGA} volume={0.2} />
    </AbsoluteFill>
  );
};
