import React from "react";
import { Img, staticFile } from "remotion";

/**
 * O aparelho, e onde o código fica nele.
 *
 * ## A foto é a do produto, e ela mudou tudo
 *
 * Até 23/set/2026 aqui morava uma airfryer **gerada**, de três quartos e vista
 * de cima, e o código deitava na tampa por uma matriz afim medida nos quatro
 * cantos dela. O cliente mandou a foto de catálogo da **iChef**, e ela é de
 * frente: a tampa aparece como uma faixa rasa, não como um plano. A geometria
 * antiga não sobrevive à troca, e insistir nela é o que produzia as três
 * queixas do usuário sobre o código: **"grande, torto e grosseiro"**.
 *
 * - **Torto** era o cisalhamento. Numa foto frontal não existe eixo inclinado
 *   para acompanhar, então qualquer inclinação vira lettering torto. O pouso
 *   agora é **só um achatamento vertical**, sem rotação e sem cisalhamento.
 * - **Grande** era o tamanho herdado da tampa vista de cima, que ocupava meia
 *   superfície. Aqui o código vale 30% da largura do aparelho, que é a
 *   proporção de uma etiqueta de fábrica de verdade.
 * - **Grosseiro** era o desenho do QR, resolvido no `QR.tsx`.
 *
 * ## A foto já tem o código, e é nele que o nosso pousa
 *
 * O produto sai de fábrica com o QR impresso no topo, e a foto mostra isso com
 * um feixe azul saindo dele. **O código recriado pousa exatamente naquele
 * ponto**, então o feixe da própria foto passa a sair dele: a peça não precisa
 * inventar um brilho, e a leitura "este código está vivo" vem do produto.
 *
 * Medido no arquivo de 449x542 (recorte do original de 660x660 em 97,72): o
 * emissor fica centrado em (233, 55), e a tampa naquela altura tem 278 px de
 * largura útil.
 */

/** Proporção do arquivo: 449 x 542. */
export const AF_RAZAO = 542 / 449;

/**
 * Onde o aparelho fica no quadro nas cenas 02 e 03.
 *
 * Mora aqui pelo mesmo motivo que as coordenadas do QR moram no `QR.tsx`: o
 * corte entre as duas cenas só lê como continuidade se o aparelho e o código
 * estiverem no mesmo pixel dos dois lados.
 */
export const AF_L = 160;
export const AF_T = 500;
export const AF_W = 360;

/** Centro do emissor e largura da etiqueta, em fração do arquivo. */
const CODIGO_CX = 233 / 449;
const CODIGO_CY = 56 / 542;
/** 25% da largura do aparelho: a proporção de uma etiqueta de fábrica. */
const CODIGO_LARG = 0.25;
/** Achatamento da tampa nesta foto. Medido no emissor: 15 px de altura por 46 de largura. */
const CODIGO_ACHATA = 0.34;

/** Uma matriz afim 2D de CSS, na ordem que o `matrix()` pede. */
export type Afim = [number, number, number, number, number, number];

/** A identidade deslocada: o elemento plano, em (x, y), sem nenhuma distorção. */
export const afimPlana = (x: number, y: number): Afim => [1, 0, 0, 1, x, y];

/**
 * A matriz que pousa um elemento quadrado de `tam` px no topo do aparelho.
 *
 * Sem rotação e sem cisalhamento **de propósito**: a foto é frontal, então não
 * há eixo oblíquo a seguir e qualquer inclinação leria como erro de lettering.
 * O que diz "isto está deitado" é o achatamento vertical, que é o que a
 * própria foto mostra no emissor impresso.
 */
export const afimNaTampa = (
  tam: number,
  afL: number,
  afT: number,
  afW: number,
): Afim => {
  const larg = afW * CODIGO_LARG;
  const alt = larg * CODIGO_ACHATA;
  const cx = afL + afW * CODIGO_CX;
  const cy = afT + afW * AF_RAZAO * CODIGO_CY;
  return [larg / tam, 0, 0, alt / tam, cx - larg / 2, cy - alt / 2];
};

/** A altura, no quadro, em que o código pousa. É de onde o fio tem que sair. */
export const alturaDoCodigo = (afT: number, afW: number) =>
  afT + afW * AF_RAZAO * CODIGO_CY;

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
