import React from "react";

/**
 * Icones de traco, desenhados na gramatica da marca.
 *
 * Regras que valem para todos: traco de 1,8 no viewBox de 24, pontas
 * arredondadas, sem preenchimento. A cor vem de fora (`cor`), entao o mesmo
 * icone serve apagado no que falhou e azul no que funcionou.
 *
 * **Nenhum icone imita identidade de terceiro.** O item "WhatsApp" usa um balao
 * generico, nao o logo: o `Uso_da_Marca.md` trata identidades de canais como
 * marcas de terceiros, e recriar uma a mao numa peca de premiacao e pior que
 * nao ter.
 */

type P = { cor: string; tam?: number };

const base = (tam: number) => ({
  width: tam,
  height: tam,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Aplicativo: um celular. */
export const IconeApp: React.FC<P> = ({ cor, tam = 34 }) => (
  <svg {...base(tam)} stroke={cor}>
    <rect x="6" y="2" width="12" height="20" rx="2.5" />
    <path d="M10.5 18.5h3" />
  </svg>
);

/** Catalogacao manual: fichas empilhadas com etiqueta. */
export const IconeFichas: React.FC<P> = ({ cor, tam = 34 }) => (
  <svg {...base(tam)} stroke={cor}>
    <rect x="3" y="6" width="14" height="12" rx="2" />
    <path d="M7 3h11a2 2 0 0 1 2 2v11" />
    <path d="M6.5 10.5h7M6.5 13.5h4.5" />
  </svg>
);

/** Dificuldade em escalar: degraus que param num muro. */
export const IconeTeto: React.FC<P> = ({ cor, tam = 34 }) => (
  <svg {...base(tam)} stroke={cor}>
    <path d="M3 20h4v-4h4v-4h4V8" />
    <path d="M14 4.5h7M17.5 4.5v4.5" />
    <path d="M16 12.5l3 3M19 12.5l-3 3" />
  </svg>
);

/** Canal de conversa: balao generico, nunca o logo de terceiro. */
export const IconeBalao: React.FC<P> = ({ cor, tam = 34 }) => (
  <svg {...base(tam)} stroke={cor}>
    <path d="M20.5 11.5a8 8 0 0 1-11.6 7.1L4 20l1.5-4.4A8 8 0 1 1 20.5 11.5z" />
  </svg>
);

/** IA treinada: faisca. */
export const IconeFaisca: React.FC<P> = ({ cor, tam = 34 }) => (
  <svg {...base(tam)} stroke={cor}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
  </svg>
);

/** Escala sem teto: curva subindo sem parar. */
export const IconeSubida: React.FC<P> = ({ cor, tam = 34 }) => (
  <svg {...base(tam)} stroke={cor}>
    <path d="M3 18c4 0 5.5-3 8-7.5S16.5 4 21 4" />
    <path d="M16.5 4H21v4.5" />
  </svg>
);
