import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonte";
import { Superficie } from "./Superficie";
import { marca, modos, type Modo } from "./marca";

export type PropsCartao = {
  /** Sobrelinha em caixa alta, como "AGENTES DE IA · ATENDIMENTO · CRM". */
  sobrelinha?: string;
  titulo: string;
  /** Uma palavra do titulo em destaque. So tem efeito nos modos escuro e claro. */
  destaque?: string;
  rodape?: string;
  modo?: Modo;
};

/**
 * Cartao de titulo na diagramacao das pecas oficiais: margem generosa a
 * esquerda, tipografia alinhada a esquerda (nunca centralizada), peso 500,
 * tracking de -3,5% e revelacao palavra a palavra.
 */
export const CartaoTitulo: React.FC<PropsCartao> = ({
  sobrelinha,
  titulo,
  destaque,
  rodape,
  modo = "escuro",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const m = modos[modo];
  const palavras = titulo.split(" ");

  // A margem oficial e 72px num canvas de 1080: 6,67% da largura.
  const margem = width * 0.0667;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte }}>
      <Superficie modo={modo} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: `0 ${margem}px`,
        }}
      >
        {sobrelinha ? (
          <div
            style={{
              fontSize: width * 0.0185,
              fontWeight: 500,
              letterSpacing: marca.tracking,
              color: m.apoio,
              marginBottom: width * 0.04,
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {sobrelinha.toUpperCase()}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.26em",
            fontSize: width * 0.082,
            fontWeight: 500,
            letterSpacing: marca.tracking,
            lineHeight: 1.18,
          }}
        >
          {palavras.map((p, i) => {
            const entrada = spring({
              frame: frame - 6 - i * 4,
              fps,
              config: { damping: 200 },
            });
            const ehDestaque = destaque
              ? p.replace(/[.,!?]/g, "").toLowerCase() === destaque.toLowerCase()
              : false;
            return (
              <span
                key={i}
                style={{
                  // no modo azul o fundo ja e o acento; destacar em azul sumiria
                  color: ehDestaque && modo !== "azul" ? marca.azul : m.tinta,
                  opacity: entrada,
                  transform: `translateY(${interpolate(entrada, [0, 1], [14, 0])}px)`,
                  display: "inline-block",
                }}
              >
                {p}
              </span>
            );
          })}
        </div>

        {rodape ? (
          <div
            style={{
              marginTop: width * 0.055,
              fontSize: width * 0.0157,
              fontWeight: 500,
              letterSpacing: marca.tracking,
              color: m.apoio,
              opacity: interpolate(
                frame,
                [durationInFrames - fps * 2.2, durationInFrames - fps * 1.6],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
            }}
          >
            {rodape.toUpperCase()}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
