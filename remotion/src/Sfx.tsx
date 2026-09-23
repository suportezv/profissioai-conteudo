import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

/**
 * Um efeito sonoro colocado num instante da composicao.
 *
 * Existe para o codigo da cena dizer "som tal, neste frame, neste volume" numa
 * linha, em vez de repetir Sequence e Audio em cada ponto. Numa cena com
 * dezenas de toques de tecla isso e a diferenca entre ler e nao ler.
 *
 * O volume e sempre baixo de proposito: efeito de interface acompanha a
 * imagem, nao disputa com a locucao.
 */
export const Sfx: React.FC<{
  /** Nome do arquivo em `public/sfx`, sem extensao. */
  som: string;
  /** Frame em que toca. */
  em: number;
  volume?: number;
}> = ({ som, em, volume = 0.35 }) => (
  <Sequence from={Math.max(0, Math.round(em))} layout="none">
    <Audio src={staticFile(`sfx/${som}.mp3`)} volume={volume} />
  </Sequence>
);
