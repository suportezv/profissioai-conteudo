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
import { janela, entra, passo, conta, br, s, SUAVE } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 05 do case Soldiers: o cupom vira chave.
 *
 * 12 s, narracao de 9,75 s que comeca em 0,6 s. Pausas em 3,13 / 7,42 / 9,41 s.
 *
 * ## A virada e de funcao, nao de objeto
 *
 * O mesmo retangulo gira em 3D e, no meio do giro, troca o que esta escrito
 * dentro: de `CUPOM10` para `acesso`. **Nao entra um objeto novo**, porque a
 * frase nao e "ganhou uma chave", e "o cupom deixou de ser desconto e virou
 * chave". Objeto novo contaria outra coisa.
 *
 * A troca do conteudo acontece em 90 graus, quando o retangulo esta de perfil e
 * nao da para ler nenhum dos dois. Trocar antes ou depois disso mostra a
 * emenda.
 *
 * ## Os 90 dias sao cumulativos, e e isso que sustenta a recompra
 *
 * O contador soma em vez de reiniciar: 90 vira 180 quando a segunda compra
 * entra. E o mecanismo de LTV do case, e ele precisa ser visto somando, porque
 * o filme **nao pode afirmar resultado de recompra**, que so comeca a ser
 * medido em novembro.
 */

export const CENA05_FRAMES = s(12);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

const ENTRA_CUPOM = s(0.9);
const GIRA = s(2.4);
const DIAS_EM = s(4.6);
const SOMA_EM = s(8.3);

export const Cena05: React.FC = () => {
  const f = useCurrentFrame();

  const cupom = janela(f, ENTRA_CUPOM, CENA05_FRAMES, 18, 0);
  const giro = interpolate(f, [GIRA, GIRA + s(1.0)], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  // a troca acontece de perfil, em 90 graus, quando nenhum dos dois se le
  const virou = giro >= 90;

  const dias = janela(f, DIAS_EM, CENA05_FRAMES, 16, 0);
  const total = conta(f, SOMA_EM, SOMA_EM + s(1.0), 90);
  const somou = janela(f, SOMA_EM, CENA05_FRAMES, 14, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-05.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 72,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: janela(f, s(0.6), CENA05_FRAMES, 14, 0),
          }}
        >
          A decisão que liga tudo à compra
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
          {/* o retangulo que gira: um so objeto, duas funcoes */}
          <div style={{ perspective: 1400, ...entra(cupom, 20) }}>
            <div
              style={{
                width: 420,
                height: 200,
                borderRadius: marca.raio.painel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotateY(${giro}deg)`,
                transformStyle: "preserve-3d",
                background: virou ? marca.azul : marca.branco,
                border: `${virou ? 0 : 2}px dashed ${marca.linha}`,
                boxShadow: virou ? marca.sombra.azul : marca.sombra.painel,
              }}
            >
              <div
                style={{
                  // o verso volta espelhado; desespelha so o conteudo
                  transform: virou ? "rotateY(180deg)" : "none",
                  fontSize: virou ? 52 : 44,
                  fontWeight: 500,
                  letterSpacing: virou ? "-1.82px" : "2px",
                  color: virou ? marca.branco : m.apoio,
                  textTransform: virou ? "none" : "uppercase",
                }}
              >
                {virou ? "acesso" : "CUPOM10"}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "-1.54px",
              lineHeight: 1.25,
              opacity: janela(f, GIRA + s(0.8), CENA05_FRAMES, 16, 0),
            }}
          >
            Qualquer compra,
            <br />
            de qualquer valor.
          </div>
        </div>

        {/* os 90 dias, e a segunda compra somando em cima */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28, opacity: dias }}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 500,
              letterSpacing: "-4.9px",
              lineHeight: 0.95,
              color: marca.azul,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 18px 50px rgba(36,88,245,0.22)",
            }}
          >
            {br(90 + total, 0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 22 }}>
            <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-1.26px" }}>
              dias de acompanhamento
            </div>
            <div
              style={{
                fontSize: 24,
                letterSpacing: "-0.84px",
                color: m.apoio,
                opacity: somou,
              }}
            >
              cada nova compra soma mais 90, cumulativos
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Sfx som="pop" em={ENTRA_CUPOM} volume={0.18} />
      <Sfx som="surge" em={GIRA} volume={0.22} />
      <Sfx som="marca" em={GIRA + s(0.5)} volume={0.26} />
      <Sfx som="assenta" em={DIAS_EM + s(0.2)} volume={0.3} />
      <Sfx som="assenta" em={SOMA_EM + s(1.0)} volume={0.34} />
    </AbsoluteFill>
  );
};
