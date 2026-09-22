import React from "react";
import { AbsoluteFill } from "remotion";
import { marca, modos, type Modo } from "./marca";

/**
 * Fundo da marca. A revisao 3 nao usa gradiente: sao tres superficies chapadas
 * (escura, clara e azul), como nas pecas oficiais.
 *
 * ## A grade
 *
 * `grade` liga o mesmo preenchimento que o site da Profissio usa, e os numeros
 * foram lidos do `styles.css` dele, nao inventados: **linhas de 1px a cada
 * 56px**, na cor da tinta a 5%, com `opacity` 0,7 e uma **mascara radial que
 * apaga a grade nas bordas** (`circle at 50% 30%`, cheia ate 50%, transparente
 * em 85%). E a regua de 1px da marca virada em textura, entao ela preenche a
 * superficie sem inventar ornamento novo.
 *
 * `grade` liga duas camadas, nao uma: a grade fina **e** uma lavagem larga de
 * tom. A grade sozinha desaparece na previa reduzida, porque linha de 1px nao
 * sobrevive ao downscale; a lavagem e larga e aguenta. Juntas, o fundo tem
 * textura de perto e tom de longe.
 *
 * Fica opcional e desligada por padrao: serve para quadro de motion com muito
 * espaco vazio, e atrapalha atras de imagem filmada.
 *
 * > O site tambem tem halos em rosa e violeta. **O violeta e identidade
 * > aposentada** (revisao 3) e nao entra aqui; quando um halo for preciso, ele
 * > vai no azul `#2458F5` do `halo`, que e o acento atual.
 */

const LINHA_GRADE: Record<Modo, string> = {
  claro: "rgba(16,18,24,0.14)",
  escuro: "rgba(255,255,255,0.06)",
  azul: "rgba(255,255,255,0.09)",
};

/**
 * A lavagem: um tom largo por cima da superficie chapada.
 *
 * A grade sozinha nao resolve, e o motivo e mecanico: **linha de 1px nao
 * sobrevive a reducao de escala**. Numa previa de 854px de largura, cada linha
 * cai para menos de meio pixel e some, entao o fundo volta a parecer chapado
 * justo no arquivo que a pessoa assiste. A lavagem e larga e continua, entao
 * ela aguenta qualquer reducao e qualquer compressao.
 *
 * O desenho copia a estrutura do site (halos radiais fora de centro) com a
 * paleta atual: o azul `#2458F5` do acento, nunca o violeta, que a revisao 3
 * aposentou.
 */
const LAVAGEM: Record<Modo, string> = {
  claro: [
    "radial-gradient(72% 58% at 16% 10%, rgba(36,88,245,0.16), transparent 64%)",
    "radial-gradient(62% 52% at 90% 88%, rgba(36,88,245,0.115), transparent 62%)",
    "radial-gradient(95% 72% at 50% 122%, rgba(16,18,24,0.055), transparent 66%)",
  ].join(","),
  escuro: [
    "radial-gradient(70% 55% at 18% 12%, rgba(36,88,245,0.20), transparent 62%)",
    "radial-gradient(60% 50% at 88% 86%, rgba(87,227,242,0.10), transparent 60%)",
  ].join(","),
  azul: [
    "radial-gradient(70% 55% at 18% 12%, rgba(255,255,255,0.10), transparent 62%)",
    "radial-gradient(60% 50% at 88% 86%, rgba(16,18,24,0.10), transparent 60%)",
  ].join(","),
};

const MASCARA =
  "radial-gradient(circle at 50% 30%, #000 0%, #000 50%, transparent 85%)";

export const Superficie: React.FC<{
  modo?: Modo;
  halo?: boolean;
  grade?: boolean;
}> = ({ modo = "escuro", halo = false, grade = false }) => {
  const m = modos[modo];
  const linha = LINHA_GRADE[modo];
  return (
    <AbsoluteFill style={{ backgroundColor: m.fundo }}>
      {grade ? (
        <AbsoluteFill style={{ background: LAVAGEM[modo] }} />
      ) : null}
      {grade ? (
        <AbsoluteFill
          style={{
            backgroundImage: [
              `linear-gradient(transparent 0, transparent calc(100% - 1px), ${linha} 100%)`,
              `linear-gradient(90deg, transparent 0, transparent calc(100% - 1px), ${linha} 100%)`,
            ].join(","),
            backgroundSize: "56px 56px",
            maskImage: MASCARA,
            WebkitMaskImage: MASCARA,
            // o site usa 0,7 sobre a linha de 5%; aqui vai cheia porque
            // **compressao de video come grade fraca**: 3,5% de contraste
            // sobrevive num monitor e desaparece depois do h264
            opacity: 1,
          }}
        />
      ) : null}
      {halo ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 78% 18%, ${
              modo === "azul" ? marca.branco : marca.azul
            } 0%, transparent 55%)`,
            opacity: modo === "claro" ? 0.07 : 0.14,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
