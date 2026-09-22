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

/**
 * Os frames em que um contador cruza cada degrau do valor.
 *
 * Serve para sonorizar a contagem **derivando o som da mesma curva que move o
 * numero**, e nao de uma grade regular. O `conta` usa a curva SUAVE, que
 * dispara e desacelera; tique em intervalo constante por cima disso soa como
 * metronomo tocando junto de um numero que freia, e a divergencia se ouve.
 *
 * O metodo e amostrar a curva quadro a quadro e anotar quando ela passa de
 * `k/n`. Inverter a bezier daria o mesmo resultado com mais algebra e mais
 * chance de erro, e aqui a resolucao de um frame ja e mais fina que o ouvido.
 *
 * `intervalo` e o que torna isso audivel. A curva SUAVE chega perto de 90% no
 * primeiro terco, entao os degraus iniciais caem a **um por quadro**, e trinta
 * tiques por segundo nao soam como contagem, soam como zumbido. Com um
 * intervalo minimo de tres quadros a desaceleracao continua sendo ouvida
 * (3, 3, 4, 4 quadros) e cada tique continua sendo um evento.
 *
 * Os ultimos quadros ficam de fora porque ali entra o som de assentamento; dois
 * sons no mesmo quadro viram um so, mais sujo.
 */
export const tiquesDaContagem = (
  ini: number,
  fim: number,
  n = 20,
  intervalo = 3,
) => {
  const fora: number[] = [];
  const limite = fim - intervalo;
  let proximo = 1;
  for (let f = Math.ceil(ini); f <= Math.floor(fim) && proximo <= n; f++) {
    const p = interpolate(f, [ini, fim], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });
    while (proximo <= n && p >= proximo / n) {
      const vazio = fora.length === 0;
      if (f < limite && (vazio || f - fora[fora.length - 1] >= intervalo)) {
        fora.push(f);
      }
      proximo++;
    }
  }
  return fora;
};
