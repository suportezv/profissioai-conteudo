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
 *
 * **Mas sombra sozinha nao garante leitura.** A linha de apoio, no cinza
 * #AAB3C4, sumiu sobre uma janela clara no fundo do plano: cinza claro sobre
 * claro nao le, por mais sombra que tenha. Entrou um veu no canto inferior
 * esquerdo, que aparece e some junto com o GC. Ele fica aqui, no componente, e
 * nao na cena, porque as sonoras que ainda vao ser captadas vao usar este
 * mesmo GC sobre planos que ninguem viu: a legibilidade tem que ser do
 * componente, nao da sorte do enquadramento.
 */
export const Sonora: React.FC<{
  arquivo: string;
  nome: string;
  papel: string;
  /** Quando o GC entra, em segundos, contados do inicio do plano. */
  gcEm?: number;
  /** Quanto tempo o GC fica, em segundos. */
  gcDura?: number;
  /**
   * Sobrelinha no alto do quadro, dizendo do que a pessoa esta falando.
   *
   * Existe porque uma sonora cortada no meio de uma narracao perde o assunto:
   * quem ouve entrou agora e nao sabe a pergunta que foi feita. Duas palavras
   * no alto devolvem o contexto sem roubar a frase.
   */
  rotulo?: string;
}> = ({ arquivo, nome, papel, gcEm = 2.4, gcDura = 3.4, rotulo }) => {
  const f = useCurrentFrame();
  const gc = janela(f, s(gcEm), s(gcEm + gcDura), 14, 14);
  const rot = janela(f, s(0.3), s(3.6), 14, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      <OffthreadVideo
        src={staticFile("broll/" + arquivo)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {rotulo && rot > 0.001 ? (
        <AbsoluteFill style={{ opacity: rot, fontFamily: marca.fonte }}>
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to bottom, rgba(16,18,24,0.55) 0%, rgba(16,18,24,0) 34%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 120,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.branco,
              ...entra(rot, 14),
            }}
          >
            {rotulo}
          </div>
        </AbsoluteFill>
      ) : null}

      {gc > 0.001 ? (
        <AbsoluteFill
          style={{
            opacity: gc,
            background:
              "linear-gradient(to top right, rgba(16,18,24,0.62) 0%, rgba(16,18,24,0.28) 26%, rgba(16,18,24,0) 52%)",
          }}
        />
      ) : null}

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
