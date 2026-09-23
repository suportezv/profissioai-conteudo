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
import { janela, entra, conta, br, passo, s, tiquesDaContagem } from "../anim";
import { useFormato } from "../formato";
import { Sfx } from "../Sfx";

/**
 * Cena 07 do case Yooper: a prova de volume e de autonomia.
 *
 * 16,9 s. Locucao de 15,79 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "De maio a setembro" 0,50 · "131 usuarios"
 * 2,20 · "10.039 mensagens" 4,50 · "quase quatro em cada dez" 7,18 ·
 * "75% dos usuarios" 11,62 · "nunca precisaram falar com um humano" 13,94.
 *
 * ## Dois buracos de base, e os dois estao escritos na tela
 *
 * 1. **O 38,9% era de conversas e o material so trazia mensagens**, que e
 *    outra coisa. O numero absoluto chegou em 22/set: **54 conversas** fora do
 *    horario comercial, e e ele que vai na regua embaixo do percentual. Quem
 *    confere deriva a base sozinho, e a pendencia saiu da tela.
 * 2. **O NPS e 67** (corrigido pelo usuario em 23/set/2026; a primeira
 *    versao dizia 100). Antes ele aparecia como pendencia
 *    em rosa; confirmado, entra como dado na mesma regua do
 *    75%, e nao como ausencia silenciosa.
 *
 * ## O 75% nao e um numero, e uma contagem
 *
 * Os outros tres sao cartoes de volume e se resolvem com contador. O 75% e a
 * afirmacao que a categoria premia, entao ele ganha **131 pontos com 98
 * acesos**: a base aparece junto do resultado, no mesmo desenho, sem precisar
 * de rodape. Quem olha ve de quantas pessoas se trata enquanto ve a
 * proporcao.
 *
 * Os pontos acendem na mesma curva que move o numero, entao o 75% e os 98
 * chegam juntos. Contagem que termina antes do numero lê como duas coisas
 * diferentes acontecendo na mesma tela.
 */

export const CENA07_FRAMES = s(16.9);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const PERIODO_EM = s(0.5);
const GRADE_EM = s(11.3);

type Dado = {
  entra: number;
  sai: number;
  alvo: number;
  casas: number;
  sufixo: string;
  titulo: string;
  base: string;
};

const DADOS: Dado[] = [
  {
    entra: s(2.2),
    sai: s(4.5),
    alvo: 131,
    casas: 0,
    sufixo: "",
    titulo: "usuários únicos",
    base: "maio a 18/set/2026",
  },
  {
    entra: s(4.5),
    sai: s(7.06),
    alvo: 10039,
    casas: 0,
    sufixo: "",
    titulo: "mensagens trocadas",
    base: "no mesmo período",
  },
  {
    entra: s(7.06),
    sai: GRADE_EM,
    alvo: 38.9,
    casas: 1,
    sufixo: "%",
    titulo: "das conversas fora do horário comercial",
    base: "54 conversas · maio a 18/set/2026",
  },
];

const TOTAL = 131;
const SEM_HUMANO = 98;
const COLUNAS = 19;
const PONTO = 20;
const VAO = 12;

/**
 * No 9:16 o 75% e a frase empilham no alto e a grade desce inteira embaixo
 * deles na largura util: 15 colunas por 9 linhas, com a ultima linha quase
 * completa, que le como contagem e nao como sobra.
 */
const COLUNAS_V = 15;
const PONTO_V = 44;
const VAO_V = 18;

export const Cena07: React.FC = () => {
  const f = useCurrentFrame();
  const { vertical, M } = useFormato();
  const ponto = vertical ? PONTO_V : PONTO;

  const periodo = janela(f, PERIODO_EM, GRADE_EM, 10, 10);
  const grade = janela(f, GRADE_EM, CENA07_FRAMES, 13, 0);
  const acende = passo(f, GRADE_EM + s(0.5), GRADE_EM + s(2.2));
  const acesos = Math.round(acende * SEM_HUMANO);
  /**
 * 75%, nao 74,8%.
 *
 * E o numero que o cliente informou e o que a locucao diz; 98 de 131 da
 * 74,81%, que arredonda para 75. Mostrar 74,8% com a voz dizendo "setenta e
 * cinco por cento" seria uma divergencia que o espectador ouve. O
 * arredondamento fica transparente porque **a base esta na mesma tela**, logo
 * abaixo dos pontos.
 */
  const pct = conta(f, GRADE_EM + s(0.5), GRADE_EM + s(2.2), 75);
  const rodape = janela(f, GRADE_EM + s(2.6), CENA07_FRAMES, 12, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-07.mp3")} />
      </Sequence>

      {periodo > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: vertical ? M : MARGEM,
            top: vertical ? 236 : 128,
            fontSize: vertical ? 30 : 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: periodo,
          }}
        >
          Maio a 18 de setembro de 2026
        </div>
      ) : null}

      {DADOS.map((d, i) => {
        const o = janela(f, d.entra, d.sai, 14, 12);
        if (o <= 0.001) return null;
        const v = conta(f, d.entra, d.entra + s(1.1), d.alvo);
        return (
          <AbsoluteFill
            key={d.titulo}
            style={{ padding: vertical ? M : MARGEM, justifyContent: "center" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: vertical ? 24 : 20,
                ...entra(o, 24),
              }}
            >
              <div
                style={{
                  fontSize: vertical ? 270 : 190,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-9.45px" : "-6.65px",
                  lineHeight: 1,
                  color: marca.azul,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 18px 50px rgba(36,88,245,0.22)",
                }}
              >
                {br(v, d.casas)}
                {d.sufixo}
              </div>
              <div
                style={{
                  fontSize: vertical ? 66 : 52,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-2.31px" : "-1.82px",
                  lineHeight: 1.15,
                  // no 9:16 a metade de baixo evita a coluna de botoes do app
                  maxWidth: vertical ? 868 : 1200,
                }}
              >
                {d.titulo}
              </div>
              {/* a base anda colada no numero, e onde ela falta isso esta escrito */}
              <div
                style={{
                  fontSize: vertical ? 32 : 26,
                  letterSpacing: vertical ? "-1.12px" : "-0.91px",
                  color: m.apoio,
                  borderTop: "1px solid rgba(16,18,24,0.22)",
                  paddingTop: 16,
                  maxWidth: vertical ? 868 : 900,
                }}
              >
                {d.base}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}

      {/* o 75%: a proporcao e a base no mesmo desenho */}
      {grade > 0.001 ? (
        <AbsoluteFill
          style={
            vertical
              ? {
                  // topo fixo: a regua da base entra depois, e centrada ela
                  // empurraria a grade inteira para cima
                  padding: `290px ${M}px 0`,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 56,
                  ...entra(grade, 24),
                }
              : {
                  padding: MARGEM,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 90,
                  ...entra(grade, 24),
                }
          }
        >
          <div
            style={
              vertical
                ? { display: "flex", flexDirection: "column", gap: 14 }
                : { display: "flex", flexDirection: "column", gap: 18, width: 620 }
            }
          >
            <div
              style={{
                fontSize: vertical ? 280 : 170,
                fontWeight: 500,
                letterSpacing: vertical ? "-9.8px" : "-5.95px",
                lineHeight: 1,
                color: marca.azul,
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 18px 50px rgba(36,88,245,0.22)",
              }}
            >
              {br(pct, 0)}%
            </div>
            <div
              style={{
                fontSize: vertical ? 48 : 46,
                fontWeight: 500,
                letterSpacing: vertical ? "-1.68px" : "-1.61px",
                lineHeight: 1.18,
              }}
            >
              dos usuários nunca
              <br />
              precisaram falar
              <br />
              com um humano
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${vertical ? COLUNAS_V : COLUNAS}, ${ponto}px)`,
                gap: vertical ? VAO_V : VAO,
              }}
            >
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: ponto,
                    height: ponto,
                    borderRadius: ponto / 2,
                    background: i < acesos ? marca.azul : "transparent",
                    border: i < acesos ? "none" : `1px solid ${marca.linha}`,
                  }}
                />
              ))}
            </div>
            {rodape > 0.001 ? (
              <div
                style={{
                  fontSize: vertical ? 32 : 26,
                  letterSpacing: vertical ? "-1.12px" : "-0.91px",
                  color: m.apoio,
                  borderTop: "1px solid rgba(16,18,24,0.22)",
                  paddingTop: 16,
                  ...entra(rodape, 14),
                }}
              >
                {SEM_HUMANO} de {TOTAL} usuários · NPS 67
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      {DADOS.map((d) => {
        const paraEm = d.entra + s(1.1);
        return (
          <React.Fragment key={d.titulo}>
            {tiquesDaContagem(d.entra, paraEm).map((fr, i) => (
              <Sfx key={i} som="tique" em={fr} volume={0.07} />
            ))}
            <Sfx som="assenta" em={paraEm} volume={0.36} />
          </React.Fragment>
        );
      })}
      {tiquesDaContagem(GRADE_EM + s(0.5), GRADE_EM + s(2.2)).map((fr, i) => (
        <Sfx key={i} som="tique" em={fr} volume={0.07} />
      ))}
      <Sfx som="assenta" em={GRADE_EM + s(2.2)} volume={0.4} />
    </AbsoluteFill>
  );
};
