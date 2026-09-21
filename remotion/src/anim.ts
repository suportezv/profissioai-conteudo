import { Easing, interpolate } from "remotion";

/**
 * Helpers de animacao compartilhados pelas cenas do case.
 *
 * Existem para que toda cena use a mesma curva e o mesmo tempo de entrada: a
 * gramatica da marca e "elemento entra, segura dois a tres segundos, vira o
 * proximo", e isso so parece um filme so se a curva for a mesma em todo lugar.
 */

/** A curva da casa. Saida longa, sem bounce. */
export const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);

export const FPS = 30;

/** Segundos para frames, para o codigo falar em segundos como o roteiro. */
export const s = (segundos: number) => Math.round(segundos * FPS);

/** Rampa simples de 0 a 1 entre dois frames. */
export const passo = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

/**
 * Faixa de visibilidade: entra, segura, sai.
 *
 * O cuidado que obriga o if: com fade de saida zero, [ini, ini+ent, fim, fim]
 * nao e estritamente crescente e o `interpolate` do Remotion recusa com
 * "inputRange must be strictly monotonically increasing". Ja quebrou um render
 * inteiro por isso.
 */
export const janela = (
  f: number,
  ini: number,
  fim: number,
  ent = 12,
  sai = 12,
) => {
  const a = ini;
  const b = Math.min(ini + Math.max(ent, 1), fim - 1);
  if (sai <= 0) {
    return interpolate(f, [a, b, fim], [0, 1, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });
  }
  const c = Math.max(fim - sai, b + 1);
  return interpolate(f, [a, b, c, Math.max(fim, c + 1)], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
};

/** Entrada padrao da marca: sobe alguns pixels e desfoca de leve. */
export const entra = (o: number, desloca = 18) => ({
  opacity: o,
  transform: `translateY(${interpolate(o, [0, 1], [desloca, 0])}px)`,
  filter: `blur(${interpolate(o, [0, 1], [6, 0])}px)`,
});

/**
 * Contagem de numero que para no valor exato.
 *
 * `interpolate` com clamp nos dois lados garante que o ultimo frame mostre o
 * numero cheio: contador que para em 74,9% quando deveria dizer 75,7% e um
 * erro de dado na tela, nao um detalhe de animacao.
 */
export const conta = (f: number, ini: number, fim: number, alvo: number) =>
  interpolate(f, [ini, fim], [0, alvo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

/** Numero no formato brasileiro, com casas fixas. */
export const br = (n: number, casas = 0) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
