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
import {
  janela,
  entra,
  conta,
  br,
  passo,
  s,
  tiquesDaContagem,
  contaInteira,
  degraus,
} from "../anim";
import { Sfx } from "../Sfx";
import { useFormato } from "../formato";
import { Rosto } from "./Rosto";

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
 * ## Os dois clientes ganharam rosto
 *
 * A cena fala de "um cliente" e de "outro cliente", e ate aqui os dois eram
 * so rotulos de texto. Com um rosto por ato, a cena passa a ter **duas
 * pessoas** em vez de dois paragrafos, e o corte entre os atos fica obvio sem
 * precisar de cartela.
 *
 * O rosto **comeca pensativo e abre o sorriso no frame do resultado**: no ato
 * A quando os quarenta minutos viram segundos, no ato B quando o cliente
 * decide aumentar o investimento. E a expressao que entrega a boa noticia,
 * entao ela precisa cair junto com a palavra que a diz.
 *
 * Nao e emoji de fonte: o render headless nao tem fonte de emoji, e um
 * desenho animado diz o que um caractere parado nao diz. Detalhe no
 * `Rosto.tsx`.
 *
 * ## A frequencia e o que prova mudanca de habito
 *
 * Quarenta minutos virando segundos e ganho de tempo. **De semanal para
 * diario e mudanca de comportamento**, que e o que a categoria premia, e por
 * isso os sete pontos entram em "todo dia" e nao junto da barra.
 */

export const CENA08_FRAMES = s(16.5);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const ROTULO_EM = s(0.46);
const BARRA_EM = s(3.1);
const ENCOLHE_EM = s(5.36);
const FREQ_EM = s(6.84);
const PONTOS_ATE = FREQ_EM + s(1.0);
const CORTE = s(8.5);
const NUM_EM = s(8.86);
const CLARO_EM = s(10.6);
const DECISAO_EM = s(12.36);

/**
 * No 9:16 os dois atos continuam sendo uma coluna centrada na faixa segura,
 * mas o que no 16:9 corre lado a lado passa a empilhar: o "40 minutos" sobe
 * para cima da barra (que ganha a largura util inteira), os pontos da
 * frequencia ficam em cima da frase, e o 12,22x fica em cima da separacao de
 * autoria, que e texto longo e precisa de largura.
 */
const V_BARRA = 936;
const V_ROSTO = 140;
/** Topo fixo de cada ato no 9:16, para o conteudo fechar centrado na faixa segura. */
const V_TOPO_A = 540;
const V_TOPO_B = 470;

export const Cena08: React.FC = () => {
  const f = useCurrentFrame();
  const { vertical, M } = useFormato();

  const rotulo = janela(f, ROTULO_EM, CORTE, 10, 10);
  const barra = janela(f, BARRA_EM, CORTE, 10, 10);
  const encolhe = passo(f, ENCOLHE_EM, ENCOLHE_EM + s(1.0));
  const freq = janela(f, FREQ_EM, CORTE, 10, 10);
  const base = janela(f, BARRA_EM + s(0.4), CORTE, 10, 10);

  const num = janela(f, NUM_EM, CENA08_FRAMES, 13, 0);
  const v = conta(f, NUM_EM, NUM_EM + s(1.3), 12.22);
  const claro = janela(f, CLARO_EM, CENA08_FRAMES, 12, 0);
  const decisao = janela(f, DECISAO_EM, CENA08_FRAMES, 12, 0);

  /**
   * O sorriso cai no frame do resultado, nao na entrada do rosto.
   *
   * E o estado de partida e **pensativo**, nao neutro. Neutro com a boca reta
   * le como triste, e o usuario pegou isso no cliente B, que acabara de ver um
   * ROAS de 12x e aparecia emburrado. Pensativo tambem e o que aquelas pessoas
   * estavam fazendo de fato: olhando um numero e decidindo o que fazer com
   * ele.
   */
  const sorriA = passo(f, ENCOLHE_EM + s(0.2), ENCOLHE_EM + s(1.0));
  const sorriB = passo(f, DECISAO_EM, DECISAO_EM + s(0.8));

  // 1 ponto por semana vira 7 por semana: a frequencia e o habito
  // **Imagem e som saem da mesma expressão.** Os pontos cresciam na curva
  // SUAVE e os toques tocavam a cada cinco quadros: duas cadências, e um
  // toque a mais, porque o primeiro soava quando a contagem ainda estava em 1
  // e nenhum ponto novo tinha aparecido. Agora a contagem é linear (o olho
  // precisa contar, e curva junta os primeiros degraus) e os toques vêm de
  // `degraus`, que devolve exatamente os quadros em que ela muda.
  const pontos = freq > 0.02 ? contaInteira(f, FREQ_EM, PONTOS_ATE, 1, 7) : 1;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-08.mp3")} />
      </Sequence>

      {/* ato A: quarenta minutos viram segundos, e semanal vira diario */}
      {rotulo > 0.001 ? (
        <AbsoluteFill
          style={
            // no 9:16 a coluna cresce para baixo a partir de um topo fixo:
            // centrada, ela subiria a cada elemento novo, e na altura do
            // quadro vertical esse deslize fica grande demais
            vertical
              ? { padding: `${V_TOPO_A}px ${M}px 0`, justifyContent: "flex-start" }
              : { padding: MARGEM, justifyContent: "center" }
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: vertical ? 60 : 44 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: rotulo,
              }}
            >
              <Rosto alegria={sorriA} tamanho={vertical ? V_ROSTO : 104} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    fontSize: vertical ? 28 : 24,
                    fontWeight: 500,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: marca.azul,
                  }}
                >
                  Cliente A
                </div>
                <div
                  style={{
                    fontSize: vertical ? 44 : 34,
                    fontWeight: 500,
                    letterSpacing: vertical ? "-1.54px" : "-1.19px",
                    lineHeight: vertical ? 1.18 : undefined,
                  }}
                >
                  Um cálculo que ele pedia toda semana
                </div>
              </div>
            </div>

            {barra > 0.001 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, opacity: barra }}>
                <div
                  style={
                    vertical
                      ? {
                          // o texto sobe para cima da barra sem mudar a
                          // ordem dos elementos
                          display: "flex",
                          flexDirection: "column-reverse",
                          alignItems: "flex-start",
                          gap: 20,
                        }
                      : { display: "flex", alignItems: "center", gap: 28 }
                  }
                >
                  <div
                    style={{
                      height: vertical ? 68 : 56,
                      width: interpolate(
                        encolhe,
                        [0, 1],
                        [(vertical ? V_BARRA : 1160) * passo(f, BARRA_EM, BARRA_EM + s(0.8)), 34],
                      ),
                      borderRadius: 10,
                      background: encolhe > 0.5 ? marca.azul : marca.linha,
                      border: `1px solid ${encolhe > 0.5 ? marca.azul : marca.linha}`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: vertical ? 96 : 66,
                      fontWeight: 500,
                      letterSpacing: vertical ? "-3.36px" : "-2.31px",
                      lineHeight: vertical ? 1.05 : undefined,
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
                  flexDirection: vertical ? "column" : "row",
                  alignItems: vertical ? "flex-start" : "center",
                  gap: vertical ? 22 : 26,
                  ...entra(freq, 16),
                }}
              >
                <div style={{ display: "flex", gap: vertical ? 18 : 12 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: vertical ? 40 : 22,
                        height: vertical ? 40 : 22,
                        borderRadius: vertical ? 20 : 11,
                        background: i < pontos ? marca.azul : "transparent",
                        border: i < pontos ? "none" : `1px solid ${marca.linha}`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: vertical ? 54 : 40,
                    fontWeight: 500,
                    letterSpacing: vertical ? "-1.89px" : "-1.4px",
                  }}
                >
                  de semanal para diário
                </div>
              </div>
            ) : null}

            {base > 0.001 ? (
              <div
                style={{
                  fontSize: vertical ? 30 : 26,
                  letterSpacing: vertical ? "-1.05px" : "-0.91px",
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
        <AbsoluteFill
          style={
            vertical
              ? { padding: `${V_TOPO_B}px ${M}px 0`, justifyContent: "flex-start" }
              : { padding: MARGEM, justifyContent: "center" }
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: vertical ? 36 : 28,
              ...entra(num, 24),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <Rosto alegria={sorriB} tamanho={vertical ? V_ROSTO : 104} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    fontSize: vertical ? 28 : 24,
                    fontWeight: 500,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: marca.azul,
                  }}
                >
                  Cliente B
                </div>
                <div
                  style={{
                    fontSize: vertical ? 44 : 34,
                    fontWeight: 500,
                    letterSpacing: vertical ? "-1.54px" : "-1.19px",
                  }}
                >
                  ROAS faturado no mês
                </div>
              </div>
            </div>

            <div
              style={
                vertical
                  ? { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 28 }
                  : { display: "flex", alignItems: "flex-end", gap: 56 }
              }
            >
              <div
                style={{
                  fontSize: vertical ? 240 : 200,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-8.4px" : "-7px",
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
                    paddingBottom: vertical ? 0 : 18,
                    maxWidth: vertical ? 868 : 920,
                    ...entra(claro, 16),
                  }}
                >
                  <div
                    style={{
                      fontSize: vertical ? 34 : 30,
                      letterSpacing: vertical ? "-1.19px" : "-1.05px",
                      lineHeight: 1.35,
                      color: m.apoio,
                    }}
                  >
                    O resultado é da operação de mídia do cliente.
                  </div>
                  <div
                    style={{
                      fontSize: vertical ? 38 : 32,
                      fontWeight: 500,
                      letterSpacing: vertical ? "-1.33px" : "-1.12px",
                      lineHeight: 1.3,
                      borderLeft: `3px solid ${marca.azul}`,
                      paddingLeft: 20,
                    }}
                  >
                    O agente pôs esse número na frente de quem decide,
                    {vertical ? " " : <br />}
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
                  padding: vertical ? "30px 40px" : "26px 40px",
                  display: "flex",
                  flexDirection: vertical ? "column" : "row",
                  alignItems: vertical ? "flex-start" : "baseline",
                  gap: vertical ? 6 : 26,
                  ...entra(decisao, 18),
                }}
              >
                <div
                  style={{
                    fontSize: vertical ? 72 : 62,
                    fontWeight: 500,
                    letterSpacing: vertical ? "-2.52px" : "-2.17px",
                    color: marca.branco,
                  }}
                >
                  +20% de investimento
                </div>
                <div
                  style={{
                    fontSize: vertical ? 30 : 26,
                    letterSpacing: vertical ? "-1.05px" : "-0.91px",
                    color: marca.apoioAzul,
                  }}
                >
                  decisão do cliente
                </div>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="tique" em={BARRA_EM} volume={0.08} />
      <Sfx som="apaga" em={ENCOLHE_EM} volume={0.2} />
      {degraus(FREQ_EM, PONTOS_ATE, 1, 7).map((fr, i) => (
        <Sfx key={i} som="tique" em={fr} volume={0.06} />
      ))}
      {tiquesDaContagem(NUM_EM, NUM_EM + s(1.3)).map((fr, i) => (
        <Sfx key={i} som="tique" em={fr} volume={0.07} />
      ))}
      <Sfx som="assenta" em={NUM_EM + s(1.3)} volume={0.36} />
      <Sfx som="surge" em={DECISAO_EM} volume={0.22} />
    </AbsoluteFill>
  );
};
