import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Loop,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { useFormato } from "../formato";

/**
 * Cena 03 do case Soldiers: o vinculo que a marca ja tinha.
 *
 * 16 s, narracao de 11,94 s que comeca em 0,5 s. Pausas do arquivo em 5,99 /
 * 7,54 / 11,64 s, somado o atraso: 6,49 / 8,04 / 12,14.
 *
 * ## Estes clipes sao o produto, nao ilustracao dele
 *
 * O que toca aqui sao os **videos de opt-in reais**: o convite que o cliente
 * recebe no WhatsApp depois de comprar, gravado por cada influenciador. Eles ja
 * existiam e foram rebaixados do ZIP de 11,5 GB no Drive pelo
 * `zip_index_remoto.py`, que le o indice por `Range` em vez de baixar o arquivo
 * inteiro.
 *
 * ## Por que carrossel, e nao troca no lugar
 *
 * A primeira versao trocava o clipe dentro de cinco vagas fixas, com a chave do
 * React mudando a cada troca. **Isso travava o render**: cada troca desmontava
 * um video e montava outro, e remontar significa reabrir o arquivo e buscar o
 * quadro do zero, cinco vezes a cada poucos frames.
 *
 * Agora e uma **esteira**: os dezoito cartoes existem lado a lado numa faixa
 * que desliza para a esquerda, e cada video fica montado do momento em que
 * entra pela direita ate sair pela esquerda. Nenhuma remontagem, e a leitura
 * melhora junto: o olho segue o movimento em vez de levar corte no mesmo lugar.
 *
 * ## A esteira acelera e freia no lugar certo
 *
 * A curva e `bezier(0.65, 0, 0.25, 1)`: sai devagar, ganha velocidade no meio
 * e assenta no fim. Acelerar e o argumento (a base cresce), mas parar em cima
 * de um rosto especifico exige a freada, e ela nao e opcional: **a Pietra e o
 * ultimo cartao da faixa**, e a faixa termina exatamente com ela centrada.
 * Sem isso quem ficasse no centro seria sorteio.
 *
 * ## Ninguem e nomeado, menos quem fica
 *
 * Na esteira os nomes piscariam e virariam ruido, e nem todos os clipes estao
 * identificados no relatorio de decupagem. So quem para no centro leva nome.
 */

export const CENA03_FRAMES = s(16);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

/** `dura` e a duracao do arquivo em segundos, medida com ffprobe. */
type Clipe = { arq: string; de: number; dura: number };

/**
 * Os dezoito, na ordem da faixa. Os cinco primeiros sao os que abrem a cena,
 * e a **Pietra e a ultima**, porque a faixa para com o ultimo cartao centrado.
 *
 * O **MC Bin Laden abre**: e o nome de maior alcance da base, e quem entra
 * primeiro e quem o juri associa ao tamanho do time. Doze destes clipes vieram
 * do ZIP **sem faixa de audio**, entao nao ha transcricao que os identifique;
 * quem tem nome aqui foi confirmado pelo cliente, e os outros ficam anonimos de
 * proposito, porque atribuir rosto por palpite num filme de premiacao e erro
 * que nao se conserta depois.
 */
const CLIPES: Clipe[] = [
  { arq: "C0028-mc-bin-laden.mp4", de: 0, dura: 6.03 },
  { arq: "C0001-gordelas.mp4", de: s(1.2), dura: 10.11 },
  { arq: "C0002-seu-bolinha.mp4", de: s(1.5), dura: 11.6 },
  { arq: "C0027.mp4", de: s(1.0), dura: 8.61 },
  { arq: "C0021.mp4", de: s(1.0), dura: 9.8 },
  { arq: "C0008.mp4", de: 0, dura: 6 },
  { arq: "C0005-matheus-ueda.mp4", de: 0, dura: 6.03 },
  { arq: "C0009.mp4", de: 0, dura: 6 },
  { arq: "C0010.mp4", de: 0, dura: 6 },
  { arq: "C0011.mp4", de: 0, dura: 6 },
  { arq: "C0018.mp4", de: 0, dura: 6 },
  { arq: "C0019.mp4", de: 0, dura: 6 },
  { arq: "C0022.mp4", de: 0, dura: 6 },
  { arq: "C0024.mp4", de: 0, dura: 6 },
  { arq: "C0026.mp4", de: 0, dura: 6 },
  { arq: "C0029.mp4", de: 0, dura: 6 },
  { arq: "C0032.mp4", de: 0, dura: 6 },
  { arq: "C0004-pietra.mp4", de: s(2.0), dura: 17 },
];

/** Geometria da faixa, em px de 1920. Cinco cartoes preenchem a area util. */
const LARG = 320;
const VAO = 14;
const PASSO_CARTAO = LARG + VAO;
const ULTIMO = CLIPES.length - 1;

/** Onde a faixa comeca e onde ela para, com o ultimo cartao centrado. */
const FAIXA_INI = MARGEM;
const FAIXA_FIM = (1920 - LARG) / 2 - ULTIMO * PASSO_CARTAO;

const ROLA_INI = s(3.2);
const ROLA_FIM = s(8.4);
const CRESCE = s(8.5);

/**
 * Quando a voz da Pietra sobe, e por que nao pode ser quando o cartao cresce.
 *
 * Ela subia junto com o cartao, em 8,5 s, e disputava a narracao inteira. A
 * locucao da cena fecha em **12,44 s** (11,94 s de fala a partir de 0,5 s), e a
 * frase dela "E e isso" comeca em **12,48 s de cena**: o Scribe poe em 16,64 s
 * do bruto, o corte comeca em 2,16 s e o `startFrom` adianta outros 2,0 s.
 *
 * Ate la ela fica num leito audivel de 0,1, que da presenca sem competir. O
 * que vem depois e o fecho quente dela ("um super beijo, espero que a gente
 * esteja juntos"), e esse toca por cima, que e onde ele deve estar.
 */
const PIETRA_SOBE = s(12.45);

/**
 * A esteira no 9:16. Os clipes de opt-in foram gravados **em pe**, entao aqui
 * o cartao fica mais perto do formato do proprio video: 440 de largura por 990
 * de altura, dois e pouco cabendo no quadro. A faixa sangra ate as bordas (e
 * imagem, pode sangrar), a curva e os tempos sao os mesmos, e a freada termina
 * com a Pietra centrada, que cresce para 700. A pergunta desce para baixo da
 * faixa, na faixa segura, em vez de dividir a largura com o cartao.
 */
const V = {
  larg: 440,
  vao: 16,
  topo: 300,
  altura: 990,
  cresce: 700,
  perguntaY: 1318,
};
const PASSO_V = V.larg + V.vao;
const FAIXA_INI_V = 72;
const FAIXA_FIM_V = (1080 - V.larg) / 2 - ULTIMO * PASSO_V;

/** A entrada escalonada dos cinco primeiros, que e como a cena abre. */
const ENTRADAS = [s(0.8), s(1.2), s(1.6), s(2.0), s(2.4)];

/** Sai devagar, acelera, e assenta. A freada e o que deixa a Pietra no centro. */
const ROLAGEM = Easing.bezier(0.65, 0, 0.25, 1);

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();
  const { vertical, M, W, seguro } = useFormato();
  // a mesma esteira nos dois quadros; so a geometria muda
  const G = vertical
    ? {
        larg: V.larg,
        passo: PASSO_V,
        ini: FAIXA_INI_V,
        fim: FAIXA_FIM_V,
        desloca: 0,
        cresceLeft: (W - V.cresce) / 2,
        cresceLarg: V.cresce,
        limite: W + 40,
      }
    : {
        larg: LARG,
        passo: PASSO_CARTAO,
        ini: FAIXA_INI,
        fim: FAIXA_FIM,
        desloca: MARGEM,
        cresceLeft: 420,
        cresceLarg: 600,
        limite: 1680,
      };
  const rotulo = janela(f, s(0.5), CRESCE, 10, 9);
  const cresceu = passo(f, CRESCE, CRESCE + s(0.9));
  const pergunta = janela(f, s(12.2), CENA03_FRAMES, 11, 0);

  const faixaX = interpolate(f, [ROLA_INI, ROLA_FIM], [G.ini, G.fim], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ROLAGEM,
  });

  // o murmurio existe enquanto da para distinguir vozes; na parte rapida os
  // fragmentos ficariam picotados, entao ele sai
  const murmurio = interpolate(f, [s(4.4), s(5.2)], [0.06, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // a Pietra so sobe quando a narracao acaba (ver PIETRA_SOBE)
  const vozPietra = interpolate(
    f,
    [CRESCE, CRESCE + s(0.5), PIETRA_SOBE, PIETRA_SOBE + s(0.4)],
    [0.06, 0.1, 0.1, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-03.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          // no 9:16 a faixa sangra pelas laterais; so a sobrelinha tem margem
          padding: vertical
            ? `${seguro.topo}px 0 ${1920 - V.topo - V.altura}px`
            : MARGEM,
        }}
      >
        <div
          style={{
            marginLeft: vertical ? M : 0,
            fontSize: vertical ? 30 : 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: rotulo,
            // 220 + a linha de 30 px + 44 poe a faixa em V.topo
            marginBottom: vertical ? 44 : 30,
          }}
        >
          Quem já falava com o cliente
        </div>

        {/* a faixa e recortada: sem isso o cartao que espera a vez vaza para
            a margem e aparece antes do primeiro entrar */}
        <div style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}>
          {CLIPES.map((c, i) => {
            const fim = i === ULTIMO;
            const x = faixaX - G.desloca + i * G.passo;

            // quem cresce sai da faixa e assume o centro da area util
            const left = fim ? interpolate(cresceu, [0, 1], [x, G.cresceLeft]) : x;
            const larg = fim
              ? interpolate(cresceu, [0, 1], [G.larg, G.cresceLarg])
              : G.larg;

            // fora da faixa nao monta: segura o custo do render e garante que
            // nada seja desenhado onde o recorte nao alcanca
            if (left > G.limite || left + larg < -40) return null;

            // os cinco primeiros entram escalonados, que e como a cena abre.
            // **Os outros ficam invisiveis ate a esteira andar**: com opacidade
            // fixa em 1 eles apareciam parados na borda direita antes de o
            // primeiro cartao sequer existir.
            const entrada =
              i < ENTRADAS.length
                ? janela(f, ENTRADAS[i], CENA03_FRAMES, 11, 0)
                : passo(f, ROLA_INI - 4, ROLA_INI + 4);
            const some = fim ? 1 : 1 - cresceu;
            if (some <= 0.001) return null;

            return (
              <div
                key={c.arq}
                style={{
                  position: "absolute",
                  left,
                  width: larg,
                  top: 0,
                  bottom: 0,
                  transform: `translateY(${interpolate(entrada, [0, 1], [26, 0])}px)`,
                  opacity: entrada * some,
                  zIndex: fim ? 2 : 1,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: marca.raio.painel,
                    overflow: "hidden",
                    boxShadow:
                      fim && cresceu > 0.5
                        ? marca.sombra.azul
                        : marca.sombra.painel,
                    position: "relative",
                    background: marca.tinta,
                  }}
                >
                  {/* A maioria dos clipes tem 6 s e a cena tem 16: sem o laco,
                      o video acabava e o cartao ficava parado no ultimo quadro,
                      que lia como foto. O laco recomeca do ponto de corte. */}
                  <Loop
                    durationInFrames={s(c.dura) - c.de - 2}
                    layout="none"
                  >
                    <OffthreadVideo
                      src={staticFile("soldiers/" + c.arq)}
                      startFrom={c.de}
                      volume={fim ? Math.max(murmurio, vozPietra) : murmurio}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Loop>
                </div>
              </div>
            );
          })}

          {/* a pergunta da cena, no espaco que o cartao centralizado deixou */}
          {pergunta > 0.001 && !vertical ? (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                width: "26%",
                fontSize: 40,
                fontWeight: 500,
                letterSpacing: "-1.4px",
                lineHeight: 1.28,
                opacity: pergunta,
                filter: `blur(${(1 - pergunta) * 6}px)`,
                // o -50% da centralizacao e a entrada dividem o mesmo transform
                transform: `translateY(calc(-50% + ${(1 - pergunta) * 18}px))`,
              }}
            >
              E se essa pessoa continuasse por perto{" "}
              <span style={{ color: marca.azul }}>depois da venda?</span>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      {/* no 9:16 a pergunta mora embaixo da faixa, longe da coluna de botoes
          do app que cobre a direita da metade de baixo */}
      {pergunta > 0.001 && vertical ? (
        <div
          style={{
            position: "absolute",
            left: M,
            top: V.perguntaY,
            width: W - M - seguro.direita,
            fontSize: 54,
            fontWeight: 500,
            letterSpacing: "-1.89px",
            lineHeight: 1.18,
            color: m.tinta,
            opacity: pergunta,
            filter: `blur(${(1 - pergunta) * 6}px)`,
            transform: `translateY(${(1 - pergunta) * 18}px)`,
          }}
        >
          E se essa pessoa continuasse por perto{" "}
          <span style={{ color: marca.azul }}>depois da venda?</span>
        </div>
      ) : null}

      {ENTRADAS.map((t, i) => (
        <Sfx key={`e${i}`} som="pop" em={t} volume={0.12} />
      ))}
      <Sfx som="surge" em={ROLA_INI} volume={0.16} />
      <Sfx som="assenta" em={ROLA_FIM} volume={0.26} />
    </AbsoluteFill>
  );
};
