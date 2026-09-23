import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { janela, entra, conta, br, s, tiquesDaContagem } from "./anim";
import { Sfx } from "./Sfx";
import { useFormato } from "./formato";

/**
 * Cena 08 do case: o que aconteceu, em numero.
 *
 * 10,8 s, narracao de 9,85 s. **O primeiro numero entra quase junto com a
 * fala**, nao um segundo depois: a versao anterior abria com 1,1 s de
 * superficie clara vazia logo depois de uma sonora, e aquele branco parado
 * quebrava o ritmo do corte. Cena que comeca em cartao cheio nao precisa de
 * respiro; quem da o respiro e a sonora que veio antes. Um numero por vez, e **cada um com a sua base e
 * o seu periodo colados nele**. Nao e escrupulo de rodape: o
 * `Comunicacao_Profissio.md` proibe porcentagem sem contexto, base e metodo, e
 * o juri confere o video contra o formulario escrito.
 *
 * Os 35 mil e os 625 tem bases diferentes de proposito. 35 mil e o total
 * atendido no periodo; 625 e a coorte medida em agosto. Numero sem base vira
 * duvida, entao as duas aparecem.
 */

export const CENA08_FRAMES = s(10.8);
const AUDIO_EM = s(0.15);
const MARGEM = 120;
const m = modos.claro;

type Dado = {
  entra: number;
  sai: number;
  alvo: number;
  casas: number;
  sufixo: string;
  prefixo?: string;
  titulo: string;
  base: string;
};

const DADOS: Dado[] = [
  {
    entra: s(0.45),
    sai: s(3.35),
    alvo: 35,
    casas: 0,
    sufixo: " mil",
    titulo: "usuários",
    base: "jun/2025 a set/2026",
  },
  {
    entra: s(3.35),
    sai: s(5.95),
    alvo: 2.3,
    casas: 1,
    sufixo: " mi",
    titulo: "mensagens trocadas",
    base: "no mesmo período",
  },
  {
    entra: s(5.95),
    sai: s(7.75),
    alvo: 19,
    casas: 0,
    sufixo: "%",
    titulo: "em áudio",
    base: "390 mil mensagens",
  },
  {
    entra: s(7.75),
    sai: CENA08_FRAMES,
    alvo: 75.7,
    casas: 1,
    sufixo: "%",
    titulo: "voltaram na semana seguinte",
    base: "473 de 625 pessoas · ago/2026",
  },
];

export const Cena08: React.FC = () => {
  const f = useCurrentFrame();
  // No 9:16 o numero cresce e centra na faixa segura, nao no quadro: um
  // numero por vez ja e uma composicao vertical, so precisa ocupar a altura.
  const { vertical, H, M, seguro } = useFormato();
  const X = vertical ? M : MARGEM;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao/cena-08.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: vertical ? `${seguro.topo}px ${M}px ${H - seguro.base}px` : MARGEM,
          justifyContent: "center",
        }}
      >
        {DADOS.map((d, i) => {
          const ultimo = i === DADOS.length - 1;
          const o = janela(f, d.entra, d.sai, 14, ultimo ? 0 : 12);
          if (o <= 0.001) return null;
          const v = conta(f, d.entra, d.entra + s(1.1), d.alvo);
          return (
            <div
              key={d.titulo}
              style={{
                position: "absolute",
                left: X,
                right: X,
                display: "flex",
                flexDirection: "column",
                gap: vertical ? 28 : 20,
                ...entra(o, 24),
              }}
            >
              <div
                style={{
                  fontSize: vertical ? 220 : 200,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-7.7px" : "-7px",
                  lineHeight: 1,
                  color: marca.azul,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 18px 50px rgba(36,88,245,0.22)",
                }}
              >
                {d.prefixo ?? ""}
                {br(v, d.casas)}
                {d.sufixo}
              </div>
              <div
                style={{
                  fontSize: vertical ? 64 : 52,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-2.24px" : "-1.82px",
                  lineHeight: 1.15,
                }}
              >
                {d.titulo}
              </div>
              {/* a base anda junto do numero, nunca num rodape solto */}
              <div
                style={{
                  fontSize: vertical ? 30 : 26,
                  letterSpacing: vertical ? "-1.05px" : "-0.91px",
                  color: m.apoio,
                  borderTop: `1px solid ${marca.linha}`,
                  paddingTop: vertical ? 20 : 16,
                  maxWidth: vertical ? undefined : 760,
                }}
              >
                {d.base}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* A contagem e sonorizada, e os tiques saem da **mesma curva que move o
          numero**: eles desaceleram junto com ele, em vez de marcar um tempo
          constante por cima de um valor que freia. O `assenta` entra no frame
          em que o numero para no valor cheio.

          Os ganhos sao desiguais de proposito, porque os arquivos sao: o
          `tique` tem pico em -1,1 dB e o `assenta` em -18,6 dB. Igualar o
          volume dos dois deixaria o tique batendo no nivel da locucao e o
          assentamento inaudivel. **Ganho se acerta contra o pico do arquivo,
          nunca contra o numero do outro efeito.** */}
      {DADOS.map((d) => {
        const paraEm = d.entra + s(1.1);
        return (
          <React.Fragment key={d.titulo}>
            {tiquesDaContagem(d.entra, paraEm).map((f, i) => (
              <Sfx key={i} som="tique" em={f} volume={0.07} />
            ))}
            <Sfx som="assenta" em={paraEm} volume={0.4} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
