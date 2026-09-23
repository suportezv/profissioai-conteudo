import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca } from "../marca";
import { passo, s } from "../anim";

/**
 * Cena 00 do case Polishop: a abertura.
 *
 * 4,6 s de imagem gerada com a narração já correndo, cortando seco para o
 * motion. É o padrão da casa, e as três regras dele valem aqui:
 *
 * 1. **A abertura mostra o que a primeira frase afirma, acontecendo.** A frase
 *    é "quem compra um eletrodoméstico quer usar tudo o que ele faz", então o
 *    plano é o momento em que alguém tira o aparelho da caixa, que é
 *    literalmente quando essa vontade existe. É também o momento que o case
 *    inteiro trata: o QR de fábrica é lido ali.
 * 2. **A narração começa aqui.** A `cena-01.mp3` foi partida em 3,4 s, no
 *    silêncio entre "tudo o que ele faz" e "mas o manual fica na gaveta": a
 *    primeira metade toca nesta cena, a segunda abre a 01.
 * 3. **O áudio do clipe fica mudo**, porque vídeo gerado traz trilha que
 *    ninguém pediu.
 *
 * O corte para a cena 01 é seco, e as duas imagens se opõem de propósito:
 * cozinha quente e caixa aberta aqui, superfície clara e manual guardado lá.
 */

export const CENA00_FRAMES = s(4.6);
const NARRACAO_EM = s(0.7);
/** Onde o clipe começa, em segundos do arquivo de origem (24 fps). */
const DE = 1.2;

export const Cena00: React.FC = () => {
  const f = useCurrentFrame();
  const abre = passo(f, 0, s(0.5));
  const empurra = interpolate(f, [0, CENA00_FRAMES], [1.02, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      <AbsoluteFill style={{ opacity: abre, transform: `scale(${empurra})` }}>
        <OffthreadVideo
          src={staticFile("polishop/abertura.mp4")}
          startFrom={Math.round(DE * 24)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(88% 82% at 50% 50%, transparent 44%, rgba(0,0,0,0.44) 100%)",
          opacity: abre,
        }}
      />

      <Sequence from={NARRACAO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-01a.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
