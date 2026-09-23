import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
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
 * 8,9 s. Locução de 7,48 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "35% dos clientes voltaram a conversar"
 * 0,60 · "numa pesquisa de NPS" 4,92 · "94" 6,92.
 *
 * ## Os dois números que respondem os critérios mais difíceis
 *
 * Satisfação e relacionamento são os dois critérios da categoria que não se
 * provam mostrando funcionalidade. O retorno prova relacionamento: gente que
 * voltou a conversar sem ninguém chamar. O NPS prova satisfação.
 *
 * ## As duas bases vão coladas, e uma delas é uma pendência
 *
 * **O NPS 94 é o número mais exposto do filme.** O material do cliente diz
 * "mais de 79 usuários", que é base pequena e frase ambígua. No case anterior
 * um NPS de amostra reduzida foi cortado por isso; aqui ele fica, porque é o
 * único número que responde satisfação, mas a base vai na mesma linha e o que
 * falta vai escrito em rosa.
 *
 * **O denominador do retorno também precisa de nome.** 3.886 ÷ 0,35 = 11.103,
 * que é o mesmo 11.100 rotulado como conversas na cena anterior. Ou a taxa é
 * sobre conversas, ou os dois números são a mesma população com dois nomes. A
 * tela mostra os dois e declara a dúvida.
 */

export const CENA08B_FRAMES = s(8.9);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const RETORNO_EM = s(0.6);
const NPS_EM = s(4.7);

export const Cena08B: React.FC = () => {
  const f = useCurrentFrame();

  const retorno = janela(f, RETORNO_EM, CENA08B_FRAMES, 13, 0);
  const nps = janela(f, NPS_EM, CENA08B_FRAMES, 12, 0);
  const vRet = conta(f, RETORNO_EM, RETORNO_EM + s(1.1), 35);
  const vNps = conta(f, NPS_EM + s(1.6), NPS_EM + s(2.4), 94);
  const mostraNps = passo(f, NPS_EM + s(1.6), NPS_EM + s(1.7));

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
              3.886 de 11.100 ·{" "}
              <span style={{ color: marca.rosa }}>rótulo do denominador a confirmar</span>
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
              79 respondentes ·{" "}
              <span style={{ color: marca.rosa }}>N exato e período a confirmar</span>
            </div>
          </div>
        ) : null}
      </AbsoluteFill>

      <Sfx som="assenta" em={RETORNO_EM + s(1.1)} volume={0.34} />
      <Sfx som="assenta" em={NPS_EM + s(2.4)} volume={0.38} />
    </AbsoluteFill>
  );
};
