import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 02 do case Soldiers: o pos-venda e terra de ninguem.
 *
 * 9 s, narracao de 5,76 s que comeca em 0,6 s. Pausas do arquivo em 2,87 e
 * 5,38 s.
 *
 * ## O vazio e o argumento
 *
 * A jornada de compra e desenhada como regua de 1px com quatro marcas, e
 * **ela simplesmente acaba na entrega**. Depois disso o quadro fica com a
 * metade direita vazia por quase tres segundos, que e o unico momento do filme
 * em que nada acontece.
 *
 * Isso e deliberado e e o ponto da cena: territorio negligenciado precisa ser
 * **visto**, nao dito. Uma animacao preenchendo aquele espaco destruiria o
 * argumento que a narracao esta fazendo em cima dele.
 *
 * A regua usa tinta a 22%, nao o token `linha`: sobre a lavagem do fundo o
 * `#DFE3EB` desaparece, e foi assim que a linha do tempo do case anterior ficou
 * ilegivel.
 */

export const CENA02_FRAMES = s(9);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

/** As quatro etapas que existem hoje. A regua para depois da ultima. */
const ETAPAS = [
  { nome: "anúncio", em: s(0.9) },
  { nome: "site", em: s(1.5) },
  { nome: "checkout", em: s(2.1) },
  { nome: "entrega", em: s(2.7) },
];

/** Onde a regua para: a entrega fica em 46% da largura util. */
const FIM_REGUA = 46;
const VAZIO_EM = s(6.2);

/**
 * Quando a marca da Soldiers entra: junto com o nome dela na narracao.
 *
 * Ela vai sobre um painel escuro porque o arquivo que o cliente entregou e o
 * logo **branco**, e branco sobre a superficie clara da marca nao existe.
 * Painel escuro e a aplicacao correta dele, nao um improviso: recolorir marca
 * de cliente para caber no nosso fundo seria pior.
 */
const MARCA_EM = s(0.9);

export const Cena02: React.FC = () => {
  const f = useCurrentFrame();
  const regua = passo(f, s(0.7), s(3.0));
  const rotulo = janela(f, s(0.6), CENA02_FRAMES, 14, 0);
  const vazio = janela(f, VAZIO_EM, CENA02_FRAMES, 16, 0);
  const marcaSoldiers = janela(f, MARCA_EM, CENA02_FRAMES, 16, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-02.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 90,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: m.apoio,
              opacity: rotulo,
            }}
          >
            A jornada que já existia
          </div>

          <div
            style={{
              background: marca.tinta,
              borderRadius: marca.raio.painel,
              padding: "26px 40px",
              display: "flex",
              alignItems: "center",
              boxShadow: marca.sombra.painel,
              ...entra(marcaSoldiers, 16),
            }}
          >
            <Img
              src={staticFile("marca-soldiers/soldiers-branco.png")}
              style={{ height: 86, width: "auto", display: "block" }}
            />
          </div>
        </div>

        <div style={{ position: "relative", height: 150 }}>
          {/* a regua para em 46%: o resto do quadro fica vazio de proposito */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${FIM_REGUA}%`,
              height: 1,
              background: "rgba(16,18,24,0.22)",
              transformOrigin: "left",
              transform: `scaleX(${regua})`,
            }}
          />
          {ETAPAS.map((e, i) => {
            const o = janela(f, e.em, CENA02_FRAMES, 12, 0);
            const x = (FIM_REGUA / ETAPAS.length) * (i + 0.5);
            return (
              <div
                key={e.nome}
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
                    height: 34,
                    background: m.tinta,
                    opacity: 0.35,
                    transformOrigin: "top",
                    transform: `scaleY(${o})`,
                  }}
                />
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: "-1.05px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.nome}
                </div>
              </div>
            );
          })}

          {/* o rotulo do vazio entra no espaco que a regua deixou */}
          <div
            style={{
              position: "absolute",
              left: `${FIM_REGUA + 8}%`,
              top: 8,
              fontSize: 64,
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: marca.azul,
              whiteSpace: "nowrap",
              ...entra(vazio, 20),
            }}
          >
            o pós-venda
          </div>
        </div>
      </AbsoluteFill>

      {ETAPAS.map((e) => (
        <Sfx key={e.nome} som="tique" em={e.em} volume={0.1} />
      ))}
      <Sfx som="marca" em={MARCA_EM} volume={0.2} />
      <Sfx som="surge" em={VAZIO_EM} volume={0.22} />
    </AbsoluteFill>
  );
};
