import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, conta, br, passo, s, tiquesDaContagem } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 08 do case Yooper: dois clientes, duas historias de decisao.
 *
 * 16,0 s. Locucao de 14,86 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "ROAS" 2,04 · "40 minutos" 3,10 · "Agora
 * leva segundos" 5,36 · "e ele consulta todo dia" 6,84 · "Outro viu o mes
 * fechar em" 8,86 · "12,22" 10,10 · "e decidiu aumentar o investimento"
 * 12,36 · "em 20%" 14,14.
 *
 * ## O portao de conformidade desta cena, e ele e o mais serio do filme
 *
 * **O agente nao fez o 12,22x. Ele mostrou o 12,22x a tempo.** O ROAS e
 * resultado da operacao de midia do cliente, e o que o case reivindica e ter
 * posto o numero na frente de quem decide no momento em que decidia. Escrever
 * "o agente gerou 12,22x" seria falso, e e exatamente o que o
 * `Comunicacao_Profissio.md` chama de atribuicao virando resultado.
 *
 * A tela separa as duas coisas **por escrito e por hierarquia**: o numero
 * carrega em cima de quem ele e, e a linha da Profissio embaixo diz o que foi
 * feito. Nenhum dos dois textos e opcional.
 *
 * ## Os 40 minutos sao um caso, nao uma media
 *
 * O lettering diz "um cliente, um calculo recorrente". Numero de eficiencia
 * sem base vira duvida quando o juri compara o video com o formulario escrito.
 *
 * ## A frequencia e o que prova mudanca de habito
 *
 * Quarenta minutos virando segundos e ganho de tempo. **De semanal para
 * diario e mudanca de comportamento**, que e o que a categoria premia, e por
 * isso os sete pontos entram em "todo dia" e nao junto da barra.
 */

export const CENA08_FRAMES = s(16);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const ROTULO_EM = s(0.46);
const BARRA_EM = s(3.1);
const ENCOLHE_EM = s(5.36);
const FREQ_EM = s(6.84);
const CORTE = s(8.5);
const NUM_EM = s(8.86);
const CLARO_EM = s(10.6);
const DECISAO_EM = s(12.36);

export const Cena08: React.FC = () => {
  const f = useCurrentFrame();

  const rotulo = janela(f, ROTULO_EM, CORTE, 10, 10);
  const barra = janela(f, BARRA_EM, CORTE, 10, 10);
  const encolhe = passo(f, ENCOLHE_EM, ENCOLHE_EM + s(1.0));
  const freq = janela(f, FREQ_EM, CORTE, 10, 10);
  const base = janela(f, BARRA_EM + s(0.4), CORTE, 10, 10);

  const num = janela(f, NUM_EM, CENA08_FRAMES, 13, 0);
  const v = conta(f, NUM_EM, NUM_EM + s(1.3), 12.22);
  const claro = janela(f, CLARO_EM, CENA08_FRAMES, 12, 0);
  const decisao = janela(f, DECISAO_EM, CENA08_FRAMES, 12, 0);

  // 1 ponto por semana vira 7 por semana: a frequencia e o habito
  const pontos = Math.round(interpolate(freq > 0.02 ? passo(f, FREQ_EM, FREQ_EM + s(1.0)) : 0, [0, 1], [1, 7]));

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-08.mp3")} />
      </Sequence>

      {/* ato A: quarenta minutos viram segundos, e semanal vira diario */}
      {rotulo > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: marca.azul,
                opacity: rotulo,
              }}
            >
              Um cálculo que ele pedia toda semana
            </div>

            {barra > 0.001 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, opacity: barra }}>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <div
                    style={{
                      height: 56,
                      width: interpolate(
                        encolhe,
                        [0, 1],
                        [1160 * passo(f, BARRA_EM, BARRA_EM + s(0.8)), 34],
                      ),
                      borderRadius: 10,
                      background: encolhe > 0.5 ? marca.azul : marca.linha,
                      border: `1px solid ${encolhe > 0.5 ? marca.azul : marca.linha}`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 66,
                      fontWeight: 500,
                      letterSpacing: "-2.31px",
                      color: encolhe > 0.5 ? marca.azul : m.tinta,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {encolhe > 0.5 ? "segundos" : "40 minutos"}
                  </div>
                </div>
              </div>
            ) : null}

            {freq > 0.001 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  ...entra(freq, 16),
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        background: i < pontos ? marca.azul : "transparent",
                        border: i < pontos ? "none" : `1px solid ${marca.linha}`,
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-1.4px" }}>
                  de semanal para diário
                </div>
              </div>
            ) : null}

            {base > 0.001 ? (
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: "-0.91px",
                  color: m.apoio,
                  borderTop: "1px solid rgba(16,18,24,0.22)",
                  paddingTop: 16,
                  opacity: base,
                }}
              >
                um cliente, um cálculo recorrente
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ato B: o 12,22x, com a autoria do numero separada do que o agente fez */}
      {num > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 30, ...entra(num, 24) }}>
            <div
              style={{
                fontSize: 26,
                letterSpacing: "-0.91px",
                color: m.apoio,
              }}
            >
              Outro cliente · ROAS faturado no mês
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 56 }}>
              <div
                style={{
                  fontSize: 200,
                  fontWeight: 500,
                  letterSpacing: "-7px",
                  lineHeight: 0.96,
                  color: marca.azul,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 18px 50px rgba(36,88,245,0.22)",
                }}
              >
                {br(v, 2)}x
              </div>

              {/* a separacao que o portao de conformidade exige */}
              {claro > 0.001 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    paddingBottom: 18,
                    maxWidth: 920,
                    ...entra(claro, 16),
                  }}
                >
                  <div
                    style={{
                      fontSize: 30,
                      letterSpacing: "-1.05px",
                      lineHeight: 1.35,
                      color: m.apoio,
                    }}
                  >
                    O resultado é da operação de mídia do cliente.
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 500,
                      letterSpacing: "-1.12px",
                      lineHeight: 1.3,
                      borderLeft: `3px solid ${marca.azul}`,
                      paddingLeft: 20,
                    }}
                  >
                    O agente pôs esse número na frente de quem decide,
                    <br />
                    no dia em que ele decidia.
                  </div>
                </div>
              ) : null}
            </div>

            {decisao > 0.001 ? (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: marca.azul,
                  borderRadius: marca.raio.painel,
                  boxShadow: marca.sombra.azul,
                  padding: "26px 40px",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 26,
                  ...entra(decisao, 18),
                }}
              >
                <div
                  style={{
                    fontSize: 62,
                    fontWeight: 500,
                    letterSpacing: "-2.17px",
                    color: marca.branco,
                  }}
                >
                  +20% de investimento
                </div>
                <div style={{ fontSize: 26, letterSpacing: "-0.91px", color: marca.apoioAzul }}>
                  decisão do cliente
                </div>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="tique" em={BARRA_EM} volume={0.08} />
      <Sfx som="apaga" em={ENCOLHE_EM} volume={0.2} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} som="tique" em={FREQ_EM + i * 5} volume={0.06} />
      ))}
      {tiquesDaContagem(NUM_EM, NUM_EM + s(1.3)).map((fr, i) => (
        <Sfx key={i} som="tique" em={fr} volume={0.07} />
      ))}
      <Sfx som="assenta" em={NUM_EM + s(1.3)} volume={0.36} />
      <Sfx som="surge" em={DECISAO_EM} volume={0.22} />
    </AbsoluteFill>
  );
};
