import React from "react";
import { interpolate } from "remotion";
import { marca } from "../marca";
import { UI } from "../whatsapp";

/**
 * Painel de dashboard recriado, usado pelas cenas 01 e 05 do case Yooper.
 *
 * Fica separado pelo mesmo motivo do `whatsapp.ts`: **duas cenas desenham a
 * mesma tela**. Na 01 ela e o problema (o dado esta la, completo, e ninguem
 * decide), na 05 ela e o efeito da acao confirmada no WhatsApp. Se cada cena
 * guardasse os proprios hexes as duas divergiriam na primeira revisao, e o
 * filme depende de o espectador reconhecer que e o **mesmo painel**.
 *
 * ## Por que a paleta e neutra, e nao a da marca
 *
 * O painel e a plataforma do cliente, nao um produto da Profissio. Pintar o
 * dashboard de azul `#2458F5` faria a tela parecer nossa, que e exatamente o
 * erro que o case 03 cometeu ao por o WhatsApp no azul da marca. Aqui o
 * dashboard vive em cinza de interface e **o azul entra so no lettering da
 * Profissio**, o que separa o que e produto de terceiro do que e afirmacao
 * nossa.
 *
 * Tem um efeito editorial de bonus: um painel monocromatico le como "correto e
 * inerte", que e literalmente a tese da cena 01.
 *
 * ## Nenhum dado real
 *
 * Os valores sao inventados e genericos de proposito, e nenhum deles repete um
 * numero que o filme reivindica, para que ninguem confunda cenario de tela com
 * resultado. A cena 01 carrega a legenda "tela recriada, dados ilustrativos"
 * por escrito, porque juri tira print.
 *
 * A fonte e a sans do sistema, nao a Sora: aqui a tela precisa parecer o
 * produto do cliente, nao a marca.
 */

export const dash = {
  cartao: "#FFFFFF",
  linha: "#E6E9EF",
  tinta: "#101218",
  apoio: "#7B8494",
  /** O acento do painel: cinza-azulado de interface, nunca o azul da marca. */
  acento: "#4A5364",
  barra: "#C9CFDA",
  barraViva: "#6E7787",
} as const;

export type Tile = { rotulo: string; valor: string; delta: string };

/** As barras do grafico, uma altura por semana. Ordem fixa, sem aleatorio. */
const BARRAS = [0.42, 0.58, 0.5, 0.71, 0.63, 0.82, 0.74, 0.9, 0.66, 0.79, 0.95, 0.68];

export const TILES: Tile[] = [
  { rotulo: "Investimento", valor: "R$ 128,4 mil", delta: "+4,1%" },
  { rotulo: "Receita", valor: "R$ 521,9 mil", delta: "+6,8%" },
  { rotulo: "ROAS", valor: "4,06x", delta: "+0,3" },
  { rotulo: "Sessões", valor: "94,2 mil", delta: "+2,2%" },
];

const LINHAS = [
  ["Prospecção · Meta", "R$ 41,2 mil", "3,2x"],
  ["Remarketing · Meta", "R$ 22,8 mil", "7,1x"],
  ["Search · Google", "R$ 38,6 mil", "4,4x"],
  ["Pmax · Google", "R$ 25,8 mil", "3,8x"],
];

/** Um cartao de metrica do painel. */
export const TileDash: React.FC<{ t: Tile; o: number; marcado?: boolean }> = ({
  t,
  o,
  marcado,
}) => (
  <div
    style={{
      flex: 1,
      border: `1px solid ${dash.linha}`,
      borderRadius: 12,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      opacity: o,
      transform: `translateY(${interpolate(o, [0, 1], [10, 0])}px)`,
    }}
  >
    <div style={{ fontFamily: UI, fontSize: 17, color: dash.apoio }}>{t.rotulo}</div>
    <div
      style={{
        fontFamily: UI,
        fontSize: 32,
        color: dash.tinta,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {t.valor}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 16, color: dash.acento }}>{t.delta}</div>
      {marcado ? (
        <svg width="15" height="15" viewBox="0 0 24 24">
          <path
            d="M5 13l4 4L19 7"
            stroke={dash.acento}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  </div>
);

/** O grafico de barras, desenhado da esquerda para a direita. */
export const GraficoDash: React.FC<{ desenha: number; altura?: number }> = ({
  desenha,
  altura = 180,
}) => (
  <div
    style={{
      height: altura,
      display: "flex",
      alignItems: "flex-end",
      gap: 12,
      borderBottom: `1px solid ${dash.linha}`,
      paddingBottom: 2,
    }}
  >
    {BARRAS.map((v, i) => {
      // cada barra espera a anterior: o grafico se desenha, nao aparece
      const p = interpolate(desenha, [i / BARRAS.length, (i + 1.6) / BARRAS.length], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return (
        <div
          key={i}
          style={{
            flex: 1,
            height: (altura - 6) * v * p,
            borderRadius: 4,
            background: i >= BARRAS.length - 3 ? dash.barraViva : dash.barra,
          }}
        />
      );
    })}
  </div>
);

/** A tabela de campanhas, uma linha por vez. */
export const TabelaDash: React.FC<{ preenche: number }> = ({ preenche }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <div
      style={{
        display: "flex",
        fontFamily: UI,
        fontSize: 15,
        color: dash.apoio,
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        paddingBottom: 10,
        borderBottom: `1px solid ${dash.linha}`,
      }}
    >
      <div style={{ flex: 3 }}>Campanha</div>
      <div style={{ flex: 1, textAlign: "right" }}>Investimento</div>
      <div style={{ flex: 1, textAlign: "right" }}>ROAS</div>
    </div>
    {LINHAS.map((l, i) => {
      const p = interpolate(preenche, [i / LINHAS.length, (i + 1) / LINHAS.length], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return (
        <div
          key={l[0]}
          style={{
            display: "flex",
            fontFamily: UI,
            fontSize: 20,
            color: dash.tinta,
            padding: "13px 0",
            borderBottom: `1px solid ${dash.linha}`,
            opacity: p,
          }}
        >
          <div style={{ flex: 3 }}>{l[0]}</div>
          <div style={{ flex: 1, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {l[1]}
          </div>
          <div style={{ flex: 1, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {l[2]}
          </div>
        </div>
      );
    })}
  </div>
);

/** O cabecalho do painel, com a pilula de atualizacao. */
export const CabecalhoDash: React.FC<{ aceso?: number }> = ({ aceso = 0 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontFamily: UI, fontSize: 26, color: dash.tinta }}>Visão geral</div>
      <div style={{ fontFamily: UI, fontSize: 17, color: dash.apoio }}>
        1 a 18 de setembro
      </div>
    </div>
    <div
      style={{
        fontFamily: UI,
        fontSize: 16,
        color: aceso > 0.5 ? dash.tinta : dash.apoio,
        border: `1px solid ${aceso > 0.5 ? dash.acento : dash.linha}`,
        borderRadius: 999,
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: dash.acento,
          opacity: 0.35 + aceso * 0.65,
        }}
      />
      atualizado há 2 min
    </div>
  </div>
);

/** A moldura branca onde tudo isso vive. */
export const MolduraDash: React.FC<{
  children: React.ReactNode;
  largura?: number;
  padding?: number;
}> = ({ children, largura = 1440, padding = 40 }) => (
  <div
    style={{
      width: largura,
      background: dash.cartao,
      border: `1px solid ${dash.linha}`,
      borderRadius: marca.raio.painel,
      boxShadow: marca.sombra.painel,
      padding,
      display: "flex",
      flexDirection: "column",
      gap: 28,
    }}
  >
    {children}
  </div>
);

/** O ponteiro do mouse, em SVG: o render headless nao tem cursor. */
export const Cursor: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <svg
    width="30"
    height="38"
    viewBox="0 0 24 30"
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity: o,
      filter: "drop-shadow(0 4px 10px rgba(16,18,24,0.35))",
    }}
  >
    <path d="M3 2l16 12-7 1 4 8-3 1.5-4-8-6 5z" fill="#FFFFFF" stroke="#101218" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
