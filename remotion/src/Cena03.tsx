import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { janela, entra, passo, s } from "./anim";
import { Sfx } from "./Sfx";
import { useFormato } from "./formato";
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

// ------------------------------------------------------------------ 9:16 --

/*
 * ## No 9:16 a linha do tempo fica em pe
 *
 * Tres marcas lado a lado a 12, 50 e 88% de 936 px deixariam cada ano com
 * menos de 300 px e as listas sem onde morar. Em pe, a regua desce pela
 * margem esquerda e **cada lista continua embaixo do proprio ano**, agora no
 * sentido da leitura: 2017 em cima com a lista dela, 2020 no meio, 2024 embaixo
 * com a lista dela. A regra da cena (lista sob a sua marca, nunca trocando no
 * mesmo lugar) e a mesma, so girada. Tudo alinhado a esquerda, como a marca
 * pede, e a lista de 2024 deixa de precisar alinhar pela direita.
 */
const V_REGUA_X = 80;
const V_REGUA_TOPO = 300;
const V_REGUA_FIM = 1460;
const V_TEXTO_X = 136;
const V_Y2017 = 360;
const V_Y2020 = 830;
const V_Y2024 = 1060;

/** Uma marca da regua em pe: risco saindo da regua, ano e rotulo. */
const MarcaV: React.FC<{
  y: number;
  ano: string;
  rotulo: string;
  o: number;
  ativa?: boolean;
}> = ({ y, ano, rotulo, o, ativa = false }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: V_REGUA_X,
        top: y - 1,
        width: 38,
        height: 2,
        background: ativa ? marca.azul : m.tinta,
        opacity: (ativa ? 1 : 0.35) * o,
        transformOrigin: "left",
        transform: `scaleX(${o})`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: V_TEXTO_X,
        top: y - 44,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity: o,
      }}
    >
      <div
        style={{
          fontSize: 88,
          fontWeight: 500,
          letterSpacing: "-3.08px",
          color: ativa ? marca.azul : m.tinta,
          lineHeight: 1,
        }}
      >
        {ano}
      </div>
      <div style={{ fontSize: 30, letterSpacing: "-1.05px", color: m.apoio }}>
        {rotulo}
      </div>
    </div>
  </>
);

/** Uma lista embaixo do proprio ano, na regua em pe. */
const ListaV: React.FC<{
  itens: Item[];
  o: number;
  entraEm: number;
  f: number;
  ativa: boolean;
  top: number;
}> = ({ itens, o, entraEm, f, ativa, top }) => (
  <div
    style={{
      position: "absolute",
      left: V_TEXTO_X,
      top,
      display: "flex",
      flexDirection: "column",
      gap: 30,
      opacity: o,
      pointerEvents: "none",
    }}
  >
    {itens.map((it, i) => {
      const vivo = janela(f, entraEm + i * 7, CENA03_FRAMES, 12, 0);
      return (
        <div
          key={it.texto}
          style={{ display: "flex", alignItems: "center", gap: 24, ...entra(vivo, 14) }}
        >
          <it.Icone cor={ativa ? marca.azul : m.apoio} tam={46} />
          <div
            style={{
              fontSize: 40,
              fontWeight: ativa ? 500 : 400,
              letterSpacing: "-1.4px",
              lineHeight: 1.2,
              color: ativa ? m.tinta : m.apoio,
              maxWidth: 800,
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
  const { vertical, M, seguro } = useFormato();

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      {/* meio segundo de respiro antes da fala; quem atrasa e a Sequence */}
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao/cena-03.mp3")} />
      </Sequence>

      {vertical ? (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: M,
              top: seguro.topo,
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: passo(f, s(0.4), s(1.2)),
            }}
          >
            A tentativa anterior
          </div>
          {/* a regua em pe, 1px, desenhada de cima para baixo */}
          <div
            style={{
              position: "absolute",
              left: V_REGUA_X,
              top: V_REGUA_TOPO,
              width: 1,
              height: V_REGUA_FIM - V_REGUA_TOPO,
              background: "rgba(16,18,24,0.22)",
              transformOrigin: "top",
              transform: `scaleY(${regua})`,
            }}
          />
          <MarcaV y={V_Y2017} ano="2017" rotulo="o primeiro app" o={a2017} />
          <MarcaV y={V_Y2020} ano="2020" rotulo="descontinuado" o={a2020} />
          <MarcaV y={V_Y2024} ano="2024" rotulo="a EITA no WhatsApp" o={a2024} ativa />
          <ListaV
            itens={LISTA_2017}
            o={lista2017}
            entraEm={s(4.7)}
            f={f}
            ativa={false}
            top={V_Y2017 + 140}
          />
          <ListaV
            itens={LISTA_2024}
            o={lista2024}
            entraEm={s(11.1)}
            f={f}
            ativa
            top={V_Y2024 + 140}
          />
        </AbsoluteFill>
      ) : (
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
          {/* A regua: 1px, como manda a marca, desenhada da esquerda.
              **A cor nao e o token `linha`.** `#DFE3EB` foi definido para
              divisor sobre painel branco chapado; sobre a lavagem que anda por
              tras ele desaparece, e o resultado era uma linha do tempo em que
              os tracos dos anos liam e a horizontal que os liga, nao. A tinta
              a 22% fica logo abaixo dos tracos, que estao a 35%: a regua
              precisa ser vista, nao competir com as marcas.
              Continua com 1px, que e a parte da regra que importa. */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 1,
              background: "rgba(16,18,24,0.22)",
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
      )}

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
