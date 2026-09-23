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

  /**
   * Elevacao, lida das sombras do styles.css do site.
   *
   * O site nao tem token de sombra, mas tem um padrao claro e repetido:
   * sombra **longa, muito suave e deslocada para baixo** (`0 30px 80px`,
   * `0 20px 60px`, `0 12px 40px rgba(20,14,32,.18)`), uma variante **tingida
   * na cor de acento** (`0 30px 80px -20px rgba(190,63,132,0.55)`) e um
   * **filete interno de 1px na base** do painel (`inset 0 -1px 0`).
   *
   * Em peca parada a sombra e acabamento; **em movimento ela e o que separa o
   * primeiro plano do fundo**, e por isso aqui ela e mais aberta que a do
   * site, que nunca precisa competir com um halo andando por tras.
   */
  sombra: {
    /** Cartao sobre a superficie clara. */
    painel:
      "0 28px 70px -20px rgba(16,18,24,0.26), 0 6px 18px -8px rgba(16,18,24,0.12), inset 0 -1px 0 rgba(16,18,24,0.07)",
    /** Elemento de acento: a sombra pega a cor dele, como no site. */
    azul:
      "0 28px 70px -20px rgba(36,88,245,0.55), 0 6px 18px -8px rgba(36,88,245,0.30)",
    /** Lettering solto sobre a superficie, sem caixa. */
    texto: "0 14px 40px rgba(16,18,24,0.10)",
  },
} as const;

/** Os tres modos de superficie da marca, cada um com sua tinta e seu apoio. */
export const modos = {
  escuro: { fundo: marca.tinta, tinta: marca.branco, apoio: marca.apoioEscuro },
  claro: { fundo: marca.superficie, tinta: marca.tinta, apoio: marca.apoio },
  azul: { fundo: marca.azul, tinta: marca.branco, apoio: marca.apoioAzul },
} as const;

export type Modo = keyof typeof modos;
