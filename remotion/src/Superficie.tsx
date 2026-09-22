import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { modos, type Modo } from "./marca";

/**
 * Fundo da marca: superficie chapada com os halos do site derivando por cima.
 *
 * ## De onde sai cada numero
 *
 * Tudo aqui foi lido do `styles.css` do profissio.ai, nao inventado. O site tem
 * um `.bg-fx::before` com **tres halos radiais** ancorados perto das bordas
 * (`92% 8%`, `5% 28%`, `50% 110%`, ou seja alto-direita, esquerda e por baixo do
 * rodape) e um `@keyframes bg-fx-drift` que os passeia por poucos pontos
 * percentuais em **32 s, ease-in-out, infinito**. E esse o movimento discreto
 * girando pelas bordas: nao e um efeito novo, e o fundo da marca em repouso.
 *
 * As cores sao as unicas coisas trocadas, e por regra: o site ainda carrega
 * **violeta, que a revisao 3 aposentou**. No lugar dele entra o azul `#2458F5`,
 * que e o acento atual. O rosa `#BE3F84` fica porque continua na paleta como
 * secundaria, e o ciano `#57E3F2` substitui o "quantum" do site.
 *
 * ## O que saiu
 *
 * A grade de 56px foi removida a pedido. Ela existe no site, mas ali e textura
 * de pagina vista de perto; em movimento e depois da compressao ela virava
 * xadrez sujo em vez de preenchimento.
 *
 * A vinheta nao vem do site: e daqui, e serve a profundidade. Escurecer as
 * bordas empurra o fundo para tras e faz o primeiro plano descolar, que e o que
 * uma peca em movimento precisa e uma pagina parada nao.
 */

type Halo = {
  /** Tamanho do halo, em porcentagem do quadro. */
  w: number;
  h: number;
  cor: string;
  /** Os quatro pontos da deriva, em porcentagem: x,y. Iguais aos do site. */
  passos: [number, number][];
};

const HALOS: Record<Modo, Halo[]> = {
  claro: [
    {
      w: 62,
      h: 58,
      cor: "rgba(36,88,245,0.20)",
      passos: [[92, 8], [84, 18], [96, 14], [88, 4]],
    },
    {
      w: 55,
      h: 54,
      cor: "rgba(36,88,245,0.13)",
      passos: [[5, 28], [14, 22], [8, 36], [2, 30]],
    },
    {
      w: 78,
      h: 62,
      cor: "rgba(87,227,242,0.11)",
      passos: [[50, 110], [56, 104], [44, 116], [52, 108]],
    },
    {
      w: 44,
      h: 44,
      cor: "rgba(190,63,132,0.07)",
      passos: [[18, 92], [26, 86], [12, 96], [22, 90]],
    },
  ],
  escuro: [
    {
      w: 62,
      h: 58,
      cor: "rgba(36,88,245,0.40)",
      passos: [[92, 8], [84, 18], [96, 14], [88, 4]],
    },
    {
      w: 55,
      h: 54,
      cor: "rgba(36,88,245,0.24)",
      passos: [[5, 28], [14, 22], [8, 36], [2, 30]],
    },
    {
      w: 78,
      h: 62,
      cor: "rgba(87,227,242,0.16)",
      passos: [[50, 110], [56, 104], [44, 116], [52, 108]],
    },
  ],
  azul: [
    {
      w: 62,
      h: 58,
      cor: "rgba(255,255,255,0.16)",
      passos: [[92, 8], [84, 18], [96, 14], [88, 4]],
    },
    {
      w: 78,
      h: 62,
      cor: "rgba(16,18,24,0.14)",
      passos: [[50, 110], [56, 104], [44, 116], [52, 108]],
    },
  ],
};

/** 32 s, como no site. A 30 fps, 960 frames por volta. */
const CICLO = 960;

/**
 * Posicao do halo no frame `f`, percorrendo os quatro passos e voltando ao
 * primeiro. O ciclo fecha em si mesmo, entao o fundo nunca da um salto, e em
 * 32 s de volta ninguem percebe a repeticao num filme de dois minutos.
 */
const derivaEm = (passos: [number, number][], f: number) => {
  const t = (f % CICLO) / CICLO;
  const n = passos.length;
  const pos = t * n;
  const i = Math.floor(pos) % n;
  const j = (i + 1) % n;
  const p = pos - Math.floor(pos);
  // ease-in-out entre os passos, como o `ease-in-out` do keyframes
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  return [
    interpolate(e, [0, 1], [passos[i][0], passos[j][0]]),
    interpolate(e, [0, 1], [passos[i][1], passos[j][1]]),
  ];
};

export const Superficie: React.FC<{
  modo?: Modo;
  /** Liga os halos derivando. Desligado atras de imagem filmada. */
  halo?: boolean;
  /** Escurece as bordas, para o primeiro plano descolar do fundo. */
  vinheta?: boolean;
  /** Nome antigo de `halo`, mantido para as cenas que ja chamavam assim. */
  grade?: boolean;
}> = ({ modo = "escuro", halo = false, vinheta = true, grade = false }) => {
  const f = useCurrentFrame();
  const m = modos[modo];
  const ligado = halo || grade;

  return (
    <AbsoluteFill style={{ backgroundColor: m.fundo }}>
      {ligado
        ? HALOS[modo].map((h, i) => {
            const [x, y] = derivaEm(h.passos, f + i * 70);
            return (
              <AbsoluteFill
                key={i}
                style={{
                  background: `radial-gradient(${h.w}% ${h.h}% at ${x}% ${y}%, ${h.cor}, transparent 66%)`,
                }}
              />
            );
          })
        : null}

      {ligado && vinheta ? (
        <AbsoluteFill
          style={{
            background:
              modo === "claro"
                ? "radial-gradient(120% 100% at 50% 45%, transparent 52%, rgba(16,18,24,0.10) 100%)"
                : "radial-gradient(120% 100% at 50% 45%, transparent 52%, rgba(0,0,0,0.28) 100%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
