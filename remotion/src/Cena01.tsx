import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { wa, UI } from "./whatsapp";
import { Balao3D, type Ancora } from "./Balao3D";
import { passo, s } from "./anim";
import { montaDigitacao, textoEm, type Rascunho } from "./digitacao";

/**
 * Cena 01 do case: a mensagem que nunca e enviada.
 *
 * 8 s sobre plano filmado. Alguem na cama, no escuro, escreve um desabafo,
 * hesita, **apaga**, escreve outro, apaga, escreve um terceiro e para. O campo
 * fica ali com o cursor piscando. Nada e enviado, e ninguem responde.
 *
 * E uma troca de conceito, nao de acabamento. A versao anterior mandava a
 * mensagem e ela ficava com um check: dizia "escreveu e nao foi entregue".
 * Esta diz outra coisa, e mais dura: **nem chegou a mandar**. A narracao que
 * entra depois ("e a maioria nunca manda pra ninguem") passa a ter imagem.
 *
 * Por isso aqui nao existe balao de saida nem check: o que aparece e o **campo
 * de digitacao**, que e onde o texto mora antes de virar mensagem.
 *
 * O ritmo e rapido de proposito. Quem precisa desabafar digita com urgencia e
 * apaga mais rapido ainda. Os numeros ficam em `digitacao.ts`.
 */

export const CENA01_FRAMES = s(8);

/** Onde o display esta no quadro, medido no frame do clipe. */
const ANCORA: Ancora = { x: 1060, y: 545 };

const LEVANTA_INI = s(0.1);
const LEVANTA_FIM = s(0.9);

/** Os rascunhos, em ordem. O ultimo nao e apagado: fica sem ser enviado. */
const RASCUNHOS: Rascunho[] = [
  { texto: "não estou bem", hesita: 0.55, pausa: 0.2 },
  { texto: "preciso falar com alguém", hesita: 0.6, pausa: 0.22 },
  { texto: "não sei mais o que fazer", hesita: 0, apaga: false },
];

const { trechos, total } = montaDigitacao(RASCUNHOS, 1.0);

/** O campo de digitacao do WhatsApp, recriado. Nenhuma tela real entra aqui. */
const CampoDigitacao: React.FC<{ texto: string; cursor: boolean }> = ({
  texto,
  cursor,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      width: 940,
    }}
  >
    <div
      style={{
        flexGrow: 1,
        minHeight: 96,
        borderRadius: 48,
        background: wa.barra,
        display: "flex",
        alignItems: "center",
        padding: "0 34px",
        fontFamily: UI,
        fontSize: 42,
        color: texto ? wa.texto : wa.apoio,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {texto || "Mensagem"}
      {cursor ? (
        <span style={{ color: wa.verde, marginLeft: 2, fontWeight: 300 }}>|</span>
      ) : null}
    </div>
    {/* o botao de enviar existe e nunca e tocado: e o ponto da cena */}
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 48,
        background: wa.verde,
        opacity: 0.55,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="42" height="42" viewBox="0 0 24 24">
        <path d="M2 21 L23 12 L2 3 L2 10 L17 12 L2 14 Z" fill={wa.fundoChat} />
      </svg>
    </div>
  </div>
);

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seg = f / fps;

  const { texto, digitando } = textoEm(trechos, seg);
  // o cursor pisca quando a mao para; digitando, ele fica aceso
  const cursorAceso = digitando || Math.floor(f / 14) % 2 === 0;

  const levanta = passo(f, LEVANTA_INI, LEVANTA_FIM);
  const deriva = passo(f, 0, CENA01_FRAMES);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src={staticFile("broll/mood-01-abertura.mp4")}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* o quarto fecha nas bordas para o campo ter onde respirar */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1500px 1000px at 58% 54%, transparent 40%, rgba(0,0,0,0.74) 100%)",
        }}
      />

      <Balao3D
        levanta={levanta}
        ancora={ANCORA}
        deriva={deriva}
        opacidade={passo(f, LEVANTA_INI, LEVANTA_INI + 8)}
      >
        <CampoDigitacao texto={texto} cursor={cursorAceso} />
      </Balao3D>
    </AbsoluteFill>
  );
};

/** Quanto tempo a digitacao ocupa, para a cena conferir que cabe. */
export const CENA01_DIGITACAO_SEG = total;
