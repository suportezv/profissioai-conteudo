import React from "react";
import { marca } from "../marca";
import { AF_L, AF_T, AF_W, alturaDoCodigo } from "./Airfryer";

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
 *
 * ## O que foi corrigido em 23/set/2026, quando o usuário chamou o código de
 * "grosseiro"
 *
 * Ruído puro entre três cantos não lê como código, lê como textura. O que um
 * QR de verdade tem além dos cantos, e que agora está aqui:
 *
 * - **As linhas de tempo**, a fileira e a coluna que alternam cheio e vazio
 *   ligando um canto ao outro. São o que dá ritmo ao desenho e o que mais
 *   separa "um QR" de "um quadrado sujo".
 * - **O alinhamento**, o quadradinho concêntrico perto do canto inferior
 *   direito, que é o elemento que falta em toda imitação feita às pressas.
 * - **A calha branca de um módulo** em volta de cada canto. Sem ela o ruído
 *   encosta no quadrado e come a forma que o olho procura.
 * - **Vinte e cinco módulos em vez de vinte e um**, o que deixa o grão mais
 *   fino e mais perto de um código com conteúdo de verdade.
 */

const MODULOS = 25;

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
export const FIO_Y = 543;
export const FIO_L = 540;
/**
 * A altura em que o fio encosta no motor, que é o centro do painel.
 *
 * O fio sai do adesivo (593) e sobe até aqui (481), porque as duas pontas têm
 * donos diferentes: a de baixo é a tampa do aparelho e a de cima é o meio do
 * retângulo que troca de conteúdo na cena 03. Forçar o fio a ser horizontal
 * obrigaria uma das duas a mentir sobre onde está.
 */
export const SOQUETE_Y = 481;

/**
 * A geometria da porta e do motor, nos dois quadros.
 *
 * No 16:9 ela e literalmente as constantes acima, sem nenhum numero novo: a
 * versao horizontal e final e nao pode andar um pixel. No 9:16 a cena deixa
 * de ser "porta a esquerda, motor a direita" e vira **empilhada**:
 *
 * - o cabecalho no alto da faixa segura, como antes;
 * - o motor no meio, na largura util inteira (72 a 1008);
 * - o aparelho embaixo, a direita, com o codigo na tampa (imagem pode
 *   encostar na coluna de botoes do app; texto nao);
 * - e o fio **sobe** do codigo ate o centro do painel, que e onde o soquete
 *   fica quando o motor antigo e desmontado. O painel e desenhado por cima do
 *   fio, entao enquanto ele existe so se ve o trecho entre o painel e a tampa,
 *   e quando ele se fecha o fio inteiro aparece chegando no soquete: a porta
 *   continua ligada ao lugar do motor, que e o argumento da cena 03.
 *
 * A esquerda do aparelho sobra uma coluna (72 a ~560) que recebe a curva do
 * engajamento na cena 02 e os tres "sem" na cena 03, em corpo 40. Ela fica
 * a esquerda de proposito: a direita, na metade de baixo, e a coluna de
 * botoes do app, e "sem aprender aplicativo" em corpo 40 nao caberia ali.
 *
 * O fio sai do topo do codigo e nao do centro, porque o codigo e desenhado por
 * cima e o fio que some atras da etiqueta lia como risco solto.
 */
export type GeoPorta = {
  qrL: number;
  qrT: number;
  qrTam: number;
  motorL: number;
  motorT: number;
  motorW: number;
  soqueteY: number;
  /** Altura do painel antigo: o soquete e o centro dele. */
  painelAlt: number;
  zapAlt: number;
  /** As duas pontas do fio: a da porta e a do soquete. */
  fioA: [number, number];
  fioB: [number, number];
  afL: number;
  afT: number;
  afW: number;
};

const GEO_H: GeoPorta = {
  qrL: QR_L,
  qrT: QR_T,
  qrTam: QR_TAM,
  motorL: MOTOR_L,
  motorT: MOTOR_T,
  motorW: MOTOR_W,
  soqueteY: SOQUETE_Y,
  painelAlt: SOQUETE_Y - MOTOR_T + 245,
  zapAlt: 356,
  fioA: [FIO_L, FIO_Y],
  fioB: [MOTOR_L, SOQUETE_Y],
  afL: AF_L,
  afT: AF_T,
  afW: AF_W,
};

const AF_L_V = 568;
const AF_T_V = 1200;
const AF_W_V = 440;
const MOTOR_T_V = 500;
const PAINEL_ALT_V = 660;
const SOQUETE_Y_V = MOTOR_T_V + PAINEL_ALT_V / 2;
/** Centro do codigo na tampa, e o topo dele (a etiqueta achatada tem ~36 px). */
const CODIGO_X_V = AF_L_V + AF_W_V * (233 / 449);
const CODIGO_TOPO_V = alturaDoCodigo(AF_T_V, AF_W_V) - 20;
const QR_TAM_V = 260;

const GEO_V: GeoPorta = {
  qrL: Math.round(CODIGO_X_V - QR_TAM_V / 2),
  qrT: 760,
  qrTam: QR_TAM_V,
  motorL: 72,
  motorT: MOTOR_T_V,
  motorW: 936,
  soqueteY: SOQUETE_Y_V,
  painelAlt: PAINEL_ALT_V,
  zapAlt: 520,
  fioA: [CODIGO_X_V, CODIGO_TOPO_V],
  fioB: [CODIGO_X_V, SOQUETE_Y_V],
  afL: AF_L_V,
  afT: AF_T_V,
  afW: AF_W_V,
};

export const geoPorta = (vertical: boolean): GeoPorta => (vertical ? GEO_V : GEO_H);

/**
 * Os tamanhos do painel de 2023 (a pagina com menu numerado), que as cenas 02
 * e 03 desenham cada uma: o corte entre elas passa com o painel parado, entao
 * os dois lados tem que ler os mesmos numeros. No 16:9 sao os de sempre.
 */
export const menuTam = (vertical: boolean) =>
  vertical
    ? {
        barra: "18px 26px",
        ponto: 16,
        url: 26,
        urlPad: "9px 18px",
        pad: 38,
        gap: 16,
        titulo: 36,
        item: 36,
        itemPad: "17px 24px",
        itemRaio: 12,
        campo: 34,
      }
    : {
        barra: "14px 20px",
        ponto: 12,
        url: 16,
        urlPad: "7px 14px",
        pad: 30,
        gap: 14,
        titulo: 21,
        item: 21,
        itemPad: "14px 18px",
        itemRaio: 10,
        campo: 20,
      };

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

/**
 * O que é estrutura e não pode ser sorteado: os três cantos com a calha de um
 * módulo em volta, as duas linhas de tempo e o quadrado de alinhamento.
 */
const ALINHA = MODULOS - 9;

const noCanto = (x: number, y: number) =>
  (x < 8 && y < 8) || (x > MODULOS - 9 && y < 8) || (x < 8 && y > MODULOS - 9);

const naLinhaDeTempo = (x: number, y: number) => x === 6 || y === 6;

const noAlinhamento = (x: number, y: number) =>
  x >= ALINHA - 2 && x <= ALINHA + 2 && y >= ALINHA - 2 && y <= ALINHA + 2;

const estrutural = (x: number, y: number) =>
  noCanto(x, y) || naLinhaDeTempo(x, y) || noAlinhamento(x, y);

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

  // as duas linhas de tempo: alternam cheio e vazio de canto a canto
  const tempo: React.ReactNode[] = [];
  for (let i = 8; i < MODULOS - 8; i++) {
    if (i % 2 === 0) {
      tempo.push(
        <rect key={`tx${i}`} x={i * p} y={6 * p} width={p} height={p} fill={cor} />,
        <rect key={`ty${i}`} x={6 * p} y={i * p} width={p} height={p} fill={cor} />,
      );
    }
  }

  return (
    <svg width={tamanho} height={tamanho} style={{ display: "block" }}>
      <rect width={tamanho} height={tamanho} fill={fundo} />
      {CELULAS.map((linha, y) =>
        y < ate
          ? linha.map((ligado, x) =>
              ligado && !estrutural(x, y) ? (
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
      {revela > 0.3 ? tempo : null}
      {revela > 0.34 ? canto(0, 0) : null}
      {revela > 0.34 ? canto(MODULOS - 7, 0) : null}
      {revela > 0.9 ? canto(0, MODULOS - 7) : null}
      {revela > 0.8 ? (
        <g>
          <rect x={(ALINHA - 2) * p} y={(ALINHA - 2) * p} width={5 * p} height={5 * p} fill={cor} />
          <rect x={(ALINHA - 1) * p} y={(ALINHA - 1) * p} width={3 * p} height={3 * p} fill={fundo} />
          <rect x={ALINHA * p} y={ALINHA * p} width={p} height={p} fill={cor} />
        </g>
      ) : null}
    </svg>
  );
};
