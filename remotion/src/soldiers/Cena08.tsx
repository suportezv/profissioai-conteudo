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
import { janela, entra, conta, br, s, tiquesDaContagem } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 08 do case Soldiers: a prova que existe hoje.
 *
 * 16 s, narracao de 11,94 s que comeca em 0,4 s. Pausas em 1,00 / 4,15 / 7,20 /
 * 11,66 s.
 *
 * ## Tres ressalvas que entram em tela, nao so no formulario
 *
 * 1. **Todo numero e so do MODO base**, sem as personas dos influenciadores. O
 *    juri compara o video com o formulario escrito, e numero sem recorte vira
 *    duvida.
 * 2. O **NPS 95** vem de amostra reduzida, de pesquisa recente. Numero de NPS
 *    sozinho e exatamente o que o `Comunicacao_Profissio.md` proibe.
 * 3. **Nenhuma linha afirma recompra**, porque a primeira leva de 90 dias so
 *    vence em novembro. Isso e assunto da cena 09.
 *
 * A base e o periodo andam colados em cada numero, nunca num rodape solto.
 *
 * ## A sonorizacao da contagem
 *
 * Os tiques saem de `tiquesDaContagem`, que le a mesma curva que move o numero,
 * entao eles desaceleram junto com ele. Tique em intervalo constante por cima
 * de um valor que freia soa como metronomo tocando junto de um numero
 * desacelerando.
 */

export const CENA08_FRAMES = s(16);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

type Dado = {
  entra: number;
  sai: number;
  alvo: number;
  casas: number;
  sufixo: string;
  titulo: string;
  base: string;
};

const DADOS: Dado[] = [
  {
    entra: s(1.5),
    sai: s(4.7),
    alvo: 151.034,
    casas: 3,
    sufixo: "",
    titulo: "mensagens trocadas",
    base: "05/ago a 18/set/2026 · só o MODO base",
  },
  {
    entra: s(4.7),
    sai: s(7.7),
    alvo: 495,
    casas: 0,
    sufixo: "",
    titulo: "pessoas por dia",
    base: "3.049 por semana · 10.139 por mês",
  },
  {
    entra: s(7.7),
    sai: s(11.4),
    alvo: 600,
    casas: 0,
    sufixo: "",
    titulo: "lembretes por dia",
    base: "no horário que cada cliente escolheu",
  },
  {
    entra: s(11.4),
    sai: CENA08_FRAMES,
    alvo: 95,
    casas: 0,
    sufixo: "",
    titulo: "NPS",
    base: "amostra reduzida · pesquisa recente",
  },
];

export const Cena08: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-08.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
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
                left: MARGEM,
                right: MARGEM,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                ...entra(o, 24),
              }}
            >
              <div
                style={{
                  fontSize: 190,
                  fontWeight: 500,
                  letterSpacing: "-6.65px",
                  lineHeight: 1,
                  color: marca.azul,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 18px 50px rgba(36,88,245,0.22)",
                }}
              >
                {br(v, d.casas)}
                {d.sufixo}
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 500,
                  letterSpacing: "-1.82px",
                  lineHeight: 1.15,
                }}
              >
                {d.titulo}
              </div>
              {/* a base anda junto do numero, nunca num rodape solto */}
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: "-0.91px",
                  color: m.apoio,
                  borderTop: "1px solid rgba(16,18,24,0.22)",
                  paddingTop: 16,
                  maxWidth: 900,
                }}
              >
                {d.base}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {DADOS.map((d) => {
        const paraEm = d.entra + s(1.1);
        return (
          <React.Fragment key={d.titulo}>
            {tiquesDaContagem(d.entra, paraEm).map((fr, i) => (
              <Sfx key={i} som="tique" em={fr} volume={0.07} />
            ))}
            <Sfx som="assenta" em={paraEm} volume={0.4} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
