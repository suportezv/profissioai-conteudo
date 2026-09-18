/**
 * Tokens da Profissio.ai, revisao 3 (17/09/2026).
 *
 * Fonte da verdade: 05_Diretrizes/profissio-tokens.json do kit de marca no
 * Drive. Os valores abaixo sao copia literal daquele arquivo, mais os apoios
 * que so aparecem nas pecas sociais de referencia (04_Social) e que o
 * tokens.json nao lista.
 *
 * A identidade anterior (acento rosa #E255A0, fundos aurora rosa/violeta) foi
 * APOSENTADA nesta revisao. Nao reintroduzir.
 */
export const marca = {
  // --- tokens oficiais (profissio-tokens.json) ---
  tinta: "#101218",
  branco: "#FFFFFF",
  superficie: "#F4F6F9",
  linha: "#DFE3EB",
  apoio: "#59616E",
  azul: "#2458F5",
  ciano: "#57E3F2",
  rosa: "#BE3F84",

  // --- apoios medidos nas pecas de referencia ---
  /** Texto de apoio sobre o fundo escuro. */
  apoioEscuro: "#AAB3C4",
  /** Texto de apoio sobre o fundo azul. */
  apoioAzul: "#E1E9FF",
  /** Numeracao e marcadores sobre o fundo azul. */
  numeroAzul: "#C5D5FF",

  fonte: '"Sora", Arial, sans-serif',

  /**
   * Tracking da marca: -3,5% do corpo, em qualquer tamanho.
   * Derivado das pecas oficiais (92px -> -3.22, 29px -> -1.015, 17px -> -0.595).
   */
  tracking: "-0.035em",

  /** Escala de espacamento oficial. */
  espaco: [4, 8, 12, 16, 24, 32, 48, 64, 96],

  /** Raios oficiais. */
  raio: { controle: 8, painel: 20, arte: 32 },
} as const;

/** Os tres modos de superficie da marca, cada um com sua tinta e seu apoio. */
export const modos = {
  escuro: { fundo: marca.tinta, tinta: marca.branco, apoio: marca.apoioEscuro },
  claro: { fundo: marca.superficie, tinta: marca.tinta, apoio: marca.apoio },
  azul: { fundo: marca.azul, tinta: marca.branco, apoio: marca.apoioAzul },
} as const;

export type Modo = keyof typeof modos;
