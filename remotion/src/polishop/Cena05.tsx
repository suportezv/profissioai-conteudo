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
import { Painel, Balao } from "./Conversa";

/**
 * Cena 05 do case Polishop: o que o agente sabe antes de responder.
 *
 * 15,2 s. Locução de 13,98 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "Antes de responder" 0,50 · "os manuais
 * técnicos" 2,74 · "das seis linhas" 3,88 · "Sabe qual aparelho é o seu" 5,26 ·
 * "configuração e cuidado" 7,34 · "avisa quando a receita" 10,74 · "não cabe
 * nele" 13,32.
 *
 * ## A prova de RAG não é o grafo, é a recusa
 *
 * Seis manuais convergindo num nó é bonito e prova pouco: qualquer peça de
 * empresa de IA desenha isso. O que prova que o agente **leu** o manual é ele
 * **dizer não**: "essa receita pede grelha alta e o seu modelo não tem".
 *
 * Um agente que só concorda é um gerador de texto. Um que recusa dentro do
 * escopo do aparelho está consultando alguma coisa, e o espectador entende
 * isso sem que ninguém explique o que é RAG. Por isso a recusa ocupa os
 * últimos cinco segundos e não uma linha de lettering.
 *
 * ## A lista nomeia cinco, e a narração é quem diz seis
 *
 * O material do cliente fala em seis linhas e nomeia cinco: airfryers, panela
 * de pressão elétrica, forno de pizza, forno multifunção e forno 3 em 1. A cena
 * teve um sexto slot escrito `a confirmar`, e o usuário mandou tirar em
 * 23/set/2026. **O que sobrou não é uma contagem, é um exemplário**: o rótulo
 * diz "ele consulta o manual" e não "estas são as seis", então cinco nomes na
 * tela não contradizem o "seis linhas" que a locução afirma. Inventar a sexta
 * continua fora de questão.
 */

export const CENA05_FRAMES = s(11.2);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const MANUAIS_EM = s(2.5);
const MEU_EM = s(5.0);
const CUIDADO_EM = s(5.6);
const RECUSA_EM = s(7.0);
const NAO_CABE_EM = s(8.0);
const RESPOSTA_EM = s(8.5);

/** As cinco linhas que o material do cliente nomeia. */
const LINHAS = [
  { nome: "airfryers", meu: true },
  { nome: "panela de pressão elétrica", meu: false },
  { nome: "forno de pizza", meu: false },
  { nome: "forno multifunção", meu: false },
  { nome: "forno 3 em 1", meu: false },
];

export const Cena05: React.FC = () => {
  const f = useCurrentFrame();

  const rotulo = janela(f, s(0.5), RECUSA_EM, 10, 10);
  const grupo = janela(f, MANUAIS_EM, RECUSA_EM, 12, 10);
  const meu = passo(f, MEU_EM, MEU_EM + s(0.5));
  const cuidado = janela(f, CUIDADO_EM, RECUSA_EM, 10, 10);

  const recusa = janela(f, RECUSA_EM, CENA05_FRAMES, 12, 0);
  const pergunta = janela(f, RECUSA_EM + 6, CENA05_FRAMES, 10, 0);
  const resposta = janela(f, RESPOSTA_EM, CENA05_FRAMES, 10, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-05.mp3")} />
      </Sequence>

      {/* ato A: os seis manuais, e qual deles e o seu */}
      {rotulo > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center", gap: 44 }}>
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
            Antes de responder, ele consulta o manual
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: grupo }}>
            {LINHAS.map((l, i) => {
              const o = passo(f, MANUAIS_EM + i * 4, MANUAIS_EM + i * 4 + 11);
              const aceso = l.meu && meu > 0.5;
              const ent = entra(o, 12);
              return (
                <div
                  key={l.nome}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    ...ent,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 34,
                      borderRadius: 2,
                      background: aceso ? marca.azul : marca.linha,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 500,
                      letterSpacing: "-1.4px",
                      color: aceso ? marca.azul : m.tinta,
                    }}
                  >
                    {l.nome}
                  </div>
                  {aceso ? (
                    <div
                      style={{
                        fontSize: 22,
                        letterSpacing: "1.6px",
                        textTransform: "uppercase",
                        color: marca.azul,
                        border: `1px solid ${marca.azul}`,
                        borderRadius: 999,
                        padding: "6px 14px",
                        opacity: meu,
                      }}
                    >
                      o seu
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {cuidado > 0.001 ? (
            <div
              style={{
                fontSize: 30,
                letterSpacing: "-1.05px",
                color: m.apoio,
                borderTop: "1px solid rgba(16,18,24,0.22)",
                paddingTop: 20,
                ...entra(cuidado, 14),
              }}
            >
              configuração, cuidado do equipamento e o que cada modelo aguenta
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* ato B: a recusa, que e a prova de que ele leu o manual */}
      {recusa > 0.001 ? (
        <AbsoluteFill
          style={{
            padding: MARGEM,
            flexDirection: "row",
            alignItems: "center",
            gap: 80,
            ...entra(recusa, 22),
          }}
        >
          <Painel largura={720} altura={280} o={recusa}>
            {pergunta > 0.001 ? (
              <Balao o={pergunta} saida>
                dá pra fazer costela defumada aqui?
              </Balao>
            ) : null}
            {resposta > 0.001 ? (
              <Balao o={resposta}>
                Nessa não dá: defumar pede tempo longo em temperatura baixa com
                fumaça, e a sua air fryer não tem esse modo. Posso te dar uma
                costela na pressão e finalizar na air fryer pra dourar?
              </Balao>
            ) : null}
          </Painel>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 500,
                letterSpacing: "-1.96px",
                lineHeight: 1.18,
              }}
            >
              Ele também
              <br />
              <span style={{ color: marca.azul }}>sabe dizer não.</span>
            </div>
            <div
              style={{
                fontSize: 28,
                letterSpacing: "-0.98px",
                color: m.apoio,
                borderTop: "1px solid rgba(16,18,24,0.22)",
                paddingTop: 18,
              }}
            >
              um agente que só concorda não consultou nada
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {LINHAS.map((l, i) => (
        <Sfx key={l.nome} som="tique" em={MANUAIS_EM + i * 4} volume={0.06} />
      ))}
      <Sfx som="assenta" em={MEU_EM} volume={0.26} />
      <Sfx som="pop" em={RECUSA_EM + 6} volume={0.16} />
      <Sfx som="recebido" em={RESPOSTA_EM} volume={0.18} />
    </AbsoluteFill>
  );
};
