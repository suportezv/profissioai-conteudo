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
import { janela, entra, conta, br, s, tiquesDaContagem } from "../anim";
import { Sfx } from "../Sfx";
import { useFormato } from "../formato";

/**
 * Cena 08 do case Polishop: o volume.
 *
 * 16,2 s. Locução de 15,09 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "De outubro de 2025 a setembro de 2026"
 * 0,48 · "11.100 conversas" 4,58 · "140.630 mensagens" 6,60 · "2.888 fotos de
 * ingredientes" 10,02.
 *
 * ## O terceiro número é o que a categoria premia, e por isso ele fecha
 *
 * 11.100 conversas e 140.630 mensagens são escala, e escala qualquer canal
 * tem. **2.888 fotos de ingredientes mandadas pelos próprios clientes** é
 * outra coisa: é gente usando um recurso multimodal por vontade própria, o que
 * separa "o agente tem visão computacional" de "as pessoas usam a visão
 * computacional do agente". Numa categoria de experiência, o segundo é o que
 * vale.
 *
 * Por isso ele entra por último, fica mais tempo e leva a linha de base
 * explicando de onde veio.
 *
 * ## O número mora inteiro, e o separador de milhar vem de graça
 *
 * Os três valores estavam guardados **em milhares com ponto decimal**
 * (`alvo: 11.1` com três casas), e `toLocaleString("pt-BR")` escreve a casa
 * decimal com **vírgula**: a tela dizia "11,100" e "140,630", que um brasileiro
 * lê como onze vírgula um. O `alvo` agora é o inteiro e `casas` é zero, então o
 * mesmo `br()` entrega "11.100" e "140.630", com o ponto de milhar que é o
 * padrão daqui. A contagem não muda: `tiquesDaContagem` divide a curva em vinte
 * degraus, não no valor.
 *
 * ## A distribuição regional não está aqui
 *
 * 63% Sudeste, 14,5% Nordeste e o resto ficaram fora do corte. Geografia não
 * responde a nenhum dos cinco critérios da categoria, e a cena já carrega três
 * números. O dado continua no formulário escrito.
 */

export const CENA08_FRAMES = s(12.6);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const PERIODO_EM = s(0.5);

type Dado = {
  entra: number;
  sai: number;
  alvo: number;
  casas: number;
  titulo: string;
  base: string;
};

const DADOS: Dado[] = [
  {
    entra: s(4.8),
    sai: s(7.0),
    alvo: 11100,
    casas: 0,
    titulo: "conversas",
    base: "out/2025 a 18/set/2026",
  },
  {
    entra: s(7.0),
    sai: s(9.4),
    alvo: 140630,
    casas: 0,
    titulo: "mensagens trocadas",
    base: "88,6% em texto · 9,1% em áudio",
  },
  {
    entra: s(9.4),
    sai: CENA08_FRAMES,
    alvo: 2888,
    casas: 0,
    titulo: "fotos de ingredientes",
    base: "mandadas pelos próprios clientes, pedindo receita",
  },
];

export const Cena08: React.FC = () => {
  const f = useCurrentFrame();
  const periodo = janela(f, PERIODO_EM, DADOS[0].entra + 10, 10, 10);
  // No 9:16 a cena ja era uma coluna: ela so cresce e se centra na faixa
  // segura em vez do quadro. O numero vai a 260, que e o maior corpo que
  // "140.630" aguenta dentro da margem.
  const { vertical, M, seguro } = useFormato();
  const faixa = vertical
    ? { paddingTop: seguro.topo, paddingBottom: 1920 - seguro.base, paddingLeft: M, paddingRight: M }
    : {};

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-08.mp3")} />
      </Sequence>

      {periodo > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center", ...faixa }}>
          <div
            style={{
              fontSize: vertical ? 84 : 64,
              fontWeight: 500,
              letterSpacing: vertical ? "-2.94px" : "-2.24px",
              lineHeight: 1.18,
              ...entra(periodo, 20),
            }}
          >
            De outubro de 2025
            <br />
            a <span style={{ color: marca.azul }}>setembro de 2026</span>.
          </div>
        </AbsoluteFill>
      ) : null}

      {DADOS.map((d, i) => {
        const ultimo = i === DADOS.length - 1;
        const o = janela(f, d.entra, d.sai, 13, ultimo ? 0 : 11);
        if (o <= 0.001) return null;
        const v = conta(f, d.entra, d.entra + s(1.1), d.alvo);
        return (
          <AbsoluteFill
            key={d.titulo}
            style={{ padding: MARGEM, justifyContent: "center", ...faixa }}
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
                  // 220 e o maior corpo em que "140.630" cabe nos 936 px uteis;
                  // a 260 o ultimo digito saia pela borda direita
                  fontSize: vertical ? 220 : 190,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-7.7px" : "-6.65px",
                  lineHeight: 1,
                  color: marca.azul,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 18px 50px rgba(36,88,245,0.22)",
                }}
              >
                {br(v, d.casas)}
              </div>
              <div
                style={{
                  fontSize: vertical ? 64 : 52,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-2.24px" : "-1.82px",
                  lineHeight: 1.15,
                }}
              >
                {d.titulo}
              </div>
              <div
                style={{
                  fontSize: vertical ? 34 : 26,
                  letterSpacing: vertical ? "-1.19px" : "-0.91px",
                  lineHeight: vertical ? 1.3 : undefined,
                  color: m.apoio,
                  borderTop: "1px solid rgba(16,18,24,0.22)",
                  paddingTop: 16,
                  maxWidth: vertical ? 1080 - M - seguro.direita : 1000,
                }}
              >
                {d.base}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}

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
    </AbsoluteFill>
  );
};
