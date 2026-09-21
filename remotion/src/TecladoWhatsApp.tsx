import React from "react";
import { wa, UI } from "./whatsapp";

/**
 * Teclado do WhatsApp, recriado.
 *
 * Fica fora das cenas porque **a 01 e a 07 precisam do mesmo enquadramento**.
 * O teclado ocupa 300 px na base da tela; sem ele a area de conversa cresce, a
 * mensagem desce e sai do quadro no corte fechado que as duas usam. Descobri
 * isso renderizando a 07 sem teclado: a bolha ficou na borda de baixo.
 *
 * Manter o teclado aberto na 07 tambem e o que acontece de verdade: quem
 * acabou de mandar mensagem nao fecha o teclado para esperar resposta.
 */

const LINHAS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export const Teclado: React.FC<{ larg: number; alt: number }> = ({ larg, alt }) => {
  const padH = 5;
  const alturaTecla = (alt - 22) / 4 - 8;
  return (
    <div
      style={{
        width: larg,
        height: alt,
        background: wa.teclado,
        padding: "10px 4px 12px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {LINHAS.map((linha, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: padH,
            justifyContent: "center",
            paddingLeft: i === 1 ? 18 : 0,
            paddingRight: i === 1 ? 18 : 0,
          }}
        >
          {i === 2 ? (
            <div
              style={{
                width: 44,
                height: alturaTecla,
                borderRadius: 5,
                background: wa.tecla,
                opacity: 0.55,
              }}
            />
          ) : null}
          {linha.split("").map((c) => (
            <div
              key={c}
              style={{
                flex: 1,
                height: alturaTecla,
                borderRadius: 5,
                background: wa.tecla,
                color: wa.texto,
                fontFamily: UI,
                fontSize: 17,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {c}
            </div>
          ))}
          {i === 2 ? (
            <div
              style={{
                width: 44,
                height: alturaTecla,
                borderRadius: 5,
                background: wa.tecla,
                opacity: 0.55,
              }}
            />
          ) : null}
        </div>
      ))}
      {/* barra de espaco */}
      <div style={{ display: "flex", gap: padH, justifyContent: "center" }}>
        <div
          style={{
            width: 52,
            height: alturaTecla,
            borderRadius: 5,
            background: wa.tecla,
            opacity: 0.55,
          }}
        />
        <div style={{ flex: 1, height: alturaTecla, borderRadius: 5, background: wa.tecla }} />
        <div
          style={{
            width: 52,
            height: alturaTecla,
            borderRadius: 5,
            background: wa.tecla,
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  );
};

