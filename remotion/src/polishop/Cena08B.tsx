import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, conta, br, passo, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 08B do case Polishop: satisfação e volta.
 *
 * 8,9 s. Locução de 7,62 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "35%" 0,62 · "voltaram a conversar" 2,14 ·
 * "numa pesquisa de NPS" 4,12 · "93" 7,02.
 *
 * ## Os dois números que respondem os critérios mais difíceis
 *
 * Satisfação e relacionamento são os dois critérios da categoria que não se
 * provam mostrando funcionalidade. O retorno prova relacionamento: gente que
 * voltou a conversar sem ninguém chamar. O NPS prova satisfação.
 *
 * ## As duas bases vão coladas
 *
 * **O NPS 93 foi confirmado pelo cliente em 23/set/2026**, e com ele caíram as
 * duas ressalvas em rosa que a cena carregava. A base continua na mesma linha,
 * porque base pequena declarada é diferente de base pequena escondida: o
 * material do cliente diz "mais de 79 usuários".
 *
 * **O denominador do retorno é o mesmo 11.100 da cena anterior.** 3.886 ÷ 0,35
 * = 11.103, então os dois números descrevem a mesma população. A tela mostra a
 * razão inteira, sem rótulo inventado para o denominador.
 */

export const CENA08B_FRAMES = s(8.9);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const RETORNO_EM = s(0.6);
const NPS_EM = s(4.1);

export const Cena08B: React.FC = () => {
  const f = useCurrentFrame();

  const retorno = janela(f, RETORNO_EM, CENA08B_FRAMES, 13, 0);
  const nps = janela(f, NPS_EM, CENA08B_FRAMES, 12, 0);
  const vRet = conta(f, RETORNO_EM, RETORNO_EM + s(1.1), 35);
  // **Contagem linear, e comecando junto com o rotulo.** O rotulo "de NPS"
  // entra quando a locucao diz a palavra, em 4,5 s, e o numero e dito em
  // 7,02 s: com a curva SUAVE, que salta e freia, o numero chegava perto do
  // valor em um segundo e ficava rastejando; e com o contador comecando so
  // em 6,4 s a tela mostrava **um rotulo com um vazio em cima dele por dois
  // segundos e meio**, que le como render travado e e o mesmo defeito que o
  // case anterior corrigiu na barra de multiplicacao. Linear, do rotulo ate
  // a palavra, nunca ha buraco e o numero assenta quando ele e dito.
  const vNps = interpolate(f, [NPS_EM + s(0.45), NPS_EM + s(2.95)], [0, 93], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mostraNps = passo(f, NPS_EM + s(0.3), NPS_EM + s(0.45));

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-08b.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{ padding: MARGEM, flexDirection: "row", alignItems: "center", gap: 90 }}
      >
        {retorno > 0.001 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, ...entra(retorno, 22) }}>
            <div
              style={{
                fontSize: 168,
                fontWeight: 500,
                letterSpacing: "-5.88px",
                lineHeight: 1,
                color: marca.azul,
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 18px 50px rgba(36,88,245,0.22)",
              }}
            >
              {br(vRet, 0)}%
            </div>
            <div style={{ fontSize: 44, fontWeight: 500, letterSpacing: "-1.54px", lineHeight: 1.2 }}>
              voltaram a conversar
            </div>
            <div
              style={{
                fontSize: 25,
                letterSpacing: "-0.88px",
                color: m.apoio,
                borderTop: "1px solid rgba(16,18,24,0.22)",
                paddingTop: 16,
              }}
            >
              3.886 de 11.100
            </div>
          </div>
        ) : null}

        {nps > 0.001 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, ...entra(nps, 22) }}>
            <div
              style={{
                fontSize: 168,
                fontWeight: 500,
                letterSpacing: "-5.88px",
                lineHeight: 1,
                color: marca.azul,
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 18px 50px rgba(36,88,245,0.22)",
                opacity: mostraNps,
              }}
            >
              {br(vNps, 0)}
            </div>
            <div style={{ fontSize: 44, fontWeight: 500, letterSpacing: "-1.54px", lineHeight: 1.2 }}>
              de NPS
            </div>
            <div
              style={{
                fontSize: 25,
                letterSpacing: "-0.88px",
                color: m.apoio,
                borderTop: "1px solid rgba(16,18,24,0.22)",
                paddingTop: 16,
              }}
            >
              mais de 79 respondentes
            </div>
          </div>
        ) : null}
      </AbsoluteFill>

      <Sfx som="assenta" em={RETORNO_EM + s(1.1)} volume={0.34} />
      <Sfx som="assenta" em={NPS_EM + s(2.95)} volume={0.38} />
    </AbsoluteFill>
  );
};
