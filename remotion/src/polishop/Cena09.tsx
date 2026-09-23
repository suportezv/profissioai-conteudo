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
import { UI } from "../whatsapp";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { QR } from "./QR";
import {
  Airfryer,
  AF_RAZAO,
  afimNaTampa,
  afimPlana,
  afimEntre,
  alturaDoCodigo,
  css,
} from "./Airfryer";

/**
 * Cena 09 do case Polishop: o aprendizado, e a assinatura.
 *
 * 15,7 s. Locução de 11,80 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "Um QR code" 0,48 · "impresso na fábrica"
 * 1,28 · "transforma" 2,34 · "um produto" 2,88 · "na prateleira" 3,50 · "em
 * uma conversa" 4,06 · "continua" 4,90 · "Sem campanha" 6,18 · "sem e-mail"
 * 6,98 · "sem lembrete" 7,56 · "A Polishop" 8,80 · "essa inovação" 10,32 ·
 * "para a linha" 10,90 · "fitness" 11,36.
 *
 * ## A faixa foi escolhida entre oito takes, por duas medidas
 *
 * A pronúncia de "Polishop" aqui foi recusada três vezes, e o que separa um
 * take bom de um ruim é o **f0 mediano da palavra**: 143 Hz na faixa aprovada
 * da cena 02. A grafia não resolve, o registro resolve, e por isso a frase que
 * cita a marca começa uma oração nova. Mesmo assim o TTS varia: os oito takes
 * deste texto mediram de 97 a 172 Hz.
 *
 * A segunda medida apareceu porque o usuário ouviu **uma falha em "para a
 * linha fitness"**, e ela é reprodutível: **três dos oito takes tropeçam
 * exatamente ali** ("para a lin-para a linha", "para esse, para a linha",
 * "pra linha"). O Scribe pega todos, desde que a conferência seja de
 * **igualdade exata** da lista de palavras contra o texto pedido; comparar "o
 * texto parece certo" deixa passar.
 *
 * Este take mede **149 Hz** e transcreve palavra por palavra igual ao roteiro.
 *
 * ## A cena foi refeita em 23/set/2026, e o pedido era de ilustração
 *
 * A versão anterior punha o QR de um lado, uma linha atravessando o quadro e a
 * tese escrita em corpo 60 do outro. O usuário pediu que a linha **encontrasse
 * o aparelho e os dois se fundissem**, e que a frase "transforma um produto na
 * prateleira em uma conversa que continua" deixasse de ser lettering e
 * passasse a ser imagem. São três afirmações e cada uma virou um tempo:
 *
 * 1. **A fusão** (2,34 s). A linha alcança o aparelho, o código deixa de ser
 *    um cartão e deita na tampa. É o mesmo movimento da cena 02, e a repetição
 *    é o argumento: o que abriu o filme é o que o fecha.
 * 2. **A prateleira** (3,44 s). O aparelho vira uma fileira de cinco sobre uma
 *    régua, **todos com o mesmo código na tampa**. Isso carrega informação que
 *    a narração não carrega: o QR não é de uma campanha, é de fábrica, e está
 *    em toda unidade que sai da linha.
 * 3. **A conversa que continua** (3,96 s). De cada aparelho sobe um fio que
 *    converge num fio só, e sobre ele pousam quatro mensagens **datadas**, de
 *    out/2025 a set/2026. A última é cortada pela borda do quadro de
 *    propósito: **é o corte que diz "continua"**, não a palavra. E as datas
 *    dizem que continuar são onze meses, não força de expressão.
 *
 * ## Os três riscados dizem o que isso substitui
 *
 * Campanha, e-mail e lembrete são o que uma marca normalmente precisa para o
 * cliente voltar. Riscados, eles dizem que o custo de reengajamento deste
 * modelo é zero, que é o aprendizado que a própria Polishop declarou e o
 * motivo de estarem levando para a linha seguinte.
 *
 * ## A assinatura mudou de fundo, e isso veio do cliente
 *
 * A faixa escura saiu a pedido do usuário, que mandou seguir o padrão já usado
 * nos cases anteriores: **as duas marcas sobre o fundo claro, separadas por
 * uma régua vertical de 1 px**. A arte final da Polishop chegou em 23/set/2026,
 * então a caixa tracejada com "arte final a receber" também saiu, e no fundo
 * claro a Profissio.ai entra na versão escura.
 */

export const CENA09_FRAMES = s(15.7);
const AUDIO_EM = s(0.4);
const m = modos.claro;

const QR_EM = s(0.48);
const FIO_EM = s(1.26);
const APARELHO_EM = s(2.35);
const FUNDE_EM = s(2.9);
const PRATELEIRA_EM = s(3.5);
const CONVERSA_EM = s(4.2);
const RISCOS_EM = s(6.18);
const FECHO_EM = s(8.8);
const ASSINA_EM = s(12.5);

const RISCOS = ["sem campanha", "sem e-mail", "sem lembrete"];

/** As quatro mensagens datadas. O intervalo é o argumento, não o texto. */
const MENSAGENS = [
  { x: 470, data: "out/2025", texto: "como faço batata?" },
  { x: 830, data: "jan/2026", texto: "dá pra assar pão aqui?" },
  { x: 1190, data: "mai/2026", texto: "sobrou frango, o que faço?" },
  { x: 1720, data: "set/2026", texto: "vou receber gente hoje" },
];

/* --- geometria do ato 1: o aparelho grande e a etiqueta que deita nele --- */
const G_L = 700;
const G_T = 430;
const G_W = 320;
const G_TAM = 200;
const PLANA = afimPlana(240, 400);
const NA_TAMPA = afimNaTampa(G_TAM, G_L, G_T, G_W);
// altura do codigo no aparelho, para o fio chegar onde ele esta de fato
const FIO_Y = alturaDoCodigo(G_T, G_W);
// borda esquerda do codigo: 51,9% do centro menos metade dos 25% de largura
const CODIGO_L = G_L + G_W * (0.519 - 0.125);

/* --- geometria do ato 2: a fileira na prateleira --- */
const P_W = 150;
const P_GAP = 25;
const P_N = 5;
const P_L = 435;
const P_T = 620;
const P_TAM = 92;
const FIO_CONV = 460;

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();

  const qr = passo(f, QR_EM, QR_EM + s(0.5));
  const fio = passo(f, FIO_EM, APARELHO_EM);
  const aparelho = passo(f, APARELHO_EM, APARELHO_EM + s(0.6));
  const funde = passo(f, FUNDE_EM, FUNDE_EM + s(0.7));
  // o grande sai enquanto a fileira entra, com o do meio no mesmo eixo
  const vira = passo(f, PRATELEIRA_EM, PRATELEIRA_EM + s(0.7));
  const sai = passo(f, FECHO_EM - s(0.5), FECHO_EM);

  const ato1 = (1 - vira) * (1 - sai);
  const ato2 = vira * (1 - sai);

  const riscos = janela(f, RISCOS_EM, FECHO_EM, 10, 12);
  const fecho = janela(f, FECHO_EM, ASSINA_EM, 12, 10);
  const assina = janela(f, ASSINA_EM, CENA09_FRAMES, 12, 0);

  const matriz = afimEntre(PLANA, NA_TAMPA, funde);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-09.mp3")} />
      </Sequence>

      {/* ato 1: o fio encontra o aparelho e os dois se fundem */}
      {ato1 > 0.004 ? (
        <AbsoluteFill style={{ opacity: ato1 }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <line
              x1={460}
              y1={FIO_Y}
              x2={460 + (CODIGO_L - 460) * fio}
              y2={FIO_Y}
              stroke={marca.azul}
              strokeWidth="2"
            />
          </svg>

          {aparelho > 0.001 ? (
            <Airfryer
              esq={G_L}
              topo={G_T}
              larg={G_W}
              o={aparelho}
              sobe={(1 - aparelho) * 26}
            />
          ) : null}

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: G_TAM,
              height: G_TAM,
              background: marca.branco,
              borderRadius: 12,
              border: `1px solid ${funde > 0.6 ? "transparent" : marca.linha}`,
              boxShadow: funde > 0.6 ? "none" : marca.sombra.painel,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformOrigin: "0 0",
              transform: css(matriz),
              opacity: qr,
            }}
          >
            <QR tamanho={G_TAM * 0.84} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ato 2: a prateleira, e a conversa que nao acaba no quadro */}
      {ato2 > 0.004 ? (
        <AbsoluteFill style={{ opacity: ato2 }}>
          {/* o fio unico, que sai pela direita */}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: P_N }).map((_, i) => {
              const cx = P_L + i * (P_W + P_GAP) + P_W / 2;
              const abre = passo(
                f,
                CONVERSA_EM + i * 3,
                CONVERSA_EM + i * 3 + 12,
              );
              return (
                <path
                  key={i}
                  d={`M ${cx} ${P_T + 30} C ${cx} ${FIO_CONV + 60}, ${cx} ${FIO_CONV + 40}, ${cx + 0} ${FIO_CONV}`}
                  fill="none"
                  stroke={marca.azul}
                  strokeWidth="1"
                  opacity={abre * 0.55}
                />
              );
            })}
            <line
              x1={P_L + P_W / 2}
              y1={FIO_CONV}
              x2={P_L + P_W / 2 + (1920 - P_L - P_W / 2) * passo(f, CONVERSA_EM, CONVERSA_EM + s(2.6))}
              y2={FIO_CONV}
              stroke={marca.azul}
              strokeWidth="2"
            />
          </svg>

          {/* as quatro mensagens, com data: "continua" sao onze meses */}
          {MENSAGENS.map((msg, i) => {
            const em = CONVERSA_EM + s(0.7) + i * s(0.42);
            const o = passo(f, em, em + 11);
            if (o < 0.004) return null;
            return (
              <div
                key={msg.data}
                style={{
                  position: "absolute",
                  left: msg.x,
                  top: FIO_CONV - 118,
                  ...entra(o, 12),
                }}
              >
                <div
                  style={{
                    fontSize: 19,
                    letterSpacing: "1.4px",
                    textTransform: "uppercase",
                    color: m.apoio,
                    marginBottom: 8,
                  }}
                >
                  {msg.data}
                </div>
                <div
                  style={{
                    background: marca.branco,
                    border: `1px solid ${marca.linha}`,
                    borderRadius: 16,
                    borderBottomLeftRadius: 5,
                    padding: "12px 18px",
                    fontFamily: UI,
                    fontSize: 21,
                    color: m.tinta,
                    whiteSpace: "nowrap",
                    boxShadow: marca.sombra.painel,
                  }}
                >
                  {msg.texto}
                </div>
              </div>
            );
          })}

          {/* a fileira: o mesmo codigo em toda unidade que sai da fabrica */}
          {Array.from({ length: P_N }).map((_, i) => {
            const em = PRATELEIRA_EM + i * 3;
            const o = passo(f, em, em + 12);
            const esq = P_L + i * (P_W + P_GAP);
            return (
              <div key={i} style={{ opacity: o }}>
                <Airfryer esq={esq} topo={P_T} larg={P_W} sobe={(1 - o) * 16} />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: P_TAM,
                    height: P_TAM,
                    background: marca.branco,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transformOrigin: "0 0",
                    transform: css(afimNaTampa(P_TAM, esq, P_T, P_W)),
                  }}
                >
                  <QR tamanho={P_TAM * 0.84} />
                </div>
              </div>
            );
          })}

          {/* a regua da prateleira */}
          <div
            style={{
              position: "absolute",
              left: P_L - 40,
              top: P_T + P_W * AF_RAZAO + 10,
              width:
                (P_N * P_W + (P_N - 1) * P_GAP + 80) *
                passo(f, PRATELEIRA_EM, PRATELEIRA_EM + s(0.8)),
              height: 2,
              background: marca.linha,
            }}
          />

          {/* o que este modelo dispensa */}
          {riscos > 0.001 ? (
            <div
              style={{
                position: "absolute",
                left: P_L,
                top: P_T + P_W * AF_RAZAO + 54,
                display: "flex",
                gap: 16,
                ...entra(riscos, 14),
              }}
            >
              {RISCOS.map((r, i) => {
                const risca = passo(f, RISCOS_EM + i * s(0.69), RISCOS_EM + i * s(0.69) + 11);
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
        </AbsoluteFill>
      ) : null}

      {/* o fecho: a marca do cliente e a linha seguinte */}
      {fecho > 0.001 ? (
        <AbsoluteFill
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "0 120px",
            gap: 40,
            ...entra(fecho, 20),
          }}
        >
          <Img
            src={staticFile("marca-polishop/polishop.png")}
            style={{ width: 260, opacity: passo(f, FECHO_EM, FECHO_EM + 10) }}
          />
          <div
            style={{
              fontSize: 64,
              fontWeight: 500,
              letterSpacing: "-2.24px",
              lineHeight: 1.18,
              maxWidth: 1400,
              opacity: passo(f, FECHO_EM + s(0.7), FECHO_EM + s(1.0)),
            }}
          >
            já está levando essa inovação
            <br />
            para a linha{" "}
            <span
              style={{
                color: marca.azul,
                opacity: passo(f, FECHO_EM + s(2.56), FECHO_EM + s(2.78)),
              }}
            >
              fitness
            </span>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* a assinatura: fundo claro e regua de 1 px, o padrao dos cases */}
      {assina > 0.001 ? (
        <AbsoluteFill
          style={{
            background: modos.claro.fundo,
            alignItems: "center",
            justifyContent: "center",
            opacity: assina,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 96,
              transform: `translateY(${interpolate(assina, [0, 1], [14, 0])}px)`,
            }}
          >
            <Img
              src={staticFile("marca-polishop/polishop.png")}
              style={{ width: 400, display: "block" }}
            />
            <div style={{ width: 1, height: 150, background: marca.linha }} />
            <Img
              src={staticFile("marca/profissio-ai-escuro.svg")}
              style={{ width: 430, height: "auto", display: "block" }}
            />
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="tique" em={QR_EM} volume={0.08} />
      <Sfx som="assenta" em={FUNDE_EM + s(0.7)} volume={0.26} />
      <Sfx som="surge" em={PRATELEIRA_EM} volume={0.14} />
      {MENSAGENS.map((msg, i) => (
        <Sfx
          key={msg.data}
          som="recebido"
          em={CONVERSA_EM + s(0.7) + i * s(0.42)}
          volume={0.1}
        />
      ))}
      {RISCOS.map((r, i) => (
        <Sfx key={r} som="apaga" em={RISCOS_EM + i * s(0.69)} volume={0.12} />
      ))}
      <Sfx som="surge" em={ASSINA_EM} volume={0.2} />
    </AbsoluteFill>
  );
};
