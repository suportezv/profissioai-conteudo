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
import { janela, passo, s } from "../anim";
import { Sfx } from "../Sfx";

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
 * inteiro; cada bruto foi apagado logo depois do corte para o disco aguentar.
 *
 * **Usar o material real aqui e o que separa este filme de uma animacao de
 * produto.** Nada nesta cena e recriado.
 *
 * ## A grade gira, e e a quantidade que e o argumento
 *
 * A versao anterior mostrava cinco rostos e parava. Cinco nao e grandiosidade,
 * e uma amostra. Agora os cinco entram igual, e a partir dai a grade **troca de
 * rosto em intervalos cada vez mais curtos**, passando por dezoito pessoas em
 * cinco segundos. Ninguem consegue ler um por um, e nao e para ler: o que fica
 * e a sensacao de que tem muita gente, que e exatamente o que a narracao
 * afirma.
 *
 * A aceleracao importa tanto quanto o numero. Troca em intervalo constante lê
 * como slideshow; encurtando, lê como base crescendo.
 *
 * ## Ninguem e nomeado, menos quem fica
 *
 * Durante a rotacao os nomes piscariam e virariam ruido, e nem todos os clipes
 * estao identificados no relatorio de decupagem. Entao a grade roda sem nome
 * nenhum e **so quem cresce no fim e nomeado**, que e a Pietra.
 *
 * ## O audio deles entra baixo, nao mudo
 *
 * Cinco pessoas falando ao mesmo tempo por baixo da narracao viram ruido, e
 * mudo demais faz a grade parecer foto. O leito fica em 0,08: da para perceber
 * que sao vozes sem entender nenhuma, que e a sensacao de ver o feed de
 * alguem. O clipe que cresce sobe para 0,5, porque ai ele passa a ser uma
 * pessoa e nao mais textura.
 */

export const CENA03_FRAMES = s(16);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

type Clipe = { arq: string; de: number };

/**
 * Os dezoito, na ordem em que aparecem. Os cinco primeiros abrem a grade; o
 * resto entra pela rotacao. `de` e so para os que nao foram cortados no ponto
 * certo na ingestao; os baixados depois ja vieram com a janela boa.
 */
const CLIPES: Clipe[] = [
  { arq: "C0001-gordelas.mp4", de: s(1.2) },
  { arq: "C0004-pietra.mp4", de: s(2.0) },
  { arq: "C0027.mp4", de: s(1.0) },
  { arq: "C0002-seu-bolinha.mp4", de: s(1.5) },
  { arq: "C0021.mp4", de: s(1.0) },
  { arq: "C0005.mp4", de: 0 },
  { arq: "C0008.mp4", de: 0 },
  { arq: "C0009.mp4", de: 0 },
  { arq: "C0010.mp4", de: 0 },
  { arq: "C0011.mp4", de: 0 },
  { arq: "C0018.mp4", de: 0 },
  { arq: "C0019.mp4", de: 0 },
  { arq: "C0022.mp4", de: 0 },
  { arq: "C0024.mp4", de: 0 },
  { arq: "C0026.mp4", de: 0 },
  { arq: "C0028.mp4", de: 0 },
  { arq: "C0029.mp4", de: 0 },
  { arq: "C0032.mp4", de: 0 },
];

const VAGAS = 5;
/** A Pietra e quem fica: ela volta para a vaga do meio antes de crescer. */
const PIETRA = 1;
const ESCOLHIDO = 1;

const ENTRADAS = [s(0.8), s(1.2), s(1.6), s(2.0), s(2.4)];
const CRESCE = s(8.6);

/**
 * Os instantes de troca, com o intervalo encurtando 10% a cada passo.
 *
 * Derivado, nao tabelado: mexer no inicio ou no fim reescreve a escada inteira
 * sem risco de deixar um buraco no meio.
 */
const TROCAS: number[] = (() => {
  // 8,35 e nao 8,2: com 8,2 a escada dava doze trocas e o decimo oitavo
  // clipe nunca entrava em cena. Conferido reproduzindo a escada antes de render.
  const fim = 8.35;
  const out: number[] = [];
  let t = 3.2;
  let passoS = 0.7;
  while (t < fim) {
    out.push(s(t));
    t += passoS;
    passoS *= 0.9;
  }
  return out;
})();

/** Que clipe esta em cada vaga neste frame. */
const clipeDaVaga = (vaga: number, f: number): Clipe => {
  if (vaga === ESCOLHIDO && f >= CRESCE - s(0.6)) return CLIPES[PIETRA];
  let idx = vaga;
  TROCAS.forEach((t, i) => {
    if (i % VAGAS === vaga && f >= t) idx = (VAGAS + i) % CLIPES.length;
  });
  return CLIPES[idx];
};

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();
  const rotulo = janela(f, s(0.5), CRESCE, 10, 9);
  const cresceu = passo(f, CRESCE, CRESCE + s(0.9));
  const pergunta = janela(f, s(12.2), CENA03_FRAMES, 11, 0);

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
            marginBottom: 30,
          }}
        >
          Quem já falava com o cliente
        </div>

        <div style={{ position: "relative", flexGrow: 1 }}>
          {Array.from({ length: VAGAS }, (_, i) => {
            const vivo = janela(f, ENTRADAS[i], CENA03_FRAMES, 11, 0);
            const ativo = i === ESCOLHIDO;
            const larguraGrade = 100 / VAGAS;
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
            const c = clipeDaVaga(i, f);
            return (
              <div
                key={i}
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
                    boxShadow:
                      ativo && cresceu > 0.5
                        ? marca.sombra.azul
                        : marca.sombra.painel,
                    position: "relative",
                    background: marca.tinta,
                  }}
                >
                  {/* a chave inclui o arquivo: trocar de clipe remonta o video
                      em vez de tentar reaproveitar o elemento anterior */}
                  <OffthreadVideo
                    key={c.arq}
                    src={staticFile("soldiers/" + c.arq)}
                    startFrom={c.de}
                    volume={ativo ? 0.08 + cresceu * 0.42 : 0.08}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* so quem fica e nomeado: na rotacao o nome viraria ruido */}
                  {ativo && cresceu > 0.6 ? (
                    <div
                      style={{
                        position: "absolute",
                        left: 20,
                        bottom: 20,
                        fontSize: 24,
                        fontWeight: 500,
                        letterSpacing: "-0.84px",
                        color: marca.branco,
                        textShadow: "0 2px 14px rgba(16,18,24,0.7)",
                        opacity: passo(f, CRESCE + s(0.6), CRESCE + s(0.9)),
                      }}
                    >
                      Pietra
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
                // transform, entao vao juntos aqui
                transform: `translateY(calc(-50% + ${(1 - pergunta) * 18}px))`,
              }}
            >
              E se essa pessoa continuasse por perto{" "}
              <span style={{ color: marca.azul }}>depois da venda?</span>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      {ENTRADAS.map((t, i) => (
        <Sfx key={`e${i}`} som="pop" em={t} volume={0.12} />
      ))}
      {TROCAS.map((t, i) => (
        <Sfx key={`t${i}`} som="tique" em={t} volume={0.07} />
      ))}
      <Sfx som="surge" em={CRESCE} volume={0.22} />
    </AbsoluteFill>
  );
};
