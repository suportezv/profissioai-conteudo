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
import { UI } from "../whatsapp";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import {
  CabecalhoDash,
  Cursor,
  GraficoDash,
  MolduraDash,
  TILES,
  TabelaDash,
  TileDash,
  dash,
} from "./Painel";

/**
 * Cena 01 do case Yooper: o problema, que nao e falta de dado.
 *
 * 8,9 s. Toca a **segunda metade** da locucao da cena 01: a primeira frase,
 * "toda agencia de midia entrega dashboard", ficou na abertura, onde a imagem
 * mostra a entrega acontecendo. O arquivo foi partido em 2,5 s, no silencio
 * entre as duas frases.
 *
 * ## Os tempos saem das marcas de palavra, nao da tabela do roteiro
 *
 * Scribe no arquivo original, menos os 2,5 s que ficaram na abertura, mais o
 * atraso de 0,3 s da entrada: "O dado esta la" 0,56 · "atualizado" 1,98 ·
 * "completo" 2,84 · "mas" 3,96 · "habilidades diferentes" 6,02.
 *
 * O painel passa a **construir enquanto a narracao o descreve**: ele entra no
 * corte, o grafico se desenha, a tabela preenche, e so entao a voz diz "o dado
 * esta la, atualizado, completo". Na versao anterior ele ja estava pronto
 * antes da frase, e a frase virava legenda do que a tela mostrava.
 *
 * ## Por que o painel e cinza
 *
 * O dashboard e do cliente, nao nosso: ele vive na paleta neutra do
 * `Painel.tsx` e **o azul da marca so entra no lettering**. Alem de nao
 * confundir produto de terceiro com produto nosso, um painel monocromatico
 * lê como correto e inerte, que e exatamente a tese da cena: o dado esta
 * certo e nao produz decisao.
 *
 * ## O cursor para, e e ele que conta a historia
 *
 * Ele percorre os cartoes e a tabela e **estanca** em "mas", o instante em que
 * a narracao vira. Nada explode, nada fica vermelho: o problema desta cena nao
 * e erro, e inercia, e inercia se mostra com movimento que cessa.
 *
 * ## O que sobe no fim e a pergunta, nao um campo de busca
 *
 * A versao anterior subia um campo vazio com cursor piscando. O usuario leu
 * como ilustracao fraca, e ele tem razao: um campo de busca fala de
 * **interface**, e a frase da narracao fala de **decisao**. Campo vazio diz
 * "ninguem digitou", que nao e o problema; o problema e que a pergunta que a
 * pessoa realmente tem nao esta no painel.
 *
 * Entao o que aparece e a pergunta, escrita como alguem pensa: "eu aumento o
 * investimento em prospeccao ou nao?". O painel atras esta completo e correto
 * e **nao responde aquilo**, que e exatamente a distancia que o filme inteiro
 * trata e que a cena 09 fecha.
 *
 * ## Tela recriada
 *
 * Nenhum print de cliente entra na peca e nenhum numero do painel e um numero
 * que o filme reivindica. A legenda "tela recriada, dados ilustrativos" existia
 * embaixo do painel e **saiu a pedido do usuario em 22/set**: ela pesava na
 * peca e a ressalva cabe melhor no formulario escrito, que e onde ha espaco
 * para explicar. A regra de nao usar print de cliente continua valendo.
 */

export const CENA01_FRAMES = s(8.9);
const AUDIO_EM = s(0.3);
const m = modos.claro;

const PAINEL_EM = s(0.15);
const GRAFICO_EM = s(0.5);
const TABELA_EM = s(0.95);
const CURSOR_EM = s(1.3);
const ATUALIZADO_EM = s(1.98);
const COMPLETO_EM = s(2.84);
/** "mas": o cursor estanca e o painel recua. */
const PARA_EM = s(3.96);
const PERGUNTA_EM = s(4.35);
const TESE_EM = s(6.02);

const PAINEL_L = 240;
const PAINEL_T = 128;

/** O caminho do ponteiro, em coordenadas de tela. Termina parado. */
const CAMINHO: [number, number][] = [
  [430, 760],
  [560, 430],
  [900, 430],
  [1240, 448],
  [1180, 690],
  [860, 726],
  [828, 742],
];

const posCursor = (f: number) => {
  const t = interpolate(f, [CURSOR_EM, PARA_EM], [0, CAMINHO.length - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const i = Math.min(Math.floor(t), CAMINHO.length - 2);
  const p = t - i;
  // desacelera dentro de cada trecho: ponteiro de gente nao anda linear
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  return [
    interpolate(e, [0, 1], [CAMINHO[i][0], CAMINHO[i + 1][0]]),
    interpolate(e, [0, 1], [CAMINHO[i][1], CAMINHO[i + 1][1]]),
  ];
};

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();

  const painel = passo(f, PAINEL_EM, PAINEL_EM + 14);
  const recua = passo(f, PARA_EM, PARA_EM + s(0.8));
  const grafico = passo(f, GRAFICO_EM, GRAFICO_EM + s(1.1));
  const tabela = passo(f, TABELA_EM, TABELA_EM + s(1.0));
  const atualizado = passo(f, ATUALIZADO_EM, ATUALIZADO_EM + s(0.5));
  const completo = passo(f, COMPLETO_EM, COMPLETO_EM + s(0.6));
  const cursor = janela(f, CURSOR_EM, CENA01_FRAMES, 8, 0) * (1 - recua * 0.9);
  const [cx, cy] = posCursor(f);

  const pergunta = janela(f, PERGUNTA_EM, CENA01_FRAMES, 12, 0);
  const tese = janela(f, TESE_EM, CENA01_FRAMES, 12, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-01b.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: painel * (1 - recua * 0.84),
          transform: `scale(${interpolate(painel, [0, 1], [0.965, 1])})`,
        }}
      >
        <div style={{ position: "absolute", left: PAINEL_L, top: PAINEL_T }}>
          <MolduraDash largura={1440}>
            <CabecalhoDash aceso={atualizado} />
            <div style={{ display: "flex", gap: 20 }}>
              {TILES.map((t, i) => (
                <TileDash
                  key={t.rotulo}
                  t={t}
                  o={passo(f, PAINEL_EM + i * 2, PAINEL_EM + i * 2 + 10)}
                  marcado={completo > 0.5}
                />
              ))}
            </div>
            <GraficoDash desenha={grafico} altura={172} />
            <TabelaDash preenche={tabela} />
          </MolduraDash>
        </div>
      </AbsoluteFill>

      {cursor > 0.01 ? <Cursor x={cx} y={cy} o={cursor} /> : null}

      {/* o veu, e ele nao e acabamento: sem ele o lettering cai em cima da
          tabela e as duas camadas viram ruido. O painel precisa continuar
          legivel como textura e ilegivel como texto. */}
      {pergunta > 0.001 ? (
        <AbsoluteFill
          style={{ background: "rgba(244,246,249,0.80)", opacity: pergunta }}
        />
      ) : null}

      {/* a pergunta que o painel nao responde, e a tese */}
      {pergunta > 0.001 ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 56,
          }}
        >
          <div
            style={{
              fontSize: 54,
              fontWeight: 400,
              letterSpacing: "-1.89px",
              lineHeight: 1.3,
              textAlign: "center",
              color: m.apoio,
              maxWidth: 1240,
              ...entra(pergunta, 18),
            }}
          >
            “então, eu aumento o investimento
            <br />
            em prospecção ou não?”
          </div>

          {tese > 0.001 ? (
            <div
              style={{
                fontSize: 72,
                fontWeight: 500,
                letterSpacing: "-2.52px",
                lineHeight: 1.16,
                textAlign: "center",
                ...entra(tese, 20),
              }}
            >
              Ler um dado e <span style={{ color: marca.azul }}>decidir</span> com ele
              <br />
              são duas habilidades diferentes.
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      <Sfx som="assenta" em={PAINEL_EM + 8} volume={0.22} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} som="tique" em={PAINEL_EM + i * 2} volume={0.06} />
      ))}
      <Sfx som="tique" em={ATUALIZADO_EM} volume={0.09} />
      <Sfx som="apaga" em={PARA_EM} volume={0.18} />
      <Sfx som="pop" em={PERGUNTA_EM} volume={0.16} />
    </AbsoluteFill>
  );
};
