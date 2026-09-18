/** Paleta e tokens da Profissio.ai, espelhando o CSS do site e o design system. */
export const marca = {
  rosaVivo: "#E255A0",
  rosa: "#BE3F84",
  rosaSuave: "#D86AA8",
  violeta: "#6B3CB8",
  ciano: "#3DBFF2",
  azulNeon: "#57E3F2",
  azulProfundo: "#2F4073",
  fundoEscuro: "#07060B",
  superficie: "#15101F",
  /** Base clara dos fundos aurora, medida nos PNGs da pasta de marca. */
  auroraBase: "#F2EFF7",
  tinta: "#15101F",
  /** Sora e a fonte do site; sem rede no render, cai para a sans do sistema. */
  fonte: '"Sora", "Inter Tight", system-ui, -apple-system, sans-serif',
} as const;
