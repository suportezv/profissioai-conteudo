import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Superficie } from "./Superficie";
import { marca } from "./marca";

/**
 * Moldura dos cortes verticais (1080x1920) dos cases.
 *
 * O pedido foi "o mesmo video, so muda a resolucao": entao o filme nao e
 * remontado, ele entra inteiro, **o master 16:9 ja aprovado** ocupando a
 * largura quase toda (984x554) no centro do quadro. Isto e so o fundo: um PNG
 * parado, renderizado uma vez, sobre o qual o `scripts/vertical.sh` pousa o
 * master com o ffmpeg. Nenhuma cena e renderizada de novo, e o audio sai do
 * master sem mexer (-14 LUFS).
 *
 * O filme fica no centro, que e a faixa que o Reels e o TikTok nao cobrem: o
 * alto tem o cabecalho do app e o baixo tem legenda e botoes. A assinatura
 * fica 48 px acima do filme, alinhada a borda do cartao, com os 300 px de
 * largura da grade das pecas oficiais.
 */
/**
 * O filme entra como **cartao flutuante**, nao como faixa de borda a borda: a
 * faixa encostada nas bordas criava uma emenda entre os halos do filme e os da
 * moldura. Com margem de 48 px, raio de painel e a sombra da marca, a borda
 * vira intencao, que e a gramatica da UI flutuando da marca.
 */
export const CARTAO = { x: 48, w: 984, h: 554, raio: 20 };
export const CARTAO_Y = Math.round((1920 - CARTAO.h) / 2);

export const MolduraVertical: React.FC = () => (
  <AbsoluteFill>
    <Superficie modo="claro" halo />
    <div
      style={{
        position: "absolute",
        left: CARTAO.x,
        top: CARTAO_Y,
        width: CARTAO.w,
        height: CARTAO.h,
        borderRadius: CARTAO.raio,
        background: marca.branco,
        boxShadow: marca.sombra.painel,
      }}
    />
    <Img
      src={staticFile("marca/profissio-ai-escuro.svg")}
      style={{
        position: "absolute",
        left: CARTAO.x,
        width: 300,
        height: "auto",
        top: CARTAO_Y - 48 - 64,
      }}
    />
  </AbsoluteFill>
);
