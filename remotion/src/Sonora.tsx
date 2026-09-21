import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { marca } from "./marca";
import { janela, entra, s } from "./anim";

/**
 * Uma sonora: plano filmado com som proprio e o GC de quem fala.
 *
 * O GC entra depois da primeira frase, nao junto com o corte. Nome aparecendo
 * no mesmo frame em que a pessoa comeca a falar rouba a frase: quem le nao
 * ouve. Entra no segundo beat, segura e sai antes do fim do plano.
 *
 * O filete e azul porque na peca a marca e quem apresenta quem fala. Sobre
 * imagem filmada o texto e branco com sombra curta, nunca caixa cheia: caixa
 * preta sobre rosto e legenda de telejornal, e o filme nao e isso.
 */
export const Sonora: React.FC<{
  arquivo: string;
  nome: string;
  papel: string;
  /** Quando o GC entra, em segundos, contados do inicio do plano. */
  gcEm?: number;
  /** Quanto tempo o GC fica, em segundos. */
  gcDura?: number;
}> = ({ arquivo, nome, papel, gcEm = 2.4, gcDura = 3.4 }) => {
  const f = useCurrentFrame();
  const gc = janela(f, s(gcEm), s(gcEm + gcDura), 14, 14);

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      <OffthreadVideo
        src={staticFile("broll/" + arquivo)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {gc > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: 120,
            bottom: 120,
            display: "flex",
            gap: 24,
            alignItems: "stretch",
            fontFamily: marca.fonte,
            textShadow: "0 2px 18px rgba(16,18,24,0.55)",
            ...entra(gc, 16),
          }}
        >
          <div style={{ width: 3, background: marca.azul, borderRadius: 2 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 500,
                letterSpacing: "-1.61px",
                color: marca.branco,
                lineHeight: 1.05,
              }}
            >
              {nome}
            </div>
            <div
              style={{
                fontSize: 26,
                letterSpacing: "-0.91px",
                color: marca.apoioEscuro,
                lineHeight: 1.2,
              }}
            >
              {papel}
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
