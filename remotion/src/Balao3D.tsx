import React from "react";
import { interpolate } from "remotion";
import { wa, UI } from "./whatsapp";
import { SUAVE } from "./anim";

/**
 * A mensagem saindo da tela, em 3D.
 *
 * As cenas 01 e 07 nao desenham mais o app inteiro. O plano e video filmado de
 * alguem com o celular na mao, e a mensagem **levanta da tela** em perspectiva:
 * comeca deitada no plano do display, pequena e desfocada, e gira ate encarar a
 * camera. Isso troca "print de conversa" por "a frase existe no mundo", que e o
 * que as duas cenas precisam dizer.
 *
 * O balao mantem a linguagem do WhatsApp (verde de saida, hora, check) porque a
 * cena 07 depende de o espectador contar os checks. O que muda e o suporte, nao
 * o vocabulario.
 *
 * Nenhuma conversa real entra na peca: tudo aqui e recriado.
 */

/** Onde o display esta no quadro de 1920x1080, medido no frame do clipe. */
export type Ancora = { x: number; y: number };

type Props = {
  /** 0 = deitado no plano da tela, 1 = flutuando de frente para a camera. */
  levanta: number;
  ancora: Ancora;
  children: React.ReactNode;
  /** Deriva lenta para acompanhar o push-in do plano. */
  deriva?: number;
  /**
   * Opacidade, separada de `levanta` de proposito. Ligar as duas fazia o balao
   * ficar invisivel enquanto a pessoa digitava, porque nessa fase `levanta` e
   * zero: a mensagem so aparecia depois de comecar a subir.
   */
  opacidade?: number;
};

export const Balao3D: React.FC<Props> = ({
  levanta,
  ancora,
  children,
  deriva = 0,
  opacidade = 1,
}) => {
  const e = (de: number, para: number) =>
    interpolate(levanta, [0, 1], [de, para], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        // a perspectiva nasce no display, nao no centro do quadro: e de la que
        // a mensagem levanta
        perspective: 1600,
        perspectiveOrigin: `${ancora.x}px ${ancora.y}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: ancora.x,
          top: ancora.y,
          transformStyle: "preserve-3d",
          transform: [
            `translate(-50%, -50%)`,
            `translateY(${e(0, -210) - deriva * 26}px)`,
            // o estado final e **reto**: a inclinacao residual de -2 e 6 graus
            // lia como lettering torto, nao como perspectiva. O 3D esta na
            // saida do plano da tela, nao em deixar a peca de banda.
            `rotateZ(${e(-9, 0)}deg)`,
            `rotateX(${e(64, 0)}deg)`,
            `translateZ(${e(0, 190)}px)`,
            `scale(${e(0.58, 1) * (1 + deriva * 0.06)})`,
          ].join(" "),
          opacity: opacidade,
          filter: `blur(${e(7, 0)}px) drop-shadow(0 ${e(6, 34)}px ${e(
            14,
            64,
          )}px rgba(0,0,0,${e(0.35, 0.6)}))`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** O balao de saida: o que a pessoa escreveu. */
export const BalaoSaida: React.FC<{
  texto: string;
  cursor?: boolean;
  checks?: React.ReactNode;
}> = ({ texto, cursor = false, checks }) => (
  <div
    style={{
      background: wa.balaoSaida,
      borderRadius: 22,
      borderTopRightRadius: 6,
      padding: "22px 28px 18px",
      display: "flex",
      alignItems: "flex-end",
      gap: 20,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ fontFamily: UI, fontSize: 56, color: wa.texto, lineHeight: 1.25 }}>
      {texto}
      {cursor ? <span style={{ color: wa.verde }}>|</span> : null}
    </span>
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingBottom: 10,
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: UI, fontSize: 28, color: wa.apoio }}>23:47</span>
      {checks}
    </span>
  </div>
);
