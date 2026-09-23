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
import { useFormato } from "../formato";
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

/**
 * A mesma cena no 9:16, que e outra geometria e nao a de cima reduzida.
 *
 * - **Ato 1 vira vertical.** O cartao nasce no alto, o fio desce dele ate o
 *   topo do codigo na tampa e o aparelho grande fica centrado embaixo. O
 *   pouso continua saindo de `afimNaTampa` com a escala da foto, entao o
 *   codigo cai no emissor da foto em qualquer tamanho.
 * - **A fileira continua uma fileira so**, de ponta a ponta da margem, porque
 *   e a leitura de prateleira que diz "toda unidade". Cinco de 180 px; o
 *   codigo em cada tampa fica do tamanho que ele ja tinha no 16:9.
 * - **As mensagens sobem em escada**, cada uma pendurada no fio por um
 *   risco: quatro mensagens nao cabem lado a lado em 1080 px, e a escada
 *   guarda as duas leituras do 16:9, o tempo andando para a direita e a
 *   ultima cortada pela borda. A borda de cima nao serve para cortar, porque
 *   ali fica a interface do app.
 */
const G_L_V = 240;
const G_T_V = 800;
const G_W_V = 600;
const G_TAM_V = 280;
/** Centro horizontal do codigo na tampa, onde o fio desce. */
const CODIGO_X_V = G_L_V + G_W_V * (233 / 449);
const PLANA_V = afimPlana(Math.round(CODIGO_X_V - G_TAM_V / 2), 300);
const NA_TAMPA_V = afimNaTampa(G_TAM_V, G_L_V, G_T_V, G_W_V);
/** Topo da etiqueta achatada (~51 px de altura neste tamanho). */
const CODIGO_TOPO_V = alturaDoCodigo(G_T_V, G_W_V) - 28;

/** Cinco de 180 com 9 de folga: a foto ja tem margem transparente. */
const P_W_V = 180;
const P_GAP_V = 9;
const P_L_V = 72;
const P_T_V = 1010;
const P_TAM_V = 106;
const FIO_CONV_V = 880;

/** A escada: x e topo de cada mensagem no 9:16. A ultima passa da borda. */
const MENSAGENS_V = [
  { x: 100, y: 740 },
  { x: 240, y: 605 },
  { x: 390, y: 470 },
  { x: 760, y: 335 },
];
/** Altura de uma mensagem (data mais balao), de onde o risco desce. */
const MSG_ALT_V = 113;

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();
  const { vertical, W, H, M, seguro } = useFormato();
  const pw = vertical ? P_W_V : P_W;
  const pgap = vertical ? P_GAP_V : P_GAP;
  const pl = vertical ? P_L_V : P_L;
  const pt = vertical ? P_T_V : P_T;
  const ptam = vertical ? P_TAM_V : P_TAM;
  const fconv = vertical ? FIO_CONV_V : FIO_CONV;

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

  const matriz = vertical
    ? afimEntre(PLANA_V, NA_TAMPA_V, funde)
    : afimEntre(PLANA, NA_TAMPA, funde);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      {/* Duas faixas, e a divisão é a correção da pronúncia da marca.

          "A Polishop" era a **terceira** frase de um bloco longo, e a voz
          declina ao longo de um parágrafo: a palavra saía num registro mais
          grave que o da cena 02, que é a aprovada. Mesma causa e mesmo
          conserto da cena 06. A `09a` é o arquivo antigo cortado no silêncio
          entre as orações, então as duas primeiras frases continuam sendo
          exatamente o take já aprovado; só a frase da marca é nova, e ela
          nasce em início de fala. */}
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-09a.mp3")} />
      </Sequence>
      <Sequence from={FECHO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-09b.mp3")} />
      </Sequence>

      {/* ato 1: o fio encontra o aparelho e os dois se fundem */}
      {ato1 > 0.004 ? (
        <AbsoluteFill style={{ opacity: ato1 }}>
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            {vertical ? (
              <line
                x1={CODIGO_X_V}
                y1={560}
                x2={CODIGO_X_V}
                y2={560 + (CODIGO_TOPO_V - 560) * fio}
                stroke={marca.azul}
                strokeWidth="2"
              />
            ) : (
              <line
                x1={460}
                y1={FIO_Y}
                x2={460 + (CODIGO_L - 460) * fio}
                y2={FIO_Y}
                stroke={marca.azul}
                strokeWidth="2"
              />
            )}
          </svg>

          {aparelho > 0.001 ? (
            <Airfryer
              esq={vertical ? G_L_V : G_L}
              topo={vertical ? G_T_V : G_T}
              larg={vertical ? G_W_V : G_W}
              o={aparelho}
              sobe={(1 - aparelho) * 26}
            />
          ) : null}

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: vertical ? G_TAM_V : G_TAM,
              height: vertical ? G_TAM_V : G_TAM,
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
            <QR tamanho={(vertical ? G_TAM_V : G_TAM) * 0.84} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ato 2: a prateleira, e a conversa que nao acaba no quadro */}
      {ato2 > 0.004 ? (
        <AbsoluteFill style={{ opacity: ato2 }}>
          {/* o fio unico, que sai pela direita */}
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: P_N }).map((_, i) => {
              const cx = pl + i * (pw + pgap) + pw / 2;
              const abre = passo(
                f,
                CONVERSA_EM + i * 3,
                CONVERSA_EM + i * 3 + 12,
              );
              return (
                <path
                  key={i}
                  d={`M ${cx} ${pt + 30} C ${cx} ${fconv + 60}, ${cx} ${fconv + 40}, ${cx + 0} ${fconv}`}
                  fill="none"
                  stroke={marca.azul}
                  strokeWidth="2"
                  opacity={abre}
                />
              );
            })}
            <line
              x1={pl + pw / 2}
              y1={fconv}
              x2={pl + pw / 2 + (W - pl - pw / 2) * passo(f, CONVERSA_EM, CONVERSA_EM + s(2.6))}
              y2={fconv}
              stroke={marca.azul}
              strokeWidth="2"
            />
            {/* no 9:16 cada mensagem da escada pende do fio por um risco */}
            {vertical
              ? MENSAGENS_V.map((p, i) => {
                  const em = CONVERSA_EM + s(0.7) + i * s(0.42);
                  const o = passo(f, em, em + 11);
                  return o < 0.004 ? null : (
                    <line
                      key={i}
                      x1={p.x + 24}
                      y1={p.y + MSG_ALT_V}
                      x2={p.x + 24}
                      y2={p.y + MSG_ALT_V + (fconv - p.y - MSG_ALT_V) * o}
                      stroke={marca.azul}
                      strokeWidth="2"
                      opacity={0.5}
                    />
                  );
                })
              : null}
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
                  left: vertical ? MENSAGENS_V[i].x : msg.x,
                  top: vertical ? MENSAGENS_V[i].y : FIO_CONV - 118,
                  ...entra(o, 12),
                }}
              >
                <div
                  style={{
                    fontSize: vertical ? 30 : 19,
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
                    padding: vertical ? "15px 22px" : "12px 18px",
                    fontFamily: UI,
                    fontSize: vertical ? 34 : 21,
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
            const esq = pl + i * (pw + pgap);
            return (
              <div key={i} style={{ opacity: o }}>
                <Airfryer esq={esq} topo={pt} larg={pw} sobe={(1 - o) * 16} />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: ptam,
                    height: ptam,
                    background: marca.branco,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transformOrigin: "0 0",
                    transform: css(afimNaTampa(ptam, esq, pt, pw)),
                  }}
                >
                  <QR tamanho={ptam * 0.84} />
                </div>
              </div>
            );
          })}

          {/* a regua da prateleira */}
          <div
            style={{
              position: "absolute",
              // no 9:16 a regua vai de margem a margem em vez de sobrar 40 px
              left: vertical ? M : P_L - 40,
              top: pt + pw * AF_RAZAO + 10,
              width:
                (vertical ? W - 2 * M : P_N * P_W + (P_N - 1) * P_GAP + 80) *
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
                left: vertical ? M : P_L,
                top: pt + pw * AF_RAZAO + (vertical ? 60 : 54),
                display: "flex",
                gap: 16,
                // no 9:16 os tres riscados em corpo 40 quebram em duas linhas,
                // fora da coluna de botoes do app
                flexWrap: vertical ? "wrap" : undefined,
                maxWidth: vertical ? W - M - seguro.direita : undefined,
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
                      padding: vertical ? "14px 26px" : "12px 24px",
                      fontSize: vertical ? 40 : 26,
                      letterSpacing: vertical ? "-1.4px" : "-0.91px",
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
            padding: vertical
              ? `${seguro.topo}px ${M}px ${H - seguro.base}px`
              : "0 120px",
            gap: vertical ? 56 : 40,
            ...entra(fecho, 20),
          }}
        >
          <Img
            src={staticFile("marca-polishop/polishop.png")}
            style={{ width: vertical ? 380 : 260, opacity: passo(f, FECHO_EM, FECHO_EM + 10) }}
          />
          <div
            style={{
              fontSize: vertical ? 96 : 64,
              fontWeight: 500,
              letterSpacing: vertical ? "-3.36px" : "-2.24px",
              lineHeight: 1.18,
              // no 9:16, 870 px quebra em "ja esta levando / essa inovacao /
              // para a linha fitness", tres linhas de peso parecido
              maxWidth: vertical ? 870 : 1400,
              opacity: passo(f, FECHO_EM + s(0.7), FECHO_EM + s(1.0)),
            }}
          >
            já está levando essa inovação
            <br />
            para a linha{" "}
            <span
              style={{
                color: marca.azul,
                opacity: passo(f, FECHO_EM + s(2.66), FECHO_EM + s(2.88)),
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
            // no 9:16 o centro e o da faixa segura, nao o do quadro
            paddingTop: vertical ? seguro.topo : undefined,
            paddingBottom: vertical ? H - seguro.base : undefined,
          }}
        >
          {/* No 9:16 as duas marcas empilham e a regua deita: lado a lado
              elas so caberiam em 380 px cada, menores que no 16:9. */}
          <div
            style={{
              display: "flex",
              flexDirection: vertical ? "column" : undefined,
              alignItems: "center",
              gap: vertical ? 80 : 96,
              transform: `translateY(${interpolate(assina, [0, 1], [14, 0])}px)`,
            }}
          >
            <Img
              src={staticFile("marca-polishop/polishop.png")}
              style={{ width: vertical ? 520 : 400, display: "block" }}
            />
            <div
              style={{
                width: vertical ? 200 : 1,
                height: vertical ? 1 : 150,
                background: marca.linha,
              }}
            />
            <Img
              src={staticFile("marca/profissio-ai-escuro.svg")}
              style={{ width: vertical ? 540 : 430, height: "auto", display: "block" }}
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
