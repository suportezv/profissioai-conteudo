import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { wa } from "./whatsapp";
import { Balao3D, BalaoSaida, type Ancora } from "./Balao3D";
import { janela, passo, s } from "./anim";

/**
 * Cena 01 do case: a mensagem que fica sem resposta.
 *
 * 7 s. O plano e **video filmado** de alguem na cama com o celular, a tela
 * estourada de branco, e a mensagem levanta dali em 3D. A versao anterior
 * desenhava o app inteiro em UI chapada; nao era isso: a cena precisa da
 * pessoa, nao do print.
 *
 * O significado continua sendo **um** check: enviada, nao entregue. A cena 07
 * volta a este mesmo plano com dois checks e a resposta em audio. Por isso a
 * contagem de checks e a frase nunca podem ser geradas por IA nem capturadas de
 * tela real: precisam estar exatas, e e nelas que a cena significa.
 */

export const CENA01_FRAMES = s(7);

const FRASE = "não tô bem";

/** Onde o display esta no quadro, medido no frame do clipe. */
const ANCORA: Ancora = { x: 1060, y: 545 };

// marcas de tempo, em frames
const DIGITA_INI = s(1.0);
const DIGITA_FIM = s(2.5);
const LEVANTA_INI = s(2.9);
const LEVANTA_FIM = s(4.3);
const CHECK = s(4.8);

/** UM check: enviada, nao entregue. E o significado da cena. */
const UmCheck: React.FC<{ opac: number }> = ({ opac }) => (
  <svg width="34" height="24" viewBox="0 0 16 11" style={{ opacity: opac }}>
    <path
      d="M1 6.2 L4.6 9.8 L11.4 1.4"
      fill="none"
      stroke={wa.apoio}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();

  const n = Math.round(
    interpolate(f, [DIGITA_INI, DIGITA_FIM], [0, FRASE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const digitando = f >= DIGITA_INI && f < LEVANTA_INI;
  const cursorAceso = Math.floor(f / 15) % 2 === 0;

  const levanta = passo(f, LEVANTA_INI, LEVANTA_FIM);
  // o plano tem um push-in lento; o balao acompanha um pouco para nao descolar
  const deriva = interpolate(f, [0, CENA01_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src={staticFile("broll/mood-01-abertura.mp4")}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* o quarto fecha nas bordas para a mensagem ter onde respirar */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1500px 1000px at 58% 54%, transparent 40%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      <Balao3D
        levanta={levanta}
        ancora={ANCORA}
        deriva={deriva}
        opacidade={passo(f, DIGITA_INI, DIGITA_INI + 8)}
      >
        <BalaoSaida
          texto={FRASE.slice(0, n)}
          cursor={digitando && cursorAceso}
          checks={<UmCheck opac={janela(f, CHECK, CENA01_FRAMES, 10, 0)} />}
        />
      </Balao3D>
    </AbsoluteFill>
  );
};
