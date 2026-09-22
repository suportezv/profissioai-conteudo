import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, conta, br, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 01 do case Soldiers: o produto nao diferencia.
 *
 * 11,5 s, narracao de 9,94 s que comeca em 1,0 s. **O segundo de silencio na
 * frente nao e respiro, e a unica folga que esta cena tem**: a locucao dela
 * ocupa 9,94 s de um slot que o roteiro reservou em 10, e ela abre o filme.
 *
 * Tempos medidos nas pausas do arquivo (1,86 / 5,83 / 9,65 s), somado o
 * atraso: "Creatina e creatina" fecha em 2,86, o dado de mercado em 6,83 e a
 * frase do preco em 10,65.
 *
 * ## O que a cena mostra e a narracao nao diz
 *
 * Dois potes iguais, com o mesmo texto e o mesmo peso, e **so o preco muda**.
 * Um deles cai de preco e o cursor vai nele. A cena nao ilustra o mercado
 * comoditizado, ela executa a decisao que o mercado comoditizado produz: sem
 * nada para comparar alem do numero, escolhe-se o numero.
 *
 * Os potes sao genericos de proposito. **Nenhum rotulo de marca, nem da
 * Soldiers nem de concorrente**: a cena fala do mercado inteiro, e pintar um
 * concorrente aqui seria comparacao, que o `Comunicacao_Profissio.md` proibe.
 */

export const CENA01_FRAMES = s(11.5);
const AUDIO_EM = s(1.0);
const MARGEM = 120;
const m = modos.claro;

const ENTRA_POTES = s(1.2);
const CAI_PRECO = s(6.9);
const CURSOR_CHEGA = s(7.6);
const ESCOLHE = s(8.6);

/** Um pote: rotulo neutro, peso igual, so o preco distingue. */
const Pote: React.FC<{
  preco: number;
  o: number;
  escolhido: boolean;
  destaque: boolean;
}> = ({ preco, o, escolhido, destaque }) => (
  <div
    style={{
      flexGrow: 1,
      background: marca.branco,
      border: `1px solid ${escolhido ? marca.azul : marca.linha}`,
      borderRadius: marca.raio.painel,
      boxShadow: escolhido ? marca.sombra.azul : marca.sombra.painel,
      padding: 44,
      display: "flex",
      flexDirection: "column",
      gap: 26,
      ...entra(o, 22),
    }}
  >
    {/* o pote desenhado: forma generica, sem marca nenhuma */}
    <div
      style={{
        height: 260,
        borderRadius: 18,
        background: marca.superficie,
        border: `1px solid ${marca.linha}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 96,
          height: 22,
          borderRadius: 6,
          background: marca.linha,
        }}
      />
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 12,
          background: marca.branco,
          border: `1px solid ${marca.linha}`,
        }}
      />
    </div>
    <div style={{ fontSize: 30, letterSpacing: "-1.05px", color: m.apoio }}>
      creatina monoidratada · 300 g
    </div>
    <div
      style={{
        fontSize: 68,
        fontWeight: 500,
        letterSpacing: "-2.38px",
        lineHeight: 1,
        color: destaque ? marca.azul : m.tinta,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      R$ {br(preco, 0)}
    </div>
  </div>
);

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();

  const potes = janela(f, ENTRA_POTES, CENA01_FRAMES, 18, 0);
  const dado = janela(f, s(3.2), CENA01_FRAMES, 14, 0);
  // o preco do segundo pote cai enquanto a narracao fala de preco
  const precoB = conta(f, CAI_PRECO, CAI_PRECO + s(0.9), 22);
  const cursor = passo(f, CURSOR_CHEGA, CURSOR_CHEGA + s(0.7));
  const escolheu = f >= ESCOLHE;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-01.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: m.apoio,
            opacity: janela(f, s(0.6), CENA01_FRAMES, 14, 0),
          }}
        >
          O mercado de suplementação
        </div>

        <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
          <Pote preco={119} o={potes} escolhido={false} destaque={false} />
          <Pote
            preco={119 - precoB}
            o={potes}
            escolhido={escolheu}
            destaque={precoB > 0.5}
          />
        </div>

        {/* o dado de mercado, com fonte colada nele */}
        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "baseline",
            opacity: dado,
            ...entra(dado, 16),
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-1.4px" }}>
            R$ 7,6 bi por ano
          </div>
          <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-1.4px", color: marca.azul }}>
            +15% em 2025
          </div>
          <div style={{ fontSize: 24, letterSpacing: "-0.84px", color: m.apoio }}>
            fonte: BRASNUTRI
          </div>
        </div>
      </AbsoluteFill>

      {/* o cursor: entra pela direita e para em cima do pote mais barato */}
      {cursor > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: 1180 + (1 - cursor) * 420,
            top: 560 + (1 - cursor) * 160,
            opacity: cursor,
          }}
        >
          <svg width="46" height="52" viewBox="0 0 24 28">
            <path
              d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.5 L18 15.5 Z"
              fill={marca.tinta}
              stroke={marca.branco}
              strokeWidth="1.4"
            />
          </svg>
        </div>
      ) : null}

      <Sfx som="pop" em={ENTRA_POTES} volume={0.18} />
      <Sfx som="tique" em={CAI_PRECO} volume={0.12} />
      <Sfx som="assenta" em={CAI_PRECO + s(0.9)} volume={0.3} />
      <Sfx som="marca" em={ESCOLHE} volume={0.28} />
    </AbsoluteFill>
  );
};
