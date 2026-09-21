import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { janela, entra, passo, s } from "./anim";

/**
 * Cena 03 do case: a tentativa de 2017.
 *
 * 14 s. A narracao dura 12,45 s e comeca depois de meio segundo de respiro.
 * A duracao da cena saiu do arquivo de audio, nao da tabela do roteiro: a
 * estimativa do roteiro errou 17% para mais no filme inteiro.
 *
 * O device e uma linha do tempo de 1px com tres marcas. Escolhido porque a
 * cena tem exatamente essa forma: uma tentativa que existiu, morreu e voltou.
 * Grafico nenhum diz isso melhor que a propria linha.
 */

export const CENA03_FRAMES = s(14);
const AUDIO_EM = s(0.5);

const MARGEM = 120;
const m = modos.claro;

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
      gap: 18,
      opacity: o,
    }}
  >
    <div
      style={{
        width: 2,
        height: 44,
        background: ativa ? marca.azul : m.tinta,
        opacity: ativa ? 1 : 0.35,
        transformOrigin: "top",
        transform: `scaleY(${o})`,
      }}
    />
    <div
      style={{
        fontSize: 52,
        fontWeight: 500,
        letterSpacing: "-1.82px",
        color: ativa ? marca.azul : m.tinta,
        lineHeight: 1,
      }}
    >
      {ano}
    </div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 400,
        letterSpacing: "-0.84px",
        color: m.apoio,
        whiteSpace: "nowrap",
      }}
    >
      {rotulo}
    </div>
  </div>
);

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();

  const regua = passo(f, s(0.7), s(2.0));
  const a2017 = janela(f, s(2.6), CENA03_FRAMES, 14, 0);
  const a2020 = janela(f, s(8.4), CENA03_FRAMES, 14, 0);
  const a2025 = janela(f, s(11.0), CENA03_FRAMES, 14, 0);
  const chip = janela(f, s(4.8), s(10.6), 16, 14);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" />
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

        {/* a massa do quadro fica no meio: a caixa tem a altura do conteudo,
            senao a regua sobe e sobra um terco de nada embaixo */}
        <div style={{ position: "relative", height: 186 }}>
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
          <Marca x={88} ano="2025" rotulo="a EITA no WhatsApp" o={a2025} ativa />
        </div>

        {/* o dado de contexto entra como chip, nunca como fala */}
        <div style={{ ...entra(chip) }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 28,
              letterSpacing: "-0.98px",
              color: m.tinta,
              background: marca.branco,
              border: `1px solid ${marca.linha}`,
              borderRadius: marca.raio.controle,
              padding: "14px 24px",
            }}
          >
            30% dos trabalhadores com sintomas de burnout
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
