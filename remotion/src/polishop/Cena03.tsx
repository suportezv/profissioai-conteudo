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
import { wa, UI } from "../whatsapp";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { QR, QR_L, QR_T, QR_TAM, MOTOR_L, MOTOR_T, MOTOR_W } from "./QR";

/**
 * Cena 03 do case Polishop: a virada. **É a cena do filme.**
 *
 * 15,9 s. Locução de 14,68 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "Em outubro de 2025" 0,48 · "manteve a
 * porta" 2,28 · "trocou o seu motor" 3,22 · "O mesmo QR code" 4,68 · "abrindo
 * uma conversa" 5,86 · "no WhatsApp" 7,06 · "AI Chef" 7,94 · "treinado nos
 * produtos da marca" 11,00 · "Sem baixar nada, sem cadastro" 13,10.
 *
 * ## A cena abre exatamente onde a anterior fechou
 *
 * O QR e o painel de 2023 entram já montados, nas mesmas coordenadas, porque
 * **a continuidade é o argumento**. A narração diz "manteve a porta e trocou o
 * motor", e a tela faz literalmente isso: em 2,28 s a porta acende e não se
 * mexe; em 3,22 s o que está atrás dela se desfaz; em 7,06 s outra coisa
 * cresce no mesmo retângulo.
 *
 * Trocar o layout junto com o motor destruiria a leitura: seria só uma cena
 * nova depois de outra cena. O que faz a virada existir é **o que fica parado**.
 *
 * ## O painel antigo se desfaz para cima, o novo cresce do centro
 *
 * Duas saídas diferentes de propósito. O antigo sobe e desbota, como algo que
 * foi retirado; o novo cresce a partir do meio do mesmo retângulo, como algo
 * que foi instalado ali. Se os dois usassem fade, o espectador leria uma
 * transição de slide.
 *
 * ## O que o agente diz na primeira mensagem
 *
 * Ele nomeia o aparelho. É a prova de personalização mais barata que existe e
 * a mais convincente, e é o que separa este agente do chatbot da cena
 * anterior. **O modelo exato do produto está pendente do cliente**, então a
 * frase cita a linha e não uma capacidade em litros.
 */

export const CENA03_FRAMES = s(15.9);
const AUDIO_EM = s(0.4);
const m = modos.claro;

const PORTA_EM = s(2.28);
const SAI_MOTOR_EM = s(3.22);
const ENTRA_ZAP_EM = s(7.06);
const NOME_EM = s(7.94);
const MSG_EM = s(9.3);
const RESPOSTA_EM = s(11.4);
const CHIPS_EM = s(13.1);

const CHIPS = ["sem baixar nada", "sem cadastro", "sem aprender aplicativo"];

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();

  // a porta acende e nao se mexe: e o elemento que atravessa as duas cenas
  const acende = passo(f, PORTA_EM, PORTA_EM + s(0.6));
  const anel = janela(f, PORTA_EM, PORTA_EM + s(2.2), 8, 20);
  // o motor antigo sobe e desbota; o novo cresce do centro do mesmo retangulo
  const saiMotor = passo(f, SAI_MOTOR_EM, SAI_MOTOR_EM + s(1.0));
  const zap = janela(f, ENTRA_ZAP_EM, CENA03_FRAMES, 12, 0);
  const nome = passo(f, NOME_EM, NOME_EM + s(0.4));
  const msg = janela(f, MSG_EM, CENA03_FRAMES, 10, 0);
  const resposta = janela(f, RESPOSTA_EM, CENA03_FRAMES, 10, 0);
  const chips = janela(f, CHIPS_EM, CENA03_FRAMES, 10, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-03.mp3")} />
      </Sequence>

      <div style={{ position: "absolute", left: 120, top: 118 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
          }}
        >
          A virada
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 96,
            fontWeight: 500,
            letterSpacing: "-3.36px",
            lineHeight: 1,
          }}
        >
          2025
        </div>
      </div>

      {/* a porta: mesma posicao da cena 02, e ela nao se mexe */}
      <div style={{ position: "absolute", left: QR_L, top: QR_T }}>
        <div
          style={{
            position: "relative",
            background: marca.branco,
            border: `1px solid ${acende > 0.5 ? marca.azul : marca.linha}`,
            borderRadius: marca.raio.painel,
            boxShadow: acende > 0.5 ? marca.sombra.azul : marca.sombra.painel,
            padding: 26,
          }}
        >
          <QR tamanho={QR_TAM} />
          {/* o anel que passa uma vez: diz "esta e a mesma porta" */}
          {anel > 0.01 ? (
            <div
              style={{
                position: "absolute",
                inset: -14,
                border: `2px solid ${marca.azul}`,
                borderRadius: marca.raio.painel + 12,
                opacity: anel,
                transform: `scale(${interpolate(anel, [0, 1], [1.06, 1])})`,
              }}
            />
          ) : null}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            letterSpacing: "-0.84px",
            color: acende > 0.5 ? marca.azul : m.apoio,
            maxWidth: QR_TAM + 52,
          }}
        >
          o mesmo QR code
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: QR_L + QR_TAM + 52,
          top: QR_T + 26 + QR_TAM / 2,
          width: MOTOR_L - (QR_L + QR_TAM + 52),
          height: 1,
          background: acende > 0.5 ? marca.azul : marca.linha,
        }}
      />

      {/* o motor de 2023 saindo */}
      {saiMotor < 0.999 ? (
        <div
          style={{
            position: "absolute",
            left: MOTOR_L,
            top: MOTOR_T,
            width: MOTOR_W,
            height: 420,
            background: marca.branco,
            border: `1px solid ${marca.linha}`,
            borderRadius: marca.raio.painel,
            boxShadow: marca.sombra.painel,
            opacity: 1 - saiMotor,
            transform: `translateY(${saiMotor * -46}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: UI,
            fontSize: 21,
            color: "#A7AEBA",
          }}
        >
          Escolha uma opção: 1, 2, 3 ou 4
        </div>
      ) : null}

      {/* o motor novo crescendo no mesmo retangulo */}
      {zap > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: MOTOR_L,
            top: MOTOR_T,
            width: MOTOR_W,
            background: wa.fundoChat,
            borderRadius: marca.raio.arte,
            overflow: "hidden",
            boxShadow: marca.sombra.painel,
            opacity: zap,
            transform: `scale(${interpolate(zap, [0, 1], [0.86, 1])})`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              background: wa.barra,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* avatar do A.IChef pendente do cliente: circulo de acento */}
            <div style={{ width: 46, height: 46, borderRadius: 23, background: wa.verde }} />
            <div style={{ fontFamily: UI, fontSize: 23, color: wa.texto, opacity: nome }}>
              A.IChef
            </div>
          </div>

          <div
            style={{
              padding: 24,
              // a coluna acompanha o conteudo: alta demais ela abre um
              // retangulo preto vazio por cima das mensagens
              height: 230,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            {msg > 0.001 ? (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: 620,
                  background: wa.balaoEntrada,
                  borderRadius: 18,
                  borderTopLeftRadius: 5,
                  padding: "14px 18px",
                  fontFamily: UI,
                  fontSize: 22,
                  color: wa.texto,
                  lineHeight: 1.4,
                  ...entra(msg, 12),
                }}
              >
                Oi! Sou o A.IChef. Vi que você tem uma Air Fryer iChef. O que
                vamos fazer hoje?
              </div>
            ) : null}
            {resposta > 0.001 ? (
              <div
                style={{
                  alignSelf: "flex-end",
                  background: wa.balaoSaida,
                  borderRadius: 18,
                  borderTopRightRadius: 5,
                  padding: "13px 17px",
                  fontFamily: UI,
                  fontSize: 22,
                  color: wa.texto,
                  ...entra(resposta, 12),
                }}
              >
                acabei de tirar da caixa
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* o que o canal dispensa */}
      {chips > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: 120,
            bottom: 108,
            display: "flex",
            gap: 14,
            ...entra(chips, 14),
          }}
        >
          {CHIPS.map((c, i) => (
            <div
              key={c}
              style={{
                border: `1px solid ${marca.linha}`,
                background: marca.branco,
                borderRadius: 999,
                padding: "12px 22px",
                fontSize: 24,
                letterSpacing: "-0.84px",
                color: m.apoio,
                opacity: passo(f, CHIPS_EM + i * 5, CHIPS_EM + i * 5 + 10),
              }}
            >
              {c}
            </div>
          ))}
        </div>
      ) : null}

      <Sfx som="assenta" em={PORTA_EM} volume={0.24} />
      <Sfx som="apaga" em={SAI_MOTOR_EM} volume={0.2} />
      <Sfx som="surge" em={ENTRA_ZAP_EM} volume={0.22} />
      <Sfx som="recebido" em={MSG_EM} volume={0.18} />
      <Sfx som="pop" em={RESPOSTA_EM} volume={0.16} />
      {CHIPS.map((c, i) => (
        <Sfx key={c} som="tique" em={CHIPS_EM + i * 5} volume={0.06} />
      ))}
    </AbsoluteFill>
  );
};
