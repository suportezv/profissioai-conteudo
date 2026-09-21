import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { wa, UI } from "./whatsapp";
import { Balao3D, BalaoSaida, type Ancora } from "./Balao3D";
import { janela, passo, s } from "./anim";

/**
 * Cena 07 do case: a mesma conversa, agora respondida.
 *
 * 8 s de motion sobre plano filmado. Os 5 s restantes da cena sao a sonora da
 * Anaclaudia ouvindo a propria voz, que e material captado e entra na montagem.
 *
 * A cena inteira existe para uma diferenca de contagem: a 01 tinha **um**
 * check, aqui tem **dois**, e eles viram azul. Depois o audio chega e toca.
 * Por isso nada aqui pode ser gerado por IA: o significado esta na contagem.
 *
 * O balao levanta do display com a mesma curva da 01, e e assim que o
 * espectador reconhece que e a mesma conversa. Se ele nao reconhecer, a cena
 * nao diz nada.
 */

export const CENA07_FRAMES = s(8);

const FRASE = "não tô bem";
const ANCORA: Ancora = { x: 1342, y: 830 };

// marcas de tempo, em frames
const LEVANTA_INI = s(0.3);
const LEVANTA_FIM = s(1.6);
const LIDO = s(2.3);
const AUDIO_CHEGA = s(3.6);
const TOCA = s(4.8);

/** Dois checks. Cinza e entregue; azul e lido. A cena vira aqui. */
const DoisChecks: React.FC<{ lido: number }> = ({ lido }) => {
  const cor = lido > 0.5 ? wa.lido : wa.apoio;
  return (
    <svg width="42" height="24" viewBox="0 0 20 11">
      <path
        d="M1 6.2 L4.6 9.8 L11.4 1.4"
        fill="none"
        stroke={cor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6 6.2 L10.2 9.8 L17 1.4"
        fill="none"
        stroke={cor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Onda do audio: as barras acendem conforme o play anda. */
const Onda: React.FC<{ progresso: number }> = ({ progresso }) => {
  const alturas = [
    12, 26, 18, 38, 52, 40, 62, 46, 30, 56, 70, 44, 26, 50, 64, 36, 20, 42, 54,
    26, 16, 32, 46, 22,
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, height: 72 }}>
      {alturas.map((h, i) => {
        const tocado = i / alturas.length <= progresso;
        return (
          <div
            key={i}
            style={{
              width: 7,
              height: h,
              borderRadius: 4,
              background: tocado ? wa.lido : wa.apoio,
              opacity: tocado ? 1 : 0.45,
            }}
          />
        );
      })}
    </div>
  );
};

/** O balao de entrada: a resposta que a cena 01 nunca teve. */
const BalaoAudio: React.FC<{ tocando: boolean; progresso: number }> = ({
  tocando,
  progresso,
}) => (
  <div
    style={{
      background: wa.balaoEntrada,
      borderRadius: 22,
      borderTopLeftRadius: 6,
      padding: "24px 30px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          background: wa.verde,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {tocando ? (
          <svg width="26" height="30" viewBox="0 0 12 14">
            <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
            <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
          </svg>
        ) : (
          <svg width="28" height="30" viewBox="0 0 13 14">
            <path d="M1 0 L13 7 L1 14 Z" fill={wa.fundoChat} />
          </svg>
        )}
      </div>
      <Onda progresso={tocando ? progresso : 0} />
    </div>
    <div style={{ fontFamily: UI, fontSize: 26, color: wa.apoio, alignSelf: "flex-end" }}>
      23:47
    </div>
  </div>
);

export const Cena07: React.FC = () => {
  const f = useCurrentFrame();

  const levanta = passo(f, LEVANTA_INI, LEVANTA_FIM);
  const lido = passo(f, LIDO, LIDO + 8);
  const audio = passo(f, AUDIO_CHEGA, AUDIO_CHEGA + s(1.0));
  const progresso = interpolate(f, [TOCA, CENA07_FRAMES], [0, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deriva = interpolate(f, [0, CENA07_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
  });

  // o balao de saida recua quando a resposta chega: a cena passa a ser dela
  const recuo = janela(f, AUDIO_CHEGA, CENA07_FRAMES, 18, 0);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src={staticFile("broll/mood-07-audio-maos.mp4")}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1500px 1000px at 52% 52%, transparent 40%, rgba(0,0,0,0.70) 100%)",
        }}
      />

      {/* a mensagem da cena 01, agora entregue e lida */}
      <div style={{ opacity: 1 - recuo * 0.38 }}>
        <Balao3D
          levanta={levanta}
          ancora={{ x: ANCORA.x + 150, y: ANCORA.y - recuo * 150 }}
          deriva={deriva}
          opacidade={passo(f, 0, 8)}
        >
          <BalaoSaida texto={FRASE} checks={<DoisChecks lido={lido} />} />
        </Balao3D>
      </div>

      {/* e a resposta, que levanta do mesmo display */}
      {audio > 0.001 ? (
        <Balao3D
          levanta={audio}
          ancora={{ x: ANCORA.x - 120, y: ANCORA.y + 130 }}
          deriva={deriva}
          opacidade={passo(f, AUDIO_CHEGA, AUDIO_CHEGA + 8)}
        >
          <BalaoAudio tocando={f >= TOCA} progresso={progresso} />
        </Balao3D>
      ) : null}
    </AbsoluteFill>
  );
};
