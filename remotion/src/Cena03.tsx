import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { janela, entra, passo, s } from "./anim";
import { Sfx } from "./Sfx";
import {
  IconeApp,
  IconeFichas,
  IconeTeto,
  IconeBalao,
  IconeFaisca,
  IconeSubida,
} from "./Icones";

/**
 * Cena 03 do case: a tentativa de 2017 e a volta em 2024.
 *
 * 14 s. A narracao dura 12,45 s e comeca depois de meio segundo de respiro.
 *
 * O device e uma linha do tempo de 1px com tres marcas, e **cada lista fica
 * embaixo da sua marca**: a de 2017 alinhada a esquerda, sob 2017, e a de 2024
 * alinhada a direita, sob 2024. Elas nao dividem mais a mesma caixa. Lista que
 * troca no mesmo lugar parece correcao da anterior; lista embaixo do proprio
 * ano diz que sao dois momentos, que e o que a cena conta.
 *
 * As listas repetem o que a locucao diz naquele instante, item por item, em vez
 * de trazer um dado solto: dado de contexto sem relacao com a fala e ruido, e
 * foi por isso que o chip de burnout saiu daqui.
 *
 * A lista de 2017 entra no cinza de apoio e a de 2024 na tinta cheia com
 * icone azul. A cor conta o resultado antes do texto: uma nao sobreviveu, a
 * outra e a que esta de pe.
 */

export const CENA03_FRAMES = s(14);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

type Item = { Icone: React.FC<{ cor: string; tam?: number }>; texto: string };

const LISTA_2017: Item[] = [
  { Icone: IconeApp, texto: "aplicativo" },
  { Icone: IconeFichas, texto: "psicólogos categorizando conversas" },
  { Icone: IconeTeto, texto: "dificuldade em escalar" },
];

const LISTA_2024: Item[] = [
  { Icone: IconeBalao, texto: "WhatsApp" },
  { Icone: IconeFaisca, texto: "IA treinada com o método dela" },
  { Icone: IconeSubida, texto: "escalabilidade ilimitada" },
];

/** Uma marca na linha do tempo: risco, ano e rotulo. */
const Marca: React.FC<{
  x: number;
  ano: string;
  rotulo: string;
  o: number;
  ativa?: boolean;
}> = ({ x, ano, rotulo, o, ativa = false }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: 0,
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      opacity: o,
    }}
  >
    <div
      style={{
        width: 2,
        height: 38,
        background: ativa ? marca.azul : m.tinta,
        opacity: ativa ? 1 : 0.35,
        transformOrigin: "top",
        transform: `scaleY(${o})`,
      }}
    />
    <div
      style={{
        fontSize: 46,
        fontWeight: 500,
        letterSpacing: "-1.61px",
        color: ativa ? marca.azul : m.tinta,
        lineHeight: 1,
      }}
    >
      {ano}
    </div>
    <div
      style={{
        fontSize: 22,
        letterSpacing: "-0.77px",
        color: m.apoio,
        whiteSpace: "nowrap",
      }}
    >
      {rotulo}
    </div>
  </div>
);

/**
 * Uma lista ancorada embaixo da sua marca na linha do tempo.
 *
 * `x` e a mesma porcentagem da marca, e `lado` diz de que borda a lista se
 * alinha. A de 2024 alinha a direita porque a marca dela esta em 88%: alinhada
 * a esquerda, ela sairia do quadro.
 */
const Lista: React.FC<{
  itens: Item[];
  o: number;
  entraEm: number;
  f: number;
  ativa: boolean;
  x: number;
  lado: "esquerda" | "direita";
}> = ({ itens, o, entraEm, f, ativa, x, lado }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      ...(lado === "esquerda"
        ? { left: `${x}%`, marginLeft: -22 }
        : { right: `${100 - x}%`, marginRight: -22 }),
      display: "flex",
      flexDirection: "column",
      alignItems: lado === "esquerda" ? "flex-start" : "flex-end",
      gap: 26,
      opacity: o,
      pointerEvents: "none",
    }}
  >
    {itens.map((it, i) => {
      const vivo = janela(f, entraEm + i * 7, CENA03_FRAMES, 12, 0);
      return (
        <div
          key={it.texto}
          style={{
            display: "flex",
            flexDirection: lado === "esquerda" ? "row" : "row-reverse",
            alignItems: "center",
            gap: 24,
            ...entra(vivo, 14),
          }}
        >
          <it.Icone cor={ativa ? marca.azul : m.apoio} tam={40} />
          <div
            style={{
              fontSize: 34,
              fontWeight: ativa ? 500 : 400,
              letterSpacing: "-1.19px",
              color: ativa ? m.tinta : m.apoio,
              textAlign: lado === "esquerda" ? "left" : "right",
            }}
          >
            {it.texto}
          </div>
        </div>
      );
    })}
  </div>
);

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();

  const regua = passo(f, s(0.7), s(2.0));
  const a2017 = janela(f, s(2.0), CENA03_FRAMES, 14, 0);
  const a2020 = janela(f, s(8.8), CENA03_FRAMES, 14, 0);
  const a2024 = janela(f, s(10.9), CENA03_FRAMES, 14, 0);

  // tempos medidos nos silencios da locucao (3,81 / 8,03 / 10,38 s) mais o
  // atraso de 0,5 s: a lista de 2017 acompanha a fala sobre o app e sai quando
  // ela diz que nao sobreviveu; a de 2024 entra junto com "em 2024 ela voltou"
  const lista2017 = janela(f, s(4.7), s(10.7), 14, 12);
  const lista2024 = janela(f, s(11.1), CENA03_FRAMES, 14, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      {/* meio segundo de respiro antes da fala; quem atrasa e a Sequence */}
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao/cena-03.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* sobrelinha da grade da marca: ancora o quadro no alto */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: passo(f, s(0.4), s(1.2)),
          }}
        >
          A tentativa anterior
        </div>

        <div style={{ position: "relative", height: 166 }}>
          {/* a regua: 1px, como manda a marca, desenhada da esquerda */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 1,
              background: marca.linha,
              transformOrigin: "left",
              transform: `scaleX(${regua})`,
            }}
          />
          <Marca x={12} ano="2017" rotulo="o primeiro app" o={a2017} />
          <Marca x={50} ano="2020" rotulo="descontinuado" o={a2020} />
          <Marca x={88} ano="2024" rotulo="a EITA no WhatsApp" o={a2024} ativa />
        </div>

        {/* cada lista embaixo do proprio ano; altura fixa para nada pular */}
        <div style={{ position: "relative", height: 260 }}>
          <Lista
            itens={LISTA_2017}
            o={lista2017}
            entraEm={s(4.7)}
            f={f}
            ativa={false}
            x={12}
            lado="esquerda"
          />
          <Lista
            itens={LISTA_2024}
            o={lista2024}
            entraEm={s(11.1)}
            f={f}
            ativa
            x={88}
            lado="direita"
          />
        </div>
      </AbsoluteFill>

      {/* um tique em cada marca da linha do tempo */}
      <Sfx som="marca" em={s(2.0)} volume={0.26} />
      <Sfx som="marca" em={s(8.8)} volume={0.26} />
      <Sfx som="marca" em={s(10.9)} volume={0.3} />

      {/* e um pop discreto em cada item das listas */}
      {[0, 1, 2].map((i) => (
        <Sfx key={"a" + i} som="pop" em={s(4.7) + i * 7} volume={0.14} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sfx key={"b" + i} som="pop" em={s(11.1) + i * 7} volume={0.18} />
      ))}
    </AbsoluteFill>
  );
};
