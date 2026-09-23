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
import { wa, UI } from "../whatsapp";
import { janela, entra, passo, s, SUAVE } from "../anim";
import { Sfx } from "../Sfx";
import {
  QR,
  QR_TAM,
  MOTOR_L,
  MOTOR_T,
  MOTOR_W,
  FIO_Y,
  FIO_L,
  SOQUETE_Y,
} from "./QR";
import { Airfryer, AF_L, AF_T, AF_W, afimNaTampa, css } from "./Airfryer";
import { Cabecalho } from "./Cabecalho";
import { AvatarChef } from "./Conversa";

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
 * O aparelho, o adesivo na tampa e o painel de 2023 entram já montados, nas
 * mesmas coordenadas, porque **a continuidade é o argumento**. A narração diz
 * "manteve a porta e trocou o motor", e a tela faz literalmente isso: a porta
 * acende e não se mexe, o que está atrás dela é desmontado, e outra coisa é
 * instalada no mesmo soquete.
 *
 * Trocar o layout junto com o motor destruiria a leitura: seria só uma cena
 * nova depois de outra cena. O que faz a virada existir é **o que fica parado**.
 *
 * ## A transição foi refeita em 23/set/2026, e o defeito era tempo morto
 *
 * A versão anterior desbotava o painel antigo em 3,22 s e fazia o novo crescer
 * em 7,06 s. **Entre os dois havia quase quatro segundos com o lado direito
 * vazio**, e o usuário leu exatamente isso: "estática e monótona, pouco
 * caprichada". Fade de saída mais fade de entrada não é uma virada, é um
 * corte de slide com espera no meio.
 *
 * O que ficou no lugar tem quatro tempos encadeados, e nenhum deles é espera:
 *
 * 1. **O ano vira no odômetro** (0,48 s). A cena abre com o "2023" da cena
 *    anterior e o último dígito rola 3 → 4 → 5. É a evolução dita na unidade
 *    mais barata que existe, e é o que emenda os dois planos: o corte deixa de
 *    ser "outra cena" e passa a ser "o mesmo quadro, dois anos depois".
 * 2. **O motor antigo é desmontado, não apagado** (3,22 s). Os itens do menu
 *    somem de baixo para cima, um a um, e só então a moldura se fecha na
 *    horizontal até virar um soquete de 3 px. Desmontar é o que faz o
 *    espectador entender que o lugar continua existindo.
 * 3. **O fio pulsa enquanto o soquete está vazio** (4,68 s). O ponto viaja do
 *    adesivo até o soquete e chega repetidamente; é o device de grafo da
 *    gramática da casa, e aqui ele tem função: diz que a porta continua
 *    alimentando alguma coisa enquanto a troca acontece.
 * 4. **O motor novo é instalado a partir do soquete** (7,06 s). Ele abre na
 *    vertical a partir da mesma linha, em vez de crescer do centro: o que
 *    cresce do centro aparece, o que abre do soquete foi **encaixado ali**.
 *
 * ## O que o agente diz na primeira mensagem
 *
 * Ele nomeia o aparelho. É a prova de personalização mais barata que existe e
 * a mais convincente, e é o que separa este agente do chatbot da cena
 * anterior. **O modelo exato do produto está pendente do cliente**, então a
 * frase cita a linha e não uma capacidade em litros.
 */

export const CENA03_FRAMES = s(15.7);
const AUDIO_EM = s(0.4);
const m = modos.claro;

const ANO_EM = s(0.48);
const PORTA_EM = s(2.28);
const DESMONTA_EM = s(3.22);
const SOQUETE_EM = s(4.5);
const PULSO_EM = s(4.68);
const ABRE_EM = s(5.86);
const ENTRA_ZAP_EM = s(7.06);
const NOME_EM = s(7.94);
const MSG_EM = s(9.3);
const RESPOSTA_EM = s(11.4);
const CHIPS_EM = s(13.1);

const CHIPS = ["sem baixar nada", "sem cadastro", "sem aprender aplicativo"];
const MENU = [
  "1 · Batata frita",
  "2 · Frango grelhado",
  "3 · Legumes assados",
  "4 · Voltar ao início",
];

const NA_TAMPA = afimNaTampa(QR_TAM, AF_L, AF_T, AF_W);

/** Altura do painel antigo, e a do soquete dentro dele. */
const PAINEL_ALT = SOQUETE_Y - MOTOR_T + 245;
const ZAP_ALT = 356;

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();

  // o ano rola: a cena abre no 2023 da cena anterior
  const rola = passo(f, ANO_EM + s(0.28), ANO_EM + s(1.1));
  // **O rótulo antigo sai inteiro antes de o ano rolar.** Ele e o novo dividiam
  // a mesma linha do tempo, e "A primeira tentativa" é longo: ele cruzava a
  // virada do dígito por trás, quebrado em duas linhas porque o bloco pai tem a
  // largura do ano. O usuário viu exatamente isso, "um elemento alheio que polui
  // visualmente a transição". Agora os três tempos são separados e nenhum dos
  // dois rótulos quebra linha.
  const rotuloVelho = 1 - passo(f, ANO_EM, ANO_EM + s(0.26));
  const rotuloNovo = passo(f, ANO_EM + s(1.0), ANO_EM + s(1.3));

  // a porta acende e nao se mexe: e o elemento que atravessa as duas cenas
  const acende = passo(f, PORTA_EM, PORTA_EM + s(0.6));
  const anel = janela(f, PORTA_EM, PORTA_EM + s(2.2), 8, 20);

  // o motor antigo e desmontado peca por peca, depois a moldura se fecha
  const fecha = passo(f, DESMONTA_EM + s(0.7), SOQUETE_EM);
  // o miolo sai antes da moldura se fechar: texto espremido pelo scaleY le
  // como defeito de render, nao como peca sendo retirada
  const esvazia = 1 - passo(f, DESMONTA_EM + s(0.55), DESMONTA_EM + s(0.85));
  const soquete = passo(f, SOQUETE_EM, SOQUETE_EM + s(0.3));
  // "abrindo uma conversa": a moldura do motor novo abre do soquete, vazia
  const moldura = passo(f, ABRE_EM, ABRE_EM + s(0.7));

  // o pulso viaja o fio enquanto o soquete espera o motor novo
  const pulsando = f > PULSO_EM && f < ENTRA_ZAP_EM + s(0.3);
  const ciclo = ((f - PULSO_EM) % s(1.15)) / s(1.15);
  const pulso = interpolate(ciclo, [0, 1], [0, 1], { easing: SUAVE });

  const zap = passo(f, ENTRA_ZAP_EM, ENTRA_ZAP_EM + s(0.55));
  const nome = passo(f, NOME_EM, NOME_EM + s(0.4));
  const msg = janela(f, MSG_EM, CENA03_FRAMES, 10, 0);
  const resposta = janela(f, RESPOSTA_EM, CENA03_FRAMES, 10, 0);
  const chips = janela(f, CHIPS_EM, CENA03_FRAMES, 10, 0);

  const corFio = acende > 0.5 ? marca.azul : marca.linha;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-03.mp3")} />
      </Sequence>

      {/* `entra(1, …)` parece inofensivo e nao e: a cena 02 aplica `entra` no
          bloco e ele deixa um `filter: blur(0px)`, que cria camada propria e
          muda o antialias do texto. Sem a mesma chamada aqui, o corte troca o
          desenho das letras. Passar os dois pelo mesmo caminho e o que iguala. */}
      <Cabecalho
        logo={entra(1, 14)}
        estilo={entra(1, 16)}
        rola={rola}
        velho={rotuloVelho}
        novo={rotuloNovo}
      />

      {/* a porta: mesmo aparelho, mesmo adesivo, mesmo pixel da cena 02 */}
      <Airfryer esq={AF_L} topo={AF_T} larg={AF_W} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: QR_TAM,
          height: QR_TAM,
          background: marca.branco,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "0 0",
          transform: css(NA_TAMPA),
        }}
      >
        <QR tamanho={QR_TAM * 0.84} />
      </div>
      {/* o anel que passa uma vez: diz "esta e a mesma porta".
          O anel mora *dentro* do elemento ja deitado na tampa, porque um
          `scale` depois da matriz escalaria a partir do canto superior
          esquerdo e o anel sairia deslocado do adesivo. */}
      {anel > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: QR_TAM,
            height: QR_TAM,
            transformOrigin: "0 0",
            transform: css(NA_TAMPA),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -16,
              border: `6px solid ${marca.azul}`,
              opacity: anel,
              transform: `scale(${interpolate(anel, [0, 1], [1.1, 1])})`,
            }}
          />
        </div>
      ) : null}

      {/* o fio, e o pulso que viaja nele enquanto o soquete espera */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        <line
          x1={FIO_L}
          y1={FIO_Y}
          x2={MOTOR_L}
          y2={SOQUETE_Y}
          stroke={corFio}
          strokeWidth="1"
        />
        {pulsando ? (
          <circle
            cx={FIO_L + (MOTOR_L - FIO_L) * pulso}
            cy={FIO_Y + (SOQUETE_Y - FIO_Y) * pulso}
            r={5}
            fill={marca.azul}
            opacity={interpolate(ciclo, [0, 0.08, 0.86, 1], [0, 1, 1, 0])}
          />
        ) : null}
      </svg>

      {/* o motor de 2023 sendo desmontado peca por peca */}
      {fecha < 0.999 ? (
        <div
          style={{
            position: "absolute",
            left: MOTOR_L,
            top: MOTOR_T,
            width: MOTOR_W,
            height: PAINEL_ALT,
            background: marca.branco,
            border: `1px solid ${marca.linha}`,
            borderRadius: marca.raio.painel,
            boxShadow: marca.sombra.painel,
            overflow: "hidden",
            transformOrigin: `0px ${SOQUETE_Y - MOTOR_T}px`,
            transform: `scaleY(${1 - fecha})`,
            opacity: interpolate(fecha, [0.7, 1], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              background: "#EDEFF3",
              borderBottom: `1px solid ${marca.linha}`,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: esvazia,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: "#D9DDE4" }} />
            ))}
            <div
              style={{
                flex: 1,
                marginLeft: 12,
                background: marca.branco,
                borderRadius: 8,
                padding: "7px 14px",
                fontFamily: UI,
                fontSize: 16,
                color: "#8A93A1",
              }}
            >
              assistente de receitas
            </div>
          </div>

          <div
            style={{
              padding: 30,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: esvazia,
            }}
          >
            <div style={{ fontFamily: UI, fontSize: 21, color: "#4A5364" }}>
              Escolha uma opção:
            </div>
            {MENU.map((item, i) => {
              // de baixo para cima: o ultimo item da lista sai primeiro
              const em = DESMONTA_EM + (MENU.length - 1 - i) * 4;
              const some = passo(f, em, em + 9);
              return (
                <div
                  key={item}
                  style={{
                    border: `1px solid ${marca.linha}`,
                    borderRadius: 10,
                    padding: "14px 18px",
                    fontFamily: UI,
                    fontSize: 21,
                    color: "#4A5364",
                    opacity: 1 - some,
                    transform: `translateX(${some * 34}px)`,
                  }}
                >
                  {item}
                </div>
              );
            })}
            <div
              style={{
                marginTop: 6,
                border: `1px dashed ${marca.linha}`,
                borderRadius: 10,
                padding: "14px 18px",
                fontFamily: UI,
                fontSize: 20,
                color: "#A7AEBA",
                opacity: 1 - passo(f, DESMONTA_EM, DESMONTA_EM + 9),
              }}
            >
              digite o número da opção
            </div>
          </div>
        </div>
      ) : null}

      {/* o soquete: o lugar continua existindo enquanto o motor nao chega */}
      {soquete > 0.001 && zap < 0.7 ? (
        <div
          style={{
            position: "absolute",
            left: MOTOR_L,
            top: SOQUETE_Y - 1,
            width: MOTOR_W,
            height: 3,
            borderRadius: 2,
            background: marca.azul,
            opacity: soquete * (1 - zap) * (0.5 + 0.5 * Math.abs(Math.cos(ciclo * Math.PI))),
            boxShadow: `0 0 26px ${marca.azul}`,
          }}
        />
      ) : null}

      {/* "abrindo uma conversa": a moldura abre do soquete antes do conteudo.
          Sem ela o soquete fica sozinho por dois segundos e meio, que e o
          mesmo tempo morto que esta revisao existe para eliminar. */}
      {moldura > 0.001 && zap < 0.999 ? (
        <div
          style={{
            position: "absolute",
            left: MOTOR_L,
            top: SOQUETE_Y - ZAP_ALT / 2,
            width: MOTOR_W,
            height: ZAP_ALT,
            border: `1px solid ${marca.azul}`,
            borderRadius: marca.raio.arte,
            transformOrigin: "center center",
            transform: `scaleY(${interpolate(moldura, [0, 1], [0.01, 1])})`,
            opacity: moldura * (1 - zap),
          }}
        />
      ) : null}

      {/* o motor novo, instalado dentro da moldura que ja abriu */}
      {zap > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: MOTOR_L,
            top: SOQUETE_Y - ZAP_ALT / 2,
            width: MOTOR_W,
            height: ZAP_ALT,
            background: wa.fundoChat,
            borderRadius: marca.raio.arte,
            overflow: "hidden",
            boxShadow: marca.sombra.painel,
            transformOrigin: "center center",
            transform: `scale(${interpolate(zap, [0, 1], [0.97, 1])})`,
            opacity: zap,
          }}
        >
          <div
            style={{
              background: wa.barra,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: zap,
            }}
          >
            <AvatarChef tam={46} />
            <div style={{ fontFamily: UI, fontSize: 23, color: wa.texto, opacity: nome }}>
              AIChef
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
                Oi! Sou o AIChef. Vi que você tem uma Air Fryer AIChef. O que
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

      {/* o que o canal dispensa, embaixo do painel a que se referem */}
      {chips > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: MOTOR_L,
            top: SOQUETE_Y + ZAP_ALT / 2 + 48,
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

      <Sfx som="tique" em={ANO_EM} volume={0.1} />
      <Sfx som="assenta" em={ANO_EM + s(1.1)} volume={0.2} />
      <Sfx som="assenta" em={PORTA_EM} volume={0.24} />
      {MENU.map((item, i) => (
        <Sfx
          key={item}
          som="tique"
          em={DESMONTA_EM + (MENU.length - 1 - i) * 4}
          volume={0.05}
        />
      ))}
      <Sfx som="apaga" em={SOQUETE_EM - s(0.3)} volume={0.2} />
      <Sfx som="surge" em={ENTRA_ZAP_EM} volume={0.22} />
      <Sfx som="recebido" em={MSG_EM} volume={0.18} />
      <Sfx som="pop" em={RESPOSTA_EM} volume={0.16} />
      {CHIPS.map((c, i) => (
        <Sfx key={c} som="tique" em={CHIPS_EM + i * 5} volume={0.06} />
      ))}
    </AbsoluteFill>
  );
};
