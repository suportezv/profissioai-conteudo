import React from "react";
import { marca } from "../marca";

/**
 * Um QR code recriado, desenhado em SVG.
 *
 * ## Por que recriado e não o de verdade
 *
 * O QR de fábrica da Polishop ainda não chegou, e mesmo quando chegar **um QR
 * funcional dentro de um filme é um convite a apontar o celular para a tela**,
 * que é a última coisa que se quer de quem está assistindo a um case. Aqui ele
 * é um **sinal gráfico** que diz "isto é um QR", não um código legível.
 *
 * O desenho é determinístico: os módulos saem de um gerador congruente com
 * semente fixa, então o mesmo QR sai igual em todo frame e em todo render.
 * Sorteio por `Math.random()` faria o padrão **tremer a cada quadro**, que é um
 * defeito clássico de motion e só aparece em movimento.
 *
 * Os três quadrados de canto são o que o olho usa para reconhecer um QR, então
 * eles são desenhados à parte e nunca sorteados.
 */

const MODULOS = 21;

/**
 * As coordenadas do QR e do painel que fica atrás dele, **compartilhadas pelas
 * cenas 02 e 03**.
 *
 * O argumento da virada é que a porta não se mexeu e o motor foi trocado, e
 * isso só se lê se o QR estiver **exatamente no mesmo pixel** nas duas cenas.
 * Se cada cena guardasse a própria posição, elas divergiriam na primeira
 * revisão e o corte viraria um salto.
 *
 * `QR_L`/`QR_T`/`QR_TAM` são o **cartão plano**, que só existe na cena 02 e só
 * até o código ser colado no aparelho. A partir dali a porta é o adesivo na
 * tampa, cuja posição sai de `afimNaTampa` no `Airfryer.tsx`, e é essa que
 * atravessa o corte para a cena 03.
 *
 * `FIO_Y` é a altura do fio que liga a porta ao motor. Ela sai da altura do
 * centro do adesivo na tampa, não de um número escolhido: fio que não sai de
 * onde o elemento está lê como enfeite.
 */
export const QR_L = 168;
export const QR_T = 348;
export const QR_TAM = 200;
export const MOTOR_L = 760;
export const MOTOR_T = 236;
export const MOTOR_W = 900;
export const FIO_Y = 593;
export const FIO_L = 490;
/**
 * A altura em que o fio encosta no motor, que é o centro do painel.
 *
 * O fio sai do adesivo (593) e sobe até aqui (481), porque as duas pontas têm
 * donos diferentes: a de baixo é a tampa do aparelho e a de cima é o meio do
 * retângulo que troca de conteúdo na cena 03. Forçar o fio a ser horizontal
 * obrigaria uma das duas a mentir sobre onde está.
 */
export const SOQUETE_Y = 481;

/** Congruente linear, para o padrão ser o mesmo em todo frame. */
const trama = (semente: number) => {
  let s = semente;
  const prox = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const celulas: boolean[][] = [];
  for (let y = 0; y < MODULOS; y++) {
    celulas.push([]);
    for (let x = 0; x < MODULOS; x++) celulas[y].push(prox() > 0.48);
  }
  return celulas;
};

const CELULAS = trama(20251007);

/** Os cantos que o olho reconhece. Nunca sorteados. */
const noCanto = (x: number, y: number) =>
  (x < 7 && y < 7) || (x > MODULOS - 8 && y < 7) || (x < 7 && y > MODULOS - 8);

export const QR: React.FC<{
  tamanho?: number;
  cor?: string;
  fundo?: string;
  /** 0 a 1: quanto do padrão já se desenhou, de cima para baixo. */
  revela?: number;
}> = ({ tamanho = 220, cor = marca.tinta, fundo = marca.branco, revela = 1 }) => {
  const p = tamanho / MODULOS;
  const ate = revela * MODULOS;

  const canto = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`}>
      <rect x={cx * p} y={cy * p} width={7 * p} height={7 * p} fill={cor} />
      <rect x={(cx + 1) * p} y={(cy + 1) * p} width={5 * p} height={5 * p} fill={fundo} />
      <rect x={(cx + 2) * p} y={(cy + 2) * p} width={3 * p} height={3 * p} fill={cor} />
    </g>
  );

  return (
    <svg width={tamanho} height={tamanho} style={{ display: "block" }}>
      <rect width={tamanho} height={tamanho} fill={fundo} />
      {CELULAS.map((linha, y) =>
        y < ate
          ? linha.map((ligado, x) =>
              ligado && !noCanto(x, y) ? (
                <rect
                  key={`${x}-${y}`}
                  x={x * p}
                  y={y * p}
                  width={p}
                  height={p}
                  fill={cor}
                />
              ) : null,
            )
          : null,
      )}
      {revela > 0.34 ? canto(0, 0) : null}
      {revela > 0.34 ? canto(MODULOS - 7, 0) : null}
      {revela > 0.9 ? canto(0, MODULOS - 7) : null}
    </svg>
  );
};
