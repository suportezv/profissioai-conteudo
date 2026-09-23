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
import { useFormato } from "../formato";
import { Cabecalho } from "./Cabecalho";
import { QR, geoPorta, menuTam } from "./QR";
import { Airfryer, afimNaTampa, afimPlana, afimEntre, css } from "./Airfryer";

/**
 * Cena 02 do case Polishop: a tentativa de 2023, que não funcionou.
 *
 * 15,2 s. Locução de 14,02 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "Polishop" 0,58 · "problema" 2,20 ·
 * "Em 2023" 3,16 · "imprimiu um QR code" 4,22 · "no próprio aparelho" 5,40 ·
 * "a tecnologia da época" 6,98 · "chatbot de receitas prontas" 8,94 ·
 * "sem conversa de verdade" 11,08 · "o engajamento não veio" 12,94.
 *
 * ## Esta cena existe inteira porque o fracasso é o melhor material do case
 *
 * Um case que só se elogia soa igual a todos os outros. Este tem uma primeira
 * tentativa que não deu certo, e contá-la faz três coisas: dá estrutura de
 * virada em vez de lista de recursos, explica por que o resultado de 2026 não
 * é sorte, e compra a confiança de quem está julgando.
 *
 * ## O QR é impresso, então ele tem que ser visto sendo impresso
 *
 * O código nasce como um cartão plano, que é como um QR existe num arquivo, e
 * em 5,85 s **desce e deita na tampa do aparelho**, ganhando a perspectiva da
 * foto. A narração diz "imprimiu um QR code no próprio aparelho": até a
 * revisão de 23/set/2026 a tela mostrava o cartão e a frase "impresso no
 * aparelho" escrita embaixo, que é legenda e não prova. **O aparelho estava
 * sendo descrito em vez de mostrado.**
 *
 * A matriz do pouso sai de `afimNaTampa`, medida nos quatro cantos da tampa, e
 * a legenda sai de cena quando o adesivo pousa: repetir por escrito o que a
 * imagem acabou de mostrar é o defeito que a peça estava corrigindo.
 *
 * ## O QR nasce aqui e **não sai da tela**
 *
 * Depois de colado ele fica, na posição que vai ocupar também na cena 03. É o
 * que torna a virada legível sem lettering: na cena seguinte **o aparelho e o
 * adesivo não se mexem e o que está atrás deles é substituído**, que é
 * exatamente o que a narração diz, "manteve a porta e trocou o motor". As
 * coordenadas moram no `QR.tsx` e no `Airfryer.tsx` para as duas cenas não
 * divergirem na primeira revisão.
 *
 * ## O menu numerado é o contraexemplo que todo brasileiro reconhece
 *
 * Mesmo device que fechou a cena técnica do case da EITA. Ninguém precisa que
 * lhe expliquem o que é um chatbot ruim: basta ver "digite 1", "digite 2" e o
 * campo que só aceita número. É informação que a narração não carrega.
 *
 * ## A linha de engajamento deita, não cai
 *
 * Cair seria drama e seria outra afirmação: o projeto não desabou, ele **nunca
 * subiu**. A curva sobe um pouco no lançamento e fica rente ao chão, que é o
 * que "o engajamento não veio" quer dizer. Ela desceu para baixo do painel do
 * navegador quando o aparelho ocupou a coluna da esquerda.
 */

export const CENA02_FRAMES = s(15.0);
const AUDIO_EM = s(0.4);
const m = modos.claro;

const LOGO_EM = s(0.58);
const ANO_EM = s(2.9);
const QR_EM = s(4.22);
const AF_EM = s(5.3);
const COLA_EM = s(5.85);
const COLA_DUR = s(0.9);
const MOTOR_EM = s(8.6);
const MENU_EM = s(9.0);
const SEM_CONVERSA_EM = s(11.08);
const LINHA_EM = s(12.94);

/** O menu que todo bot de 2023 tinha, e que a linha nova não tem. */
const MENU = [
  "1 · Batata frita",
  "2 · Frango grelhado",
  "3 · Legumes assados",
  "4 · Voltar ao início",
];

/** A curva do engajamento: sobe pouco no lançamento e fica rente ao chão. */
const CURVA = [0.05, 0.42, 0.68, 0.51, 0.3, 0.19, 0.13, 0.1, 0.08, 0.07, 0.06, 0.05];

export const Cena02: React.FC = () => {
  const f = useCurrentFrame();
  // no 9:16 a cena empilha: cabecalho, motor, e o aparelho embaixo com o fio
  // subindo ate o soquete. A geometria mora no `QR.tsx`, dividida com a 03.
  const { vertical, W, H } = useFormato();
  const g = geoPorta(vertical);
  const mt = menuTam(vertical);
  const PLANA = afimPlana(g.qrL, g.qrT);
  const NA_TAMPA = afimNaTampa(g.qrTam, g.afL, g.afT, g.afW);
  const [ax, ay] = g.fioA;
  const [bx, by] = g.fioB;
  // a curva do engajamento: embaixo do painel no 16:9, a esquerda do aparelho
  // no 9:16, na coluna que fica livre ao lado dele
  const cw = vertical ? 470 : 520;

  const logo = janela(f, LOGO_EM, CENA02_FRAMES, 12, 0);
  const ano = janela(f, ANO_EM, CENA02_FRAMES, 10, 0);
  const qr = janela(f, QR_EM, CENA02_FRAMES, 12, 0);
  const aparelho = passo(f, AF_EM, AF_EM + s(0.8));
  // o cartao se desfaz enquanto o codigo deita na tampa
  const cola = passo(f, COLA_EM, COLA_EM + COLA_DUR);
  const cartao = 1 - passo(f, COLA_EM, COLA_EM + s(0.45));
  const fio = passo(f, COLA_EM + COLA_DUR, MOTOR_EM);
  const motor = janela(f, MOTOR_EM, CENA02_FRAMES, 12, 0);
  const desenha = passo(f, LINHA_EM, LINHA_EM + s(1.4));
  const linha = janela(f, LINHA_EM, CENA02_FRAMES, 10, 0);

  const matriz = afimEntre(PLANA, NA_TAMPA, cola);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-02.mp3")} />
      </Sequence>

      {/* A marca entra na palavra: "A Polishop ja tinha atacado esse problema".
          O bloco inteiro vem do `Cabecalho`, que a cena 03 tambem usa: ele
          atravessa o corte entre as duas e por isso nao pode existir em duas
          copias. O ano fica com o odometro parado no 3, e nao escrito como
          texto, para o corte nao perder o kerning do par "23". */}
      <Cabecalho
        logo={entra(logo, 14)}
        estilo={entra(ano, 16)}
        rola={0}
        velho={1}
        novo={0}
      />

      {/* o aparelho sobe para receber o codigo */}
      {aparelho > 0.001 ? (
        <Airfryer
          esq={g.afL}
          topo={g.afT}
          larg={g.afW}
          o={aparelho}
          sobe={(1 - aparelho) * 34}
        />
      ) : null}

      {/* A etiqueta: um elemento so, do cartao plano ate a tampa.
          A placa branca com folga em volta nao e enfeite, e o que faz o
          codigo ler como etiqueta impressa: sem a zona de silencio, um QR
          denso sobre plastico preto vira uma mancha escura. A sombra e a
          borda saem quando ele pousa, porque adesivo colado nao flutua. */}
      {qr > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: g.qrTam,
            height: g.qrTam,
            background: marca.branco,
            borderRadius: 12,
            border: `1px solid ${cola > 0.6 ? "transparent" : marca.linha}`,
            boxShadow: cola > 0.6 ? "none" : marca.sombra.painel,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "0 0",
            transform: css(matriz),
            opacity: qr,
          }}
        >
          <QR tamanho={g.qrTam * 0.84} revela={passo(f, QR_EM, QR_EM + s(0.9))} />
        </div>
      ) : null}

      {/* o fio do adesivo para o que ha atras dele */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        <line
          x1={ax}
          y1={ay}
          x2={ax + (bx - ax) * fio}
          y2={ay + (by - ay) * fio}
          stroke={marca.linha}
          strokeWidth="1"
        />
      </svg>

      {/* o motor de 2023: uma pagina web com menu numerado */}
      {motor > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: g.motorL,
            top: g.motorT,
            width: g.motorW,
            // no 9:16 a altura e fixa e igual a da cena 03, onde o painel e
            // desmontado: no 16:9 a altura natural ja batia com a de la
            height: vertical ? g.painelAlt : undefined,
            background: marca.branco,
            border: `1px solid ${marca.linha}`,
            borderRadius: marca.raio.painel,
            boxShadow: marca.sombra.painel,
            overflow: "hidden",
            ...entra(motor, 20),
          }}
        >
          {/* barra de navegador: e o que diz "isto e uma pagina, nao um app" */}
          <div
            style={{
              background: "#EDEFF3",
              borderBottom: `1px solid ${marca.linha}`,
              padding: mt.barra,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {["#D9DDE4", "#D9DDE4", "#D9DDE4"].map((c, i) => (
              <div
                key={i}
                style={{ width: mt.ponto, height: mt.ponto, borderRadius: mt.ponto / 2, background: c }}
              />
            ))}
            <div
              style={{
                flex: 1,
                marginLeft: 12,
                background: marca.branco,
                borderRadius: 8,
                padding: mt.urlPad,
                fontFamily: UI,
                fontSize: mt.url,
                color: "#8A93A1",
              }}
            >
              assistente de receitas
            </div>
          </div>

          <div style={{ padding: mt.pad, display: "flex", flexDirection: "column", gap: mt.gap }}>
            <div style={{ fontFamily: UI, fontSize: mt.titulo, color: "#4A5364" }}>
              Escolha uma opção:
            </div>
            {MENU.map((item, i) => {
              const o = passo(f, MENU_EM + i * 4, MENU_EM + i * 4 + 10);
              return (
                <div
                  key={item}
                  style={{
                    border: `1px solid ${marca.linha}`,
                    borderRadius: mt.itemRaio,
                    padding: mt.itemPad,
                    fontFamily: UI,
                    fontSize: mt.item,
                    color: "#4A5364",
                    ...entra(o, 8),
                  }}
                >
                  {item}
                </div>
              );
            })}

            {/* o campo que so aceita numero: e o "sem conversa de verdade" */}
            <div
              style={{
                marginTop: 6,
                border: `1px dashed ${marca.linha}`,
                borderRadius: mt.itemRaio,
                padding: mt.itemPad,
                fontFamily: UI,
                fontSize: mt.campo,
                color: "#A7AEBA",
                opacity: janela(f, SEM_CONVERSA_EM, CENA02_FRAMES, 10, 0),
              }}
            >
              digite o número da opção
            </div>
          </div>
        </div>
      ) : null}

      {/* o engajamento que nunca subiu */}
      {linha > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: vertical ? 72 : g.motorL,
            top: vertical ? 1240 : undefined,
            bottom: vertical ? undefined : 96,
            width: cw,
            ...entra(linha, 16),
          }}
        >
          <svg width={cw} height="130">
            <path
              d={CURVA.map((v, i) => {
                const x = (i / (CURVA.length - 1)) * cw;
                const y = 122 - v * 106;
                return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
              }).join(" ")}
              fill="none"
              stroke={marca.rosa}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={900}
              strokeDashoffset={900 * (1 - desenha)}
            />
            <line x1="0" y1="122" x2={cw} y2="122" stroke={marca.linha} strokeWidth="1" />
          </svg>
          <div
            style={{
              marginTop: 10,
              fontSize: vertical ? 40 : 28,
              letterSpacing: vertical ? "-1.4px" : "-0.98px",
              color: marca.rosa,
              opacity: interpolate(desenha, [0.7, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            o engajamento não veio
          </div>
        </div>
      ) : null}

      <Sfx som="tique" em={QR_EM} volume={0.08} />
      <Sfx som="surge" em={AF_EM} volume={0.12} />
      <Sfx som="assenta" em={COLA_EM + COLA_DUR} volume={0.26} />
      <Sfx som="surge" em={MOTOR_EM} volume={0.16} />
      {MENU.map((item, i) => (
        <Sfx key={item} som="tique" em={MENU_EM + i * 4} volume={0.05} />
      ))}
      <Sfx som="apaga" em={LINHA_EM} volume={0.18} />
    </AbsoluteFill>
  );
};
