import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { wa, UI } from "./whatsapp";
import { Balao3D, type Ancora } from "./Balao3D";
import { passo, s } from "./anim";
import { montaDigitacao, textoEm, toques, type Rascunho } from "./digitacao";
import { Sfx } from "./Sfx";
import { useFormato } from "./formato";

/**
 * Cena 01 do case: a mensagem que nunca e enviada.
 *
 * 8 s sobre plano filmado. Alguem com o celular na mao, luz de abajur, escreve
 * um desabafo, hesita, **apaga**, escreve outro, apaga, escreve um terceiro e
 * para. O campo fica ali com o cursor piscando. Nada e enviado, e ninguem
 * responde.
 *
 * E uma troca de conceito, nao de acabamento. A versao anterior mandava a
 * mensagem e ela ficava com um check: dizia "escreveu e nao foi entregue".
 * Esta diz outra coisa, e mais dura: **nem chegou a mandar**. A narracao que
 * entra depois ("e a maioria nunca manda pra ninguem") passa a ter imagem.
 *
 * Por isso aqui nao existe balao de saida nem check: o que aparece e o **campo
 * de digitacao**, que e onde o texto mora antes de virar mensagem.
 *
 * O ritmo e rapido de proposito. Quem precisa desabafar digita com urgencia e
 * apaga mais rapido ainda. Os numeros ficam em `digitacao.ts`.
 */

export const CENA01_FRAMES = s(8);

/**
 * Onde o display esta no quadro, medido no frame do clipe.
 *
 * O celular deste plano fica embaixo e a direita. O x recua do centro do
 * display (1342) para 1180 porque o campo tem ~1050 px: ancorado no display
 * ele encostaria na borda direita. Conferido com `scripts/confere_margem.py`.
 */
const ANCORA: Ancora = { x: 1180, y: 830 };

/**
 * O mesmo plano no 9:16, recortado numa janela vertical que pega o abajur em
 * cima e o celular embaixo (a janela comeca em 72% da folga horizontal do
 * bruto, ou seja x 946 a 1553 no quadro original).
 *
 * **A ancora foi remedida no quadro recortado**, nos quadros de 0,1 a 0,9 s
 * (a janela em que o campo levanta): no 9:16 o display atravessa o quadro na
 * diagonal, e no eixo vertical do quadro (x 540) a tela passa em y ~790. **A
 * ancora nao e esse ponto**: a subida e rapida e o `translateZ` depois do
 * `rotateX` puxa o campo para cima, entao no primeiro quadro visivel (f4) ele
 * ja esta ~175 px acima da ancora. A ancora foi acertada renderizando, para o
 * campo nascer em cima da tela e nao no bokeh acima dela. O campo tem 780 px,
 * que a perspectiva e a deriva levam a ~940 no fim: centrado, dentro das margens.
 */
const FOCO_VERTICAL = "72% 50%";
const ANCORA_VERTICAL: Ancora = { x: 540, y: 965 };
/**
 * No 9:16 o campo sobe menos: o display ja esta no meio do quadro, e subir
 * os 210 px do 16:9 o levaria para o alto da faixa segura.
 */
const SOBE_VERTICAL = 150;

const LEVANTA_INI = s(0.1);
const LEVANTA_FIM = s(0.9);

/** Os rascunhos, em ordem. O ultimo nao e apagado: fica sem ser enviado. */
const RASCUNHOS: Rascunho[] = [
  { texto: "não estou bem", hesita: 0.55, pausa: 0.2 },
  { texto: "preciso falar com alguém", hesita: 0.6, pausa: 0.22 },
  { texto: "não sei mais o que fazer", hesita: 0, apaga: false },
];

const { trechos, total } = montaDigitacao(RASCUNHOS, 1.0);

/** Os toques saem da mesma linha do tempo que desenha o texto. */
const TOQUES = toques(trechos);

/** O campo de digitacao do WhatsApp, recriado. Nenhuma tela real entra aqui. */
const CampoDigitacao: React.FC<{
  texto: string;
  cursor: boolean;
  /** Largura do campo com o botao; no 9:16 ela cabe entre as margens. */
  largura?: number;
}> = ({ texto, cursor, largura = 940 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      width: largura,
    }}
  >
    <div
      style={{
        flexGrow: 1,
        minHeight: 96,
        borderRadius: 48,
        background: wa.barra,
        display: "flex",
        alignItems: "center",
        padding: "0 34px",
        fontFamily: UI,
        fontSize: 42,
        color: texto ? wa.texto : wa.apoio,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {texto || "Mensagem"}
      {cursor ? (
        <span style={{ color: wa.verde, marginLeft: 2, fontWeight: 300 }}>|</span>
      ) : null}
    </div>
    {/* o botao de enviar existe e nunca e tocado: e o ponto da cena */}
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 48,
        background: wa.verde,
        opacity: 0.55,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="42" height="42" viewBox="0 0 24 24">
        <path d="M2 21 L23 12 L2 3 L2 10 L17 12 L2 14 Z" fill={wa.fundoChat} />
      </svg>
    </div>
  </div>
);

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical } = useFormato();
  const seg = f / fps;

  const { texto, digitando } = textoEm(trechos, seg);
  // o cursor pisca quando a mao para; digitando, ele fica aceso
  const cursorAceso = digitando || Math.floor(f / 14) % 2 === 0;

  const levanta = passo(f, LEVANTA_INI, LEVANTA_FIM);
  const deriva = passo(f, 0, CENA01_FRAMES);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src={staticFile("broll/mood-07-audio-maos.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...(vertical ? { objectPosition: FOCO_VERTICAL } : {}),
        }}
      />

      {/* o quarto fecha nas bordas para o campo ter onde respirar */}
      <AbsoluteFill
        style={{
          background: vertical
            ? "radial-gradient(1000px 1500px at 50% 55%, transparent 40%, rgba(0,0,0,0.72) 100%)"
            : "radial-gradient(1500px 1000px at 52% 52%, transparent 40%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      <Balao3D
        levanta={levanta}
        ancora={vertical ? ANCORA_VERTICAL : ANCORA}
        deriva={deriva}
        opacidade={passo(f, LEVANTA_INI, LEVANTA_INI + 8)}
        sobe={vertical ? SOBE_VERTICAL : undefined}
      >
        <CampoDigitacao
          texto={texto}
          cursor={cursorAceso}
          largura={vertical ? 780 : undefined}
        />
      </Balao3D>

      {/* o campo saindo da tela */}
      <Sfx som="surge" em={LEVANTA_INI} volume={0.22} />

      {/* cada tecla, colada no caractere que aparece ou some */}
      {TOQUES.map((t, i) => (
        <Sfx
          key={i}
          som={t.apagando ? "apaga" : "tecla"}
          em={t.seg * 30}
          volume={t.apagando ? 0.16 : 0.2}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Quanto tempo a digitacao ocupa, para a cena conferir que cabe. */
export const CENA01_DIGITACAO_SEG = total;
