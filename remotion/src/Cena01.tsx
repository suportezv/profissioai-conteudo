import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { wa, UI } from "./whatsapp";
import { Teclado } from "./TecladoWhatsApp";

/**
 * Cena 01 do case EITA: a mensagem que fica sem resposta.
 *
 * 7 s, 30 fps, sem audio. O celular acende no escuro, alguem digita
 * "nao to bem", envia, e a mensagem fica la com UM check. Um check e o ponto
 * inteiro da cena: enviada, nao entregue. E a mensagem no vazio, que a cena 07
 * retoma com dois checks e a resposta em audio.
 *
 * Feito em motion, nao capturado do app e nao gerado por IA. Video por IA
 * embaralha texto e inventa UI: o horario, a frase e a contagem de checks
 * precisam estar exatos, porque e neles que a cena significa.
 *
 * A conversa e recriada. Nenhuma tela real de usuario entra na peca, e o
 * cabecalho nao traz nome: naquele momento a pessoa e qualquer pessoa.
 */

const FPS = 30;
export const CENA01_FRAMES = 7 * FPS;

const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);

const FRASE = "não tô bem";

// marcas de tempo, em frames
const ACORDA = 12;
const ACESO = 30;
const DIGITA_INI = 34;
const DIGITA_FIM = 122;
const ENVIA = 136;
const CHECK = 150;

const passo = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

/* --------------------------------------------------------------- check ---- */

/** UM check: enviada, nao entregue. E o significado da cena. */
const UmCheck: React.FC<{ opac: number }> = ({ opac }) => (
  <svg width="16" height="11" viewBox="0 0 16 11" style={{ opacity: opac }}>
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

/* ---------------------------------------------------------------- cena ---- */

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();

  // o celular acende
  const brilho = passo(f, ACORDA, ACESO);

  // digitacao caractere a caractere
  const n = Math.round(
    interpolate(f, [DIGITA_INI, DIGITA_FIM], [0, FRASE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const digitado = FRASE.slice(0, n);
  const digitando = f >= DIGITA_INI && f < ENVIA;
  const cursorAceso = Math.floor(f / 15) % 2 === 0;

  const enviou = f >= ENVIA;
  const entrada = passo(f, ENVIA, ENVIA + 10);

  const LARG = 470;
  const ALT = 1000;
  const bezel = 12;
  const telaL = LARG - bezel * 2;
  const telaA = ALT - bezel * 2;
  const hCabecalho = 64;
  const hEntrada = 58;
  const hTeclado = 300;
  const hChat = telaA - hCabecalho - hEntrada - hTeclado;

  return (
    <AbsoluteFill style={{ background: "#060809" }}>
      {/* o brilho da tela vaza no quarto escuro */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(1100px 820px at 50% 52%, #14384A 0%, transparent 72%)",
          opacity: brilho * 0.68,
        }}
      />

      {/* Enquadramento fechado: a tela domina o quadro e o aparelho sai cortado
          em cima e embaixo. Cortar o cabecalho resolve duas coisas de uma vez:
          da intimidade de close e tira da cena o nome de quem recebe, que ali
          ainda nao importa. */}
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
            boxShadow: `0 0 ${60 * brilho}px ${18 * brilho}px rgba(32,86,102,0.30)`,
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
              opacity: brilho,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* cabecalho sem nome: naquele momento a pessoa e qualquer pessoa */}
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
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: "#3B4A54",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{ width: 104, height: 9, borderRadius: 5, background: wa.apoio, opacity: 0.3 }}
                />
                <div
                  style={{ width: 62, height: 7, borderRadius: 4, background: wa.apoio, opacity: 0.18 }}
                />
              </div>
            </div>

            {/* area da conversa: vazia ate a mensagem sair */}
            <div
              style={{
                height: hChat,
                padding: "0 12px 10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                flexShrink: 0,
              }}
            >
              {enviou ? (
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
                    opacity: entrada,
                    transform: `translateY(${interpolate(entrada, [0, 1], [16, 0])}px)`,
                  }}
                >
                  <span style={{ fontFamily: UI, fontSize: 21, color: wa.texto, lineHeight: 1.3 }}>
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
                    <UmCheck opac={passo(f, CHECK, CHECK + 8)} />
                  </span>
                </div>
              ) : null}
            </div>

            {/* barra de digitacao */}
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
                  color: digitado ? wa.texto : wa.apoio,
                }}
              >
                {enviou ? (
                  <span style={{ color: wa.apoio, opacity: 0.55 }}>Mensagem</span>
                ) : (
                  <>
                    {digitado}
                    {digitando && cursorAceso ? (
                      <span style={{ color: wa.verde, marginLeft: 1 }}>|</span>
                    ) : null}
                  </>
                )}
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  background: wa.verde,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // o botao vira "enviar" quando ha texto
                  opacity: digitado || enviou ? 1 : 0.72,
                  transform: `scale(${
                    f >= ENVIA - 3 && f < ENVIA + 4 ? 0.88 : 1
                  })`,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M2 21 L23 12 L2 3 L2 10 L17 12 L2 14 Z" fill="#0B141A" />
                </svg>
              </div>
            </div>

            <Teclado larg={telaL} alt={hTeclado} />
          </div>
        </div>
      </AbsoluteFill>

      {/* o quarto continua escuro nas bordas */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(1500px 1000px at 50% 52%, transparent 46%, #000 100%)",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};
