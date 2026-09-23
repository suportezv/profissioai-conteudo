import React from "react";
import { Img, staticFile } from "remotion";

/**
 * O aparelho, e a geometria da tampa dele.
 *
 * ## Por que existe um arquivo só para isto
 *
 * Três cenas põem alguma coisa **em cima** do aparelho: a 02 cola o QR na
 * tampa, a 03 mantém ele lá enquanto o motor atrás é trocado, e a 09 funde os
 * dois. Se cada cena medisse a tampa por conta própria, o adesivo pularia de
 * lugar no corte, que é exatamente o defeito que a cena 03 existe para não
 * ter: **a porta não se mexe, o motor é que muda**.
 *
 * ## A tampa é um paralelogramo, e isso não é aproximação
 *
 * A foto é de catálogo, com a câmera longe e lente média, então a projeção da
 * tampa é praticamente afim: medindo os quatro cantos no arquivo de 657x910,
 * `A→B` deu (230,-128) e `D→C` deu (225,-127); `A→D` deu (330,65) e `B→C` deu
 * (325,66). Os pares batem em dois pixels, então um `matrix` 2D basta e não é
 * preciso `matrix3d` com perspectiva.
 *
 * Cantos medidos (canto A à esquerda, B ao fundo, C à direita, D à frente):
 * A (50,140) · B (280,12) · C (605,78) · D (380,205).
 *
 * ## A orientação do rótulo sai do aparelho, não do quadro
 *
 * Quem lê uma etiqueta na tampa está **em pé na frente do aparelho**, e a
 * frente aqui é a aresta D–C, que é onde está o painel de controle. Então o
 * eixo horizontal do rótulo é `D→C` e o vertical é `A→D`, nessa ordem, que é
 * também a única das combinações com determinante positivo: invertida, a
 * etiqueta sairia espelhada e o QR viraria a imagem no espelho de um QR.
 */

/** Proporção do arquivo: 657 x 910. */
export const AF_RAZAO = 910 / 657;

/**
 * Onde o aparelho fica no quadro nas cenas 02 e 03.
 *
 * Mora aqui pelo mesmo motivo que as coordenadas do QR moram no `QR.tsx`: o
 * corte entre as duas cenas só lê como continuidade se o aparelho e o adesivo
 * estiverem no mesmo pixel dos dois lados.
 */
export const AF_L = 150;
export const AF_T = 540;
export const AF_W = 320;

const LARG_FONTE = 657;
const CANTO = {
  A: [50, 140],
  B: [280, 12],
  C: [605, 78],
  D: [380, 205],
} as const;

/** Uma matriz afim 2D de CSS, na ordem que o `matrix()` pede. */
export type Afim = [number, number, number, number, number, number];

/** A identidade deslocada: o elemento plano, em (x, y), sem nenhuma distorção. */
export const afimPlana = (x: number, y: number): Afim => [1, 0, 0, 1, x, y];

/**
 * A matriz que deita um elemento quadrado de `tam` px na tampa do aparelho.
 *
 * `inset` é a fatia central da tampa que o elemento ocupa: 0,64 deixa 18% de
 * folga de cada lado, que é o quanto uma etiqueta de fábrica costuma respeitar
 * da borda do plástico.
 */
export const afimNaTampa = (
  tam: number,
  afL: number,
  afT: number,
  afW: number,
  inset = 0.64,
): Afim => {
  const k = afW / LARG_FONTE;
  const p = (c: readonly [number, number] | number[]) =>
    [afL + c[0] * k, afT + c[1] * k] as [number, number];
  const A = p(CANTO.A);
  const B = p(CANTO.B);
  const D = p(CANTO.D);
  // eixo horizontal do rotulo: paralelo a frente do aparelho (A->B == D->C)
  const u = [B[0] - A[0], B[1] - A[1]];
  // eixo vertical: fugindo da frente para o fundo (A->D == B->C)
  const v = [D[0] - A[0], D[1] - A[1]];
  const folga = (1 - inset) / 2;
  const ox = A[0] + folga * (u[0] + v[0]);
  const oy = A[1] + folga * (u[1] + v[1]);
  return [
    (u[0] * inset) / tam,
    (u[1] * inset) / tam,
    (v[0] * inset) / tam,
    (v[1] * inset) / tam,
    ox,
    oy,
  ];
};

/** Interpola duas matrizes afins componente a componente. */
export const afimEntre = (a: Afim, b: Afim, t: number): Afim =>
  a.map((v, i) => v + (b[i] - v) * t) as Afim;

export const css = (m: Afim) =>
  `matrix(${m.map((v) => v.toFixed(4)).join(", ")})`;

/**
 * O aparelho. Fundo já recortado no arquivo, então ele pousa em qualquer
 * superfície sem cartão branco em volta.
 */
export const Airfryer: React.FC<{
  esq: number;
  topo: number;
  larg: number;
  o?: number;
  sobe?: number;
}> = ({ esq, topo, larg, o = 1, sobe = 0 }) => (
  <Img
    src={staticFile("marca-polishop/airfryer.png")}
    style={{
      position: "absolute",
      left: esq,
      top: topo,
      width: larg,
      height: larg * AF_RAZAO,
      opacity: o,
      transform: `translateY(${sobe}px)`,
      filter: "drop-shadow(0 26px 46px rgba(16,18,24,0.20))",
    }}
  />
);
