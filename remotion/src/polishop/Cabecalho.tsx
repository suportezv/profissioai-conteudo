import React from "react";
import { Img, staticFile } from "remotion";
import { marca } from "../marca";
import { useFormato } from "../formato";

/**
 * O cabeçalho da coluna esquerda: marca, sobrelinha e ano.
 *
 * ## Por que ele é um componente, e não duas cópias
 *
 * As cenas 02 e 03 cortam uma na outra **com o cabeçalho no mesmo lugar**, e
 * esse é o ponto: a cena 03 abre no "2023" da anterior e rola o dígito. Só que
 * cada cena desenhava o bloco por conta própria, e as duas divergiram em
 * detalhes que ninguém vê lendo o código: a cena 02 deixava a sobrelinha com a
 * altura natural do texto e `marginTop: 8` no ano, a 03 punha a sobrelinha numa
 * caixa de 30 px e `marginTop: 2`. **A diferença é de poucos pixels e o corte a
 * entrega como um salto**, que foi exatamente o que o usuário viu.
 *
 * O mesmo vale na horizontal: a cena 02 escrevia `2023` como um texto só e a 03
 * como `202` mais uma coluna de odômetro. Mesmo com o mesmo `letter-spacing`,
 * quebrar a palavra em dois elementos **perde o kerning do par**. Por isso as
 * duas cenas usam o odômetro, e a 02 simplesmente o mantém parado no 3.
 *
 * Regra que sai daqui: **elemento que atravessa um corte de cena mora num
 * componente só.** Dois trechos de JSX parecidos envelhecem em direções
 * diferentes na primeira revisão.
 */

const CORPO = 84;

/**
 * O mesmo cabecalho no 9:16, maior e empurrado para dentro da faixa segura.
 *
 * Mora aqui dentro, e nao em cada cena, pelo motivo do topo deste arquivo: as
 * cenas 02 e 03 cortam uma na outra com o cabecalho no mesmo pixel, e isso
 * tem que continuar valendo no vertical. As duas cenas leem o formato daqui e
 * nenhuma delas guarda posicao propria.
 *
 * Corpo 100 com tracking -3,5% (-3,5 px), sobrelinha 28 em caixa alta, logo a
 * partir de y=228: o bloco termina em ~454 e o painel do motor comeca em 490.
 */
const CORPO_V = 100;
const L_V = 72;
const LOGO_TOPO_V = 228;
const TOPO_V = 318;

/**
 * O último dígito do ano rolando, como um odômetro.
 *
 * A coluna inteira existe sempre e o que muda é o deslocamento: animar o
 * conteúdo do texto faria o dígito **trocar**, e trocar não é rolar. O 4 no
 * meio não é enfeite, é o que prova que a coluna andou em vez de piscar.
 */
const Odometro: React.FC<{ p: number; corpo: number }> = ({ p, corpo }) => (
  <span
    style={{
      display: "inline-block",
      height: corpo,
      overflow: "hidden",
      verticalAlign: "top",
    }}
  >
    <span style={{ display: "block", transform: `translateY(${-p * 2 * corpo}px)` }}>
      {[3, 4, 5].map((d) => (
        <span key={d} style={{ display: "block", height: corpo, lineHeight: 1 }}>
          {d}
        </span>
      ))}
    </span>
  </span>
);

const Sobrelinha: React.FC<{
  texto: string;
  o: number;
  sobe?: boolean;
  corpo?: number;
}> = ({ texto, o, sobe, corpo = 24 }) => (
  <div
    style={{
      position: "absolute",
      fontSize: corpo,
      fontWeight: 500,
      letterSpacing: "2px",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      color: marca.azul,
      opacity: o,
      transform: sobe ? `translateY(${(1 - o) * 10}px)` : undefined,
    }}
  >
    {texto}
  </div>
);

export const CABECALHO_L = 120;
export const CABECALHO_TOPO = 200;

export const Cabecalho: React.FC<{
  /** 0 mostra 2023, 1 mostra 2025. */
  rola?: number;
  /** Opacidade da sobrelinha "A primeira tentativa". */
  velho?: number;
  /** Opacidade da sobrelinha "A virada". */
  novo?: number;
  /** Opacidade e deslocamento do bloco inteiro, para a entrada da cena 02. */
  estilo?: React.CSSProperties;
  logo?: React.CSSProperties;
}> = ({ rola = 0, velho = 1, novo = 0, estilo, logo }) => {
  const { vertical } = useFormato();
  const corpo = vertical ? CORPO_V : CORPO;
  const esq = vertical ? L_V : CABECALHO_L;
  const sobre = vertical ? 28 : 24;
  return (
    <>
      <Img
        src={staticFile("marca-polishop/polishop.png")}
        style={{
          position: "absolute",
          left: esq,
          top: vertical ? LOGO_TOPO_V : 100,
          width: vertical ? 230 : 210,
          ...logo,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: esq,
          top: vertical ? TOPO_V : CABECALHO_TOPO,
          ...estilo,
        }}
      >
        <div style={{ position: "relative", height: vertical ? 34 : 30 }}>
          <Sobrelinha texto="A primeira tentativa" o={velho} corpo={sobre} />
          <Sobrelinha texto="A virada" o={novo} sobe corpo={sobre} />
        </div>
        <div
          style={{
            marginTop: 2,
            fontSize: corpo,
            fontWeight: 500,
            letterSpacing: vertical ? "-3.5px" : "-2.94px",
            lineHeight: 1,
            display: "flex",
          }}
        >
          <span>202</span>
          <Odometro p={rola} corpo={corpo} />
        </div>
      </div>
    </>
  );
};
