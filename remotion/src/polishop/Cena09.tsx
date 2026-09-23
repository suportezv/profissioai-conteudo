import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { QR } from "./QR";

/**
 * Cena 09 do case Polishop: o aprendizado, e a assinatura.
 *
 * 15,7 s. Locução de 12,82 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "Um QR code impresso na fábrica" 0,46 ·
 * "transforma um produto na prateleira" 2,46 · "em uma conversa que continua"
 * 5,76 · "Sem campanha, sem e-mail, sem lembrete" 6,92 · "levando esse modelo
 * para a linha seguinte" 9,64.
 *
 * ## A terceira e última aparição do QR
 *
 * Ele abriu a tentativa de 2023, atravessou a virada de 2025 sem se mexer, e
 * fecha aqui. **É o objeto do filme**, e é o que permite o fecho não precisar
 * de lettering explicando a tese: a linha que sai dele sai do quadro, e
 * "conversa que continua" vira uma imagem em vez de uma frase.
 *
 * ## Os três riscados dizem o que isso substitui
 *
 * Campanha, e-mail e lembrete são o que uma marca normalmente precisa para o
 * cliente voltar. Riscados, eles dizem que o custo de reengajamento deste
 * modelo é zero, que é o aprendizado que a própria Polishop declarou e o
 * motivo de estarem levando para a linha seguinte.
 *
 * ## A assinatura declara o que falta
 *
 * A arte final da Polishop não chegou. Desenhar uma aproximação da marca do
 * anunciante é pior que assumir que ela falta, então o lockup carrega a caixa
 * tracejada. As duas assinam sobre faixa escura, porque é ali que a versão
 * branca da Profissio existe e é o que uma coautoria pede: as duas na mesma
 * condição.
 */

export const CENA09_FRAMES = s(15.7);
const AUDIO_EM = s(0.4);
const m = modos.claro;

const QR_EM = s(0.5);
const LINHA_EM = s(2.5);
const CONTINUA_EM = s(5.5);
const RISCOS_EM = s(6.9);
const SEGUINTE_EM = s(9.6);
const ASSINA_EM = s(12.9);

const RISCOS = ["sem campanha", "sem e-mail", "sem lembrete"];

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();

  const qr = janela(f, QR_EM, ASSINA_EM, 12, 10);
  const corre = passo(f, LINHA_EM, LINHA_EM + s(2.6));
  const continua = janela(f, CONTINUA_EM, ASSINA_EM, 11, 10);
  const riscos = janela(f, RISCOS_EM, ASSINA_EM, 10, 10);
  const seguinte = janela(f, SEGUINTE_EM, ASSINA_EM, 11, 10);
  const assina = janela(f, ASSINA_EM, CENA09_FRAMES, 12, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-09.mp3")} />
      </Sequence>

      {qr > 0.001 ? (
        <>
          {/* a linha que sai do quadro: "uma conversa que continua" */}
          <div
            style={{
              position: "absolute",
              left: 430,
              top: 536,
              width: 1490 * corre,
              height: 2,
              background: marca.azul,
              opacity: qr * 0.9,
            }}
          />
          <div style={{ position: "absolute", left: 120, top: 396, ...entra(qr, 18) }}>
            <div
              style={{
                background: marca.branco,
                border: `1px solid ${marca.linha}`,
                borderRadius: marca.raio.painel,
                boxShadow: marca.sombra.painel,
                padding: 24,
              }}
            >
              <QR tamanho={232} />
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 23,
                letterSpacing: "-0.8px",
                color: m.apoio,
                maxWidth: 280,
                lineHeight: 1.35,
              }}
            >
              impresso na fábrica
            </div>
          </div>

          {continua > 0.001 ? (
            <div
              style={{
                position: "absolute",
                left: 470,
                top: 300,
                maxWidth: 1180,
                fontSize: 60,
                fontWeight: 500,
                letterSpacing: "-2.1px",
                lineHeight: 1.18,
                ...entra(continua, 18),
              }}
            >
              Um produto na prateleira vira
              <br />
              <span style={{ color: marca.azul }}>uma conversa que continua.</span>
            </div>
          ) : null}

          {riscos > 0.001 ? (
            <div
              style={{
                position: "absolute",
                left: 470,
                top: 596,
                display: "flex",
                gap: 16,
                ...entra(riscos, 14),
              }}
            >
              {RISCOS.map((r, i) => {
                const risca = passo(f, RISCOS_EM + i * 7, RISCOS_EM + i * 7 + 12);
                return (
                  <div
                    key={r}
                    style={{
                      position: "relative",
                      border: `1px solid ${marca.linha}`,
                      background: marca.branco,
                      borderRadius: 999,
                      padding: "12px 24px",
                      fontSize: 26,
                      letterSpacing: "-0.91px",
                      color: m.apoio,
                    }}
                  >
                    {r}
                    <div
                      style={{
                        position: "absolute",
                        left: 16,
                        right: 16,
                        top: "50%",
                        height: 2,
                        background: marca.rosa,
                        transformOrigin: "left",
                        transform: `scaleX(${risca})`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          {seguinte > 0.001 ? (
            <div
              style={{
                position: "absolute",
                left: 470,
                top: 716,
                fontSize: 30,
                letterSpacing: "-1.05px",
                color: m.apoio,
                borderTop: "1px solid rgba(16,18,24,0.22)",
                paddingTop: 20,
                maxWidth: 1180,
                ...entra(seguinte, 14),
              }}
            >
              e a Polishop já está levando o modelo para a linha seguinte
            </div>
          ) : null}
        </>
      ) : null}

      {assina > 0.001 ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            ...entra(assina, 20),
          }}
        >
          <div
            style={{
              background: marca.tinta,
              borderRadius: marca.raio.arte,
              boxShadow: marca.sombra.painel,
              padding: "64px 100px",
              display: "flex",
              alignItems: "center",
              gap: 86,
            }}
          >
            {/* a arte final da Polishop nao chegou: a lacuna fica escrita */}
            <div
              style={{
                border: "2px dashed rgba(255,255,255,0.35)",
                borderRadius: marca.raio.painel,
                padding: "26px 38px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 500,
                  letterSpacing: "-2.1px",
                  color: marca.branco,
                }}
              >
                Polishop
              </div>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: marca.apoioEscuro,
                }}
              >
                arte final a receber
              </div>
            </div>

            <div style={{ width: 1, height: 130, background: "rgba(255,255,255,0.22)" }} />

            <Img
              src={staticFile("marca/profissio-ai-branco.svg")}
              style={{ width: 430, height: "auto", display: "block" }}
            />
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="tique" em={QR_EM} volume={0.08} />
      {RISCOS.map((r, i) => (
        <Sfx key={r} som="apaga" em={RISCOS_EM + i * 7} volume={0.12} />
      ))}
      <Sfx som="surge" em={ASSINA_EM} volume={0.2} />
    </AbsoluteFill>
  );
};
