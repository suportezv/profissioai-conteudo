import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { janela, s } from "./anim";
import { interpolate } from "remotion";
import { BalaoAudio } from "./BalaoAudio";

/**
 * Plano gravado na vertical ocupando um quadro 16:9, sem corte e sem barra.
 *
 * ## O problema, com numero
 *
 * O material da Anaclaudia e 1080x1920 de celular. Para preencher 1920x1080
 * sem deformar seria preciso ampliar 1,78x e ficar com uma faixa de 608px de
 * altura, e ai **sai o cabelo dela ou sai o queixo**: a largura do fonte ja
 * esta toda em uso, entao nao existe afastar a camera dentro de um corte. As
 * duas coisas que o pedido queria, tela cheia e sem zoom, nao cabem juntas.
 *
 * ## A saida
 *
 * O plano inteiro vai no centro, no tamanho que cabe na altura, e **as laterais
 * recebem uma copia ampliada e desfocada dele mesmo**. O quadro fica cheio, o
 * corte continua sendo nenhum, e o que preenche nao inventa informacao: e a
 * propria imagem, sem nitidez e sem nada para ler. E convencao de documentario
 * com material de celular, e foi a escolha do usuario entre as tres possiveis.
 *
 * O desfoque e forte de proposito (60px). Desfoque timido lê como imagem fora
 * de foco, que parece defeito; desfoque forte le como fundo, que e o que ele e.
 */

export type Fala = {
  /** Quando a EITA comeca a falar, em segundos do clipe. */
  de: number;
  /** Quando termina. */
  ate: number;
  /** O envelope medido no proprio arquivo. */
  valores: number[];
  /**
   * Onde o balao encosta, em coordenadas do quadro 1920x1080: o canto inferior
   * direito dele. **Fica perto do celular dela**, porque balao solto no canto
   * nao liga a imagem ao som; colado no aparelho, ele le como o audio que esta
   * saindo dali.
   */
  ancora: { x: number; y: number };
};

export const PlanoVertical: React.FC<{
  arquivo: string;
  /** Se existir, desenha o balao de audio enquanto a EITA fala. */
  fala?: Fala;
}> = ({ arquivo, fala }) => {
  const f = useCurrentFrame();
  const src = staticFile("broll/" + arquivo);

  const entra = fala ? janela(f, s(fala.de - 0.5), s(fala.ate + 0.6), 12, 14) : 0;
  // linear, sem easing: mensagem de audio toca em velocidade constante, e a
  // curva suave da casa fazia o cabecote correr na frente da voz
  const progresso = fala
    ? interpolate(f, [s(fala.de), s(fala.ate)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* o fundo: a mesma imagem, ampliada ate cobrir, desfocada e escurecida
          de leve para nao competir com o plano nitido */}
      <AbsoluteFill>
        <OffthreadVideo
          src={src}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(60px) brightness(0.86) saturate(1.1)",
            transform: "scale(1.15)",
          }}
        />
      </AbsoluteFill>

      {/* o plano, inteiro, no centro */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <OffthreadVideo src={src} style={{ height: "100%", width: "auto" }} />
      </AbsoluteFill>

      {fala && entra > 0.001 ? (
        <div
          style={{
            position: "absolute",
            right: 1920 - fala.ancora.x,
            bottom: 1080 - fala.ancora.y,
          }}
        >
          <BalaoAudio
            valores={fala.valores}
            progresso={progresso}
            o={entra}
            segundos={fala.ate - fala.de}
            escala={0.92}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
