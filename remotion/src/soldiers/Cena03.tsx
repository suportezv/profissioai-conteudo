import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 03 do case Soldiers: o vinculo que a marca ja tinha.
 *
 * 16 s, narracao de 11,94 s que comeca em 0,5 s. Pausas do arquivo em 5,99 /
 * 7,54 / 11,64 s.
 *
 * ## Estes clipes sao o produto, nao ilustracao dele
 *
 * O que toca aqui sao os **videos de opt-in reais**: o convite que o cliente
 * recebe no WhatsApp depois de comprar, gravado por cada influenciador. Eles ja
 * existiam, decupados e colorizados, e foram rebaixados do ZIP de 11,5 GB no
 * Drive pelo `zip_index_remoto.py`, que le o indice por `Range` em vez de
 * baixar o arquivo inteiro.
 *
 * **Usar o material real aqui e o que separa este filme de uma animacao de
 * produto.** Nada nesta cena e recriado.
 *
 * ## O audio deles entra baixo, nao mudo
 *
 * Cinco pessoas falando ao mesmo tempo por baixo da narracao viram ruido, e
 * mudo demais faz a grade parecer foto. O leito fica em 0,08: da para perceber
 * que sao vozes sem entender nenhuma, que e exatamente a sensacao de ver o
 * feed de alguem.
 *
 * O clipe que cresce tem o audio subindo para 0,5, porque ai ele passa a ser
 * uma pessoa e nao mais textura.
 */

export const CENA03_FRAMES = s(16);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

type Clipe = { arq: string; nome: string; em: number; de: number };

/**
 * Os cinco, na ordem de entrada. `de` e onde cada um comeca a tocar, escolhido
 * para a pessoa ja estar falando quando o quadro dela aparece: clipe que entra
 * no silencio da respiracao parece travado.
 */
const CLIPES: Clipe[] = [
  { arq: "C0001-gordelas.mp4", nome: "Gordelas", em: s(0.8), de: s(1.2) },
  { arq: "C0004-pietra.mp4", nome: "Pietra", em: s(1.4), de: s(2.0) },
  { arq: "C0027.mp4", nome: "", em: s(2.0), de: s(1.0) },
  { arq: "C0002-seu-bolinha.mp4", nome: "Seu Bolinha", em: s(2.6), de: s(1.5) },
  { arq: "C0021.mp4", nome: "", em: s(3.2), de: s(1.0) },
];

/** Quando um deles cresce e fica: junto com "e alguem que ele ja segue". */
const CRESCE = s(8.2);
const ESCOLHIDO = 1; // a Pietra, o clipe mais longo dos cinco

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();
  const rotulo = janela(f, s(0.6), CRESCE, 14, 12);
  const cresceu = passo(f, CRESCE, CRESCE + s(1.0));
  const pergunta = janela(f, s(12.3), CENA03_FRAMES, 16, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-03.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ padding: MARGEM }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: rotulo,
            marginBottom: 34,
          }}
        >
          Quem já falava com o cliente
        </div>

        <div style={{ position: "relative", flexGrow: 1 }}>
          {CLIPES.map((c, i) => {
            const vivo = janela(f, c.em, CENA03_FRAMES, 16, 0);
            const ativo = i === ESCOLHIDO;
            // a grade tem cinco colunas; o escolhido sai dela e ocupa o centro
            const larguraGrade = 100 / CLIPES.length;
            const left = interpolate(
              ativo ? cresceu : 0,
              [0, 1],
              [larguraGrade * i, 28],
            );
            const width = interpolate(
              ativo ? cresceu : 0,
              [0, 1],
              [larguraGrade, 44],
            );
            const some = ativo ? 1 : 1 - cresceu;
            if (vivo <= 0.001 || some <= 0.001) return null;
            return (
              <div
                key={c.arq}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  width: `${width}%`,
                  top: 0,
                  bottom: 0,
                  padding: 8,
                  transform: `translateY(${interpolate(vivo, [0, 1], [26, 0])}px)`,
                  opacity: vivo * some,
                  zIndex: ativo ? 2 : 1,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: marca.raio.painel,
                    overflow: "hidden",
                    boxShadow: ativo && cresceu > 0.5
                      ? marca.sombra.azul
                      : marca.sombra.painel,
                    position: "relative",
                    background: marca.tinta,
                  }}
                >
                  <OffthreadVideo
                    src={staticFile("soldiers/" + c.arq)}
                    startFrom={c.de}
                    volume={ativo ? 0.08 + cresceu * 0.42 : 0.08}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {c.nome ? (
                    <div
                      style={{
                        position: "absolute",
                        left: 16,
                        bottom: 16,
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.77px",
                        color: marca.branco,
                        textShadow: "0 2px 14px rgba(16,18,24,0.7)",
                      }}
                    >
                      {c.nome}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}

          {/* a pergunta da cena, na metade que o clipe centralizado deixou */}
          {pergunta > 0.001 ? (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                width: "24%",
                fontSize: 40,
                fontWeight: 500,
                letterSpacing: "-1.4px",
                lineHeight: 1.28,
                opacity: pergunta,
                filter: `blur(${(1 - pergunta) * 6}px)`,
                // o -50% da centralizacao e a entrada dividem o mesmo
                // transform, entao vao juntos aqui: escritos em linhas
                // separadas o segundo apagaria o primeiro
                transform: `translateY(calc(-50% + ${(1 - pergunta) * 18}px))`,
              }}
            >
              E se essa pessoa continuasse por perto{" "}
              <span style={{ color: marca.azul }}>depois da venda?</span>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      {CLIPES.map((c) => (
        <Sfx key={c.arq} som="pop" em={c.em} volume={0.12} />
      ))}
      <Sfx som="surge" em={CRESCE} volume={0.2} />
    </AbsoluteFill>
  );
};
