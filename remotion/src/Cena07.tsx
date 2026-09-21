import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { wa, UI } from "./whatsapp";
import { Teclado } from "./TecladoWhatsApp";
import { janela, passo, s } from "./anim";

/**
 * Cena 07 do case: a mesma conversa, agora respondida.
 *
 * 8 s de motion. Os 5 s restantes da cena sao a sonora da Anaclaudia ouvindo a
 * propria voz, que e material filmado e entra na montagem.
 *
 * A cena inteira existe para uma diferenca de dois pixels: a mensagem da cena
 * 01 tinha **um** check, aqui tem **dois**, e eles viram azul. Depois chega o
 * audio. Por isso nada aqui pode ser gerado por IA nem capturado de tela real:
 * o significado esta na contagem exata dos checks.
 *
 * O enquadramento repete o da cena 01 de proposito, com a mesma escala e o
 * mesmo corte de cabecalho. Se o espectador nao reconhecer que e a mesma
 * conversa, a cena nao diz nada.
 */

export const CENA07_FRAMES = s(8);

const FRASE = "não tô bem";

// marcas de tempo, em frames
const DOIS_CHECKS = s(0.9);
const LIDO = s(1.9);
const DIGITANDO = s(2.6);
const AUDIO_CHEGA = s(4.0);
const TOCA = s(5.2);

/** Dois checks. Cinza e entregue; azul e lido. A cena vira aqui. */
const DoisChecks: React.FC<{ opac: number; lido: number }> = ({ opac, lido }) => {
  const cor = lido > 0.5 ? wa.lido : wa.apoio;
  return (
    <svg width="20" height="11" viewBox="0 0 20 11" style={{ opacity: opac }}>
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

/** Onda do audio: barras que acendem conforme o play anda. */
const Onda: React.FC<{ progresso: number }> = ({ progresso }) => {
  const alturas = [
    6, 11, 8, 15, 22, 17, 26, 20, 13, 24, 30, 19, 12, 21, 27, 16, 9, 18, 23, 11,
    7, 14, 20, 10,
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 32 }}>
      {alturas.map((h, i) => {
        const tocado = i / alturas.length <= progresso;
        return (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              borderRadius: 2,
              background: tocado ? wa.lido : wa.apoio,
              opacity: tocado ? 1 : 0.45,
            }}
          />
        );
      })}
    </div>
  );
};

export const Cena07: React.FC = () => {
  const f = useCurrentFrame();

  const checks = passo(f, 0, DOIS_CHECKS);
  const lido = passo(f, LIDO, LIDO + 6);
  const digitando = janela(f, DIGITANDO, AUDIO_CHEGA, 8, 6);
  const audio = janela(f, AUDIO_CHEGA, CENA07_FRAMES, 12, 0);
  const progresso = interpolate(f, [TOCA, CENA07_FRAMES], [0, 0.86], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tocando = f >= TOCA;

  const LARG = 470;
  const ALT = 1000;
  const bezel = 12;
  const telaL = LARG - bezel * 2;
  const telaA = ALT - bezel * 2;
  const hCabecalho = 64;
  const hEntrada = 58;
  const hTeclado = 300;
  // mesma conta da cena 01: sem isso a conversa desce e sai do quadro
  const hChat = telaA - hCabecalho - hEntrada - hTeclado;

  const ponto = (i: number) => {
    const ciclo = (f - DIGITANDO + i * 5) % 30;
    return ciclo < 15 ? 1 : 0.35;
  };

  return (
    <AbsoluteFill style={{ background: "#060809" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1100px 820px at 50% 52%, #14384A 0%, transparent 72%)",
          opacity: 0.68,
        }}
      />

      {/* mesma escala e mesmo corte da cena 01: e a mesma conversa */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: "scale(1.62)",
        }}
      >
        <div
          style={{
            width: LARG,
            height: ALT,
            borderRadius: 42,
            background: "#0A0D0F",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 0 60px 18px rgba(32,86,102,0.30)",
            padding: bezel,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: telaL,
              height: telaA,
              borderRadius: 32,
              overflow: "hidden",
              background: wa.fundoChat,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* cabecalho sem nome, igual a cena 01 */}
            <div
              style={{
                height: hCabecalho,
                background: wa.barra,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 14px",
                flexShrink: 0,
              }}
            >
              <div
                style={{ width: 36, height: 36, borderRadius: 18, background: "#3B4A54" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    width: 104,
                    height: 9,
                    borderRadius: 5,
                    background: wa.apoio,
                    opacity: 0.3,
                  }}
                />
                <div
                  style={{
                    fontFamily: UI,
                    fontSize: 12,
                    color: wa.verde,
                    opacity: digitando,
                    height: 7,
                  }}
                >
                  digitando...
                </div>
              </div>
            </div>

            <div
              style={{
                height: hChat,
                flexShrink: 0,
                padding: "0 12px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              {/* a mensagem da cena 01, agora entregue e lida */}
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "80%",
                  background: wa.balaoSaida,
                  borderRadius: 10,
                  borderTopRightRadius: 3,
                  padding: "7px 10px 6px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                <span
                  style={{ fontFamily: UI, fontSize: 21, color: wa.texto, lineHeight: 1.3 }}
                >
                  {FRASE}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    paddingBottom: 2,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: UI, fontSize: 12, color: wa.apoio }}>23:47</span>
                  <DoisChecks opac={checks} lido={lido} />
                </span>
              </div>

              {/* tres pontinhos enquanto a resposta nao chega */}
              {digitando > 0.01 && audio < 0.01 ? (
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: wa.balaoEntrada,
                    borderRadius: 10,
                    borderTopLeftRadius: 3,
                    padding: "12px 14px",
                    display: "flex",
                    gap: 5,
                    opacity: digitando,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        background: wa.apoio,
                        opacity: ponto(i),
                      }}
                    />
                  ))}
                </div>
              ) : null}

              {/* o audio: a resposta que a cena 01 nunca teve */}
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "86%",
                  background: wa.balaoEntrada,
                  borderRadius: 10,
                  borderTopLeftRadius: 3,
                  padding: "10px 12px 8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  opacity: audio,
                  transform: `translateY(${interpolate(audio, [0, 1], [14, 0])}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      background: wa.verde,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {tocando ? (
                      <svg width="12" height="14" viewBox="0 0 12 14">
                        <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
                        <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
                      </svg>
                    ) : (
                      <svg width="13" height="14" viewBox="0 0 13 14">
                        <path d="M1 0 L13 7 L1 14 Z" fill={wa.fundoChat} />
                      </svg>
                    )}
                  </div>
                  <Onda progresso={tocando ? progresso : 0} />
                </div>
                <div
                  style={{
                    fontFamily: UI,
                    fontSize: 12,
                    color: wa.apoio,
                    alignSelf: "flex-end",
                  }}
                >
                  23:47
                </div>
              </div>
            </div>

            <div
              style={{
                height: hEntrada,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 10px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 21,
                  background: wa.barra,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  fontFamily: UI,
                  fontSize: 18,
                  color: wa.apoio,
                  opacity: 0.55,
                }}
              >
                Mensagem
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  background: wa.verde,
                  opacity: 0.72,
                }}
              />
            </div>

            <Teclado larg={telaL} alt={hTeclado} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1500px 1000px at 50% 52%, transparent 46%, #000 100%)",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};
