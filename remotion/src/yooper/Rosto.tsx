import React from "react";
import { interpolate } from "remotion";
import { marca } from "../marca";
import { passo } from "../anim";

/**
 * Um rosto que abre um sorriso, desenhado em SVG.
 *
 * ## Por que nao e emoji de fonte
 *
 * O render headless do Remotion **nao tem fonte de emoji**: um caractere de
 * carinha sai como retangulo vazio. O mesmo gotcha ja tinha aparecido nas
 * reacoes de mensagem do case Soldiers.
 *
 * Isso acabou sendo melhor que o contorno. Emoji de fonte e uma imagem parada;
 * aqui a **expressao e animada**, entao o rosto muda de neutro para feliz no
 * frame exato em que a narracao entrega o resultado daquele cliente. O motion
 * e o que diz que alguma coisa boa aconteceu, nao o desenho.
 *
 * ## Os tres sinais da alegria, e nenhum deles sozinho basta
 *
 * 1. **A boca** vira de uma reta num arco, interpolando o ponto de controle da
 *    curva quadratica. Reta a reta, sem quebra.
 * 2. **Os olhos** deixam de ser circulos e viram arcos virados para cima. Um
 *    rosto so de boca curva lê como boneco; sorriso de verdade fecha o olho.
 * 3. **O salto**, uma escala que passa de 1 e volta. E o que faz a transicao
 *    parecer reacao e nao transicao de estado.
 *
 * A cor e o azul da marca com os tracos em branco, e nao o amarelo de emoji:
 * amarelo nao existe na paleta da revisao 3 e entraria na peca como um corpo
 * estranho.
 */

export const Rosto: React.FC<{
  /** 0 e neutro, 1 e sorrindo. */
  alegria: number;
  /** Diametro em pixels. */
  tamanho?: number;
  cor?: string;
}> = ({ alegria, tamanho = 150, cor = marca.azul }) => {
  // o salto: cresce ate 1,09 na metade da transicao e assenta em 1
  const salto = 1 + Math.sin(Math.min(1, Math.max(0, alegria)) * Math.PI) * 0.09;

  // a boca: o ponto de controle desce, e a reta vira arco
  const ctrl = interpolate(alegria, [0, 1], [50, 74]);
  const bocaLarg = interpolate(alegria, [0, 1], [16, 23]);
  const boca = `M ${50 - bocaLarg} 56 Q 50 ${ctrl} ${50 + bocaLarg} 56`;

  // os olhos: circulo que vira arco virado para cima
  const olhoArco = passo(alegria * 60, 26, 52);
  const olhoY = interpolate(alegria, [0, 1], [40, 38]);

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 100 100"
      style={{
        display: "block",
        transform: `scale(${salto})`,
        filter: `drop-shadow(0 16px 34px rgba(36,88,245,${0.16 + alegria * 0.2}))`,
      }}
    >
      <circle cx="50" cy="50" r="48" fill={cor} />
      {olhoArco < 0.5 ? (
        <>
          <circle cx="34" cy={olhoY} r="6" fill={marca.branco} />
          <circle cx="66" cy={olhoY} r="6" fill={marca.branco} />
        </>
      ) : (
        <>
          <path
            d={`M 27 ${olhoY + 3} Q 34 ${olhoY - 8} 41 ${olhoY + 3}`}
            stroke={marca.branco}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M 59 ${olhoY + 3} Q 66 ${olhoY - 8} 73 ${olhoY + 3}`}
            stroke={marca.branco}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
      <path
        d={boca}
        stroke={marca.branco}
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
