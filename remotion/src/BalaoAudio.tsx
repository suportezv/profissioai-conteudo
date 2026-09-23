import React from "react";
import { interpolate } from "remotion";
import { wa, UI } from "./whatsapp";

/**
 * Balao de mensagem de audio do WhatsApp, recriado.
 *
 * Existe porque **ver alguem com o celular no ouvido nao diz que chegou um
 * audio**. Nos dois trechos da Anaclaudia a EITA responde na voz clonada dela,
 * que e o ponto do filme, e sem o balao a cena parecia so uma mulher ao
 * telefone. O balao nomeia o que esta acontecendo.
 *
 * ## O progresso e linear, e isso e a coisa mais importante aqui
 *
 * A primeira versao usava `passo()`, o helper da casa, que tem a curva
 * `SUAVE` (bezier 0.16, 1, 0.3, 1). Essa curva dispara no comeco e rasteja no
 * fim, entao **o cabecote corria na frente da voz e depois esperava por ela**,
 * e era isso que fazia a onda parecer dessincronizada mesmo com os tempos
 * certos. Mensagem de audio de verdade toca em velocidade constante: o
 * progresso aqui e linear, sem easing, sempre.
 *
 * O contador tambem anda. Ele mostra o tempo decorrido, como o app faz quando
 * esta tocando, e nao a duracao parada: relogio congelado ao lado de uma onda
 * que anda e a segunda coisa que denuncia que o balao e desenho.
 *
 * ## A onda e medida, nao desenhada
 *
 * `valores` vem de `ondas.ts`, que sai do envelope de volume do proprio
 * arquivo (`scripts/extrai_onda.py`). Barra inventada denuncia: o espectador
 * nao le a forma da onda, mas percebe quando ela sobe num silencio. As barras
 * ja tocadas acendem no azul de lido do WhatsApp, as demais ficam no cinza de
 * apoio, e o cabecote corre junto com o progresso.
 *
 * Nenhuma captura de tela de usuario entra na peca: isto aqui e recriacao, e a
 * paleta vem do `whatsapp.ts` que as cenas 01 e 07 ja usam.
 */
/** Segundos para "m:ss", como o app escreve. */
const relogio = (seg: number) => {
  const s = Math.max(0, Math.floor(seg));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export const BalaoAudio: React.FC<{
  valores: number[];
  /** 0 antes de tocar, 1 no fim. Linear, nunca com easing. */
  progresso: number;
  /** Entrada do balao, 0 a 1. */
  o: number;
  /** Duracao total do audio, em segundos. O contador anda ate ela. */
  segundos: number;
  escala?: number;
  /**
   * Onde o rabicho fica. `topo` e o balao de conversa do app (canto de cima
   * vivo); `base` e o balao que sai do celular por baixo, com o rabicho
   * desenhado por quem o posiciona. `baseDireita` e o mesmo balao espelhado,
   * com o canto vivo embaixo a direita, para quando ele sai do celular para a
   * esquerda (corte 9:16 do case EITA).
   */
  cauda?: "topo" | "base" | "baseDireita";
  /** Se o proprio balao desliza ao entrar. Quem anima de fora desliga. */
  desliza?: boolean;
}> = ({ valores, progresso, o, segundos, escala = 1, cauda = "topo", desliza = true }) => {
  const tocando = progresso > 0 && progresso < 1;
  const decorrido = tocando ? progresso * segundos : progresso >= 1 ? segundos : 0;
  return (
    <div
      style={{
        background: wa.balaoEntrada,
        borderRadius: 22 * escala,
        ...(cauda === "topo"
          ? { borderTopLeftRadius: 6 * escala }
          : cauda === "baseDireita"
            ? { borderBottomRightRadius: 4 * escala }
            : { borderBottomLeftRadius: 4 * escala }),
        padding: `${20 * escala}px ${26 * escala}px ${14 * escala}px`,
        display: "flex",
        flexDirection: "column",
        gap: 8 * escala,
        opacity: o,
        transform: desliza ? `translateY(${interpolate(o, [0, 1], [18, 0])}px)` : undefined,
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 * escala }}>
        <div
          style={{
            width: 64 * escala,
            height: 64 * escala,
            borderRadius: 32 * escala,
            background: wa.verde,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {tocando ? (
            <svg width={22 * escala} height={26 * escala} viewBox="0 0 12 14">
              <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
              <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
            </svg>
          ) : (
            <svg width={24 * escala} height={26 * escala} viewBox="0 0 13 14">
              <path d="M1 0 L13 7 L1 14 Z" fill={wa.fundoChat} />
            </svg>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4 * escala,
            height: 60 * escala,
          }}
        >
          {valores.map((v, i) => {
            const tocado = i / valores.length <= progresso;
            // o cabecote: a barra exatamente no ponto do play fica cheia
            const noPonto =
              Math.floor(progresso * valores.length) === i && tocando;
            return (
              <div
                key={i}
                style={{
                  width: 5 * escala,
                  // piso de 8% para barra de silencio continuar existindo
                  height: (6 + v * 52) * escala,
                  borderRadius: 3 * escala,
                  background: tocado ? wa.lido : wa.apoio,
                  opacity: noPonto ? 1 : tocado ? 0.95 : 0.4,
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          fontFamily: UI,
          fontSize: 22 * escala,
          color: wa.apoio,
          alignSelf: "flex-end",
        }}
      >
        {relogio(decorrido)}
      </div>
    </div>
  );
};
