/**
 * Paleta e fonte da UI do WhatsApp em tema escuro, recriada.
 *
 * Fica separada porque duas cenas do case desenham a mesma tela: a 01, com a
 * mensagem que fica sem resposta, e a 07, com a resposta chegando. Se cada uma
 * guardasse os proprios hexes elas iam divergir na primeira revisao, e o filme
 * inteiro depende de o espectador reconhecer que e a **mesma** conversa.
 *
 * Nenhuma tela real de usuario entra na peca. Tudo aqui e recriacao.
 */
export const wa = {
  fundoChat: "#0B141A",
  barra: "#1F2C33",
  balaoSaida: "#005C4B",
  balaoEntrada: "#1F2C33",
  teclado: "#1B2429",
  tecla: "#2A3942",
  texto: "#E9EDEF",
  apoio: "#8696A0",
  verde: "#00A884",
  /** O azul do check de lido. E do WhatsApp, nao da Profissio: nao trocar. */
  lido: "#53BDEB",
} as const;

/** A sans do sistema, nao a Sora: aqui a tela precisa parecer o app, nao a marca. */
export const UI = '"Liberation Sans", Arial, Helvetica, sans-serif';
