import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { janela, entra, s } from "./anim";
import { Sfx } from "./Sfx";

/**
 * Cena 09 do case: a tese e os lockups.
 *
 * 7,5 s, narracao de 5,48 s. A tese entra palavra a palavra, que e a
 * revelacao da gramatica da casa, e o ultimo verso segura sozinho antes de
 * virar assinatura.
 *
 * Os dois lockups ficam lado a lado, e a ordem nao e decorativa: no formulario
 * da premiacao a anunciante e a EITA, e a Profissio assina como quem construiu.
 * A peca nao pode sugerir que a Profissio e dona do produto.
 */

export const CENA09_FRAMES = s(7.5);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const TESE = [
  "A barreira nunca foi",
  "falta de interesse.",
  "É dar o primeiro passo.",
];
const FECHO = "E ele cabe numa mensagem.";

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();
  const assina = janela(f, s(5.4), CENA09_FRAMES, 16, 0);
  const tese = janela(f, s(0.5), s(5.4), 14, 10);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao/cena-09.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
        <div style={{ opacity: tese }}>
          {TESE.map((linha, i) => (
            <div
              key={linha}
              style={{
                fontSize: 82,
                fontWeight: 500,
                letterSpacing: "-2.87px",
                lineHeight: 1.18,
                ...entra(janela(f, s(0.6) + i * s(1.1), CENA09_FRAMES, 14, 0), 16),
              }}
            >
              {linha}
            </div>
          ))}
          <div
            style={{
              fontSize: 82,
              fontWeight: 500,
              letterSpacing: "-2.87px",
              lineHeight: 1.18,
              color: marca.azul,
              ...entra(janela(f, s(4.0), CENA09_FRAMES, 14, 0), 16),
            }}
          >
            {FECHO}
          </div>
        </div>
      </AbsoluteFill>

      {/* assinatura: EITA como anunciante, Profissio como quem construiu */}
      <AbsoluteFill
        style={{
          padding: MARGEM,
          alignItems: "center",
          justifyContent: "center",
          ...entra(assina, 20),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 88 }}>
          {/* a EITA aparece como ela e, sem reestilizar: e a marca da cliente,
              nao um elemento da Profissio. O PNG ja vem com fundo
              transparente e foi aparado ate o conteudo, senao um retangulo
              branco apareceria sobre a superficie #F4F6F9. */}
          <Img
            src={staticFile("marca/eita-mentora-virtual.png")}
            style={{ height: 290, width: "auto" }}
          />
          <div style={{ width: 1, height: 200, background: marca.linha }} />
          <Img
            src={staticFile("marca/profissio-ai-escuro.svg")}
            style={{ width: 500, height: "auto" }}
          />
        </div>
      </AbsoluteFill>

      {/* a assinatura entrando */}
      <Sfx som="surge" em={s(5.4)} volume={0.2} />
    </AbsoluteFill>
  );
};
