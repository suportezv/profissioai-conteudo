import React from "react";
import { AbsoluteFill } from "remotion";
import { marca, modos, type Modo } from "./marca";

/**
 * Fundo da marca. A revisao 3 nao usa gradiente: sao tres superficies chapadas
 * (escura, clara e azul), como nas pecas oficiais. O unico ornamento permitido
 * e um halo muito sutil, e mesmo ele e opcional.
 */
export const Superficie: React.FC<{ modo?: Modo; halo?: boolean }> = ({
  modo = "escuro",
  halo = false,
}) => {
  const m = modos[modo];
  return (
    <AbsoluteFill style={{ backgroundColor: m.fundo }}>
      {halo ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 78% 18%, ${
              modo === "azul" ? marca.branco : marca.azul
            } 0%, transparent 55%)`,
            opacity: modo === "claro" ? 0.07 : 0.14,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
