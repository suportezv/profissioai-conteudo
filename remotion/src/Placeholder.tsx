import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { passo, s } from "./anim";

/**
 * Cartao de lacuna para o corte de montagem.
 *
 * Ocupa o tempo exato da cena que ainda nao existe e **diz o que falta**, em
 * vez de um preto mudo. Assim o corte completo ja tem o ritmo certo e da para
 * julgar o filme antes da captacao.
 *
 * Deliberadamente parece rascunho: borda tracejada e contador regressivo. Um
 * placeholder bonito demais acaba sendo aprovado sem querer.
 *
 * `guia` marca o cartao que toca uma **voz gerada** no lugar da pessoa, para
 * medir o tempo antes da captacao. A marca e obrigatoria e fica visivel o
 * tempo todo: audio sintetico de pessoa real, num corte que circula, tem que
 * se anunciar em tela. Ele existe para marcacao e **nao pode sobreviver ate a
 * entrega**.
 */

type Props = {
  cena: string;
  rotulo: string;
  titulo: string;
  detalhe?: string;
  /** De onde o material vem, para virar pedido na hora certa. */
  origem: string;
  /** Texto da tarja quando o cartao toca voz gerada. */
  guia?: string;
};

const m = modos.claro;

export const Placeholder: React.FC<Props> = ({
  cena,
  rotulo,
  titulo,
  detalhe,
  origem,
  guia,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const entra = passo(f, 0, s(0.5));
  const restam = Math.max(0, Math.ceil((durationInFrames - f) / fps));
  /**
   * A barra que escoa, e a razao dela e de leitura, nao de enfeite.
   *
   * O contador regressivo so muda de segundo em segundo, entao o cartao ficava
   * 14 s sem um unico pixel se mexendo e o filme parecia **travar** ali. Uma
   * barra que anda a cada frame diz "esta rodando, isto e uma lacuna" em vez
   * de "o render morreu".
   */
  const escoa = durationInFrames > 0 ? f / durationInFrames : 0;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      {guia ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "14px 0",
            background: marca.rosa,
            color: marca.branco,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {guia}
        </div>
      ) : null}

      <AbsoluteFill style={{ padding: 96, opacity: entra }}>
        <div
          style={{
            flexGrow: 1,
            border: `2px dashed ${marca.linha}`,
            borderRadius: marca.raio.arte,
            background: "rgba(255,255,255,0.55)",
            boxShadow: marca.sombra.painel,
            padding: 72,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: marca.azul,
              }}
            >
              {rotulo}
            </div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                color: m.apoio,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {restam}s
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 56 }}>
            <div
              style={{
                fontSize: 180,
                fontWeight: 500,
                letterSpacing: "-6.3px",
                lineHeight: 0.9,
                color: marca.linha,
              }}
            >
              {cena}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 12 }}>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 500,
                  letterSpacing: "-2.24px",
                  lineHeight: 1.15,
                  maxWidth: 1080,
                }}
              >
                {titulo}
              </div>
              {detalhe ? (
                <div
                  style={{
                    fontSize: 28,
                    letterSpacing: "-0.98px",
                    lineHeight: 1.5,
                    color: m.apoio,
                    maxWidth: 1080,
                  }}
                >
                  {detalhe}
                </div>
              ) : null}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* a barra anda a cada frame: e o que separa "lacuna" de "travou" */}
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: marca.linha,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${escoa * 100}%`,
                  background: marca.azul,
                  opacity: 0.55,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 24,
                letterSpacing: "-0.84px",
                color: m.apoio,
              }}
            >
              {origem}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
