import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { wa, UI } from "../whatsapp";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 06 do case Soldiers: o ritual diario. **E o filme.**
 *
 * 17 s, narracao de 12,82 s que comeca em 0,6 s. Pausas do arquivo em 1,97 /
 * 3,61 / 7,39 / 9,68 / 10,64 / 12,43 s, somado o atraso: 2,57 / 4,21 / 7,99 /
 * 10,28 / 11,24 / 13,03.
 *
 * ## Como a repeticao vira forma
 *
 * A conversa acontece uma vez: o agente pergunta o horario, o cliente responde.
 * Dai em diante **o relogio e o balao ficam parados no mesmo lugar** e so o
 * cabecalho muda de dia. Cinco repeticoes, **cada uma mais curta que a
 * anterior**, de 1,1 s para 0,45 s.
 *
 * A aceleracao e o que impede a cena de ficar monotona dizendo que algo se
 * repete: ela deixa de mostrar cinco dias e passa a mostrar um habito. Repeticao
 * em intervalo constante lê como loop travado; encurtando, lê como rotina que
 * ja pegou.
 *
 * ## Nenhuma conversa real na tela
 *
 * Os baloes sao recriados com a paleta do `whatsapp.ts`, a mesma das cenas 01 e
 * 07 do case anterior. Nenhuma captura de tela de usuario entra na peca.
 */

export const CENA06_FRAMES = s(17);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

const PERGUNTA_EM = s(4.6);
const RESPOSTA_EM = s(6.6);
const RITUAL_EM = s(8.4);

/**
 * Os cinco dias, com o inicio de cada um. Os intervalos encurtam de proposito:
 * 1,10 · 0,95 · 0,80 · 0,60 · 0,45 s.
 */
const DIAS = ["terça", "quarta", "quinta", "sexta", "sábado"];
const PASSOS = [0, 1.1, 2.05, 2.85, 3.45].map((t) => RITUAL_EM + s(t));

/** Onda curta do audio que chega, desenhada uma vez e reusada em todos os dias. */
const ONDA = [
  0.4, 0.75, 0.5, 0.95, 0.65, 0.45, 0.85, 0.6, 0.35, 0.8, 0.55, 0.9, 0.6, 0.4,
];

const BalaoAgente: React.FC<{ o: number; progresso: number }> = ({
  o,
  progresso,
}) => (
  <div
    style={{
      background: wa.balaoEntrada,
      borderRadius: 20,
      borderTopLeftRadius: 5,
      padding: "18px 24px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignSelf: "flex-start",
      maxWidth: 520,
      ...entra(o, 14),
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: wa.verde,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="18" height="22" viewBox="0 0 12 14">
          <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
          <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
        </svg>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, height: 46 }}>
        {ONDA.map((v, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 5 + v * 38,
              borderRadius: 2,
              background: i / ONDA.length <= progresso ? wa.lido : wa.apoio,
              opacity: i / ONDA.length <= progresso ? 0.95 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
    <div style={{ fontFamily: UI, fontSize: 18, color: wa.apoio, alignSelf: "flex-end" }}>
      0:12
    </div>
  </div>
);

export const Cena06: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, s(0.8), CENA06_FRAMES, 18, 0);
  const pergunta = janela(f, PERGUNTA_EM, CENA06_FRAMES, 14, 0);
  const resposta = janela(f, RESPOSTA_EM, CENA06_FRAMES, 14, 0);

  // qual dia esta em cena, e o progresso do audio daquele dia
  let diaAtivo = -1;
  for (let i = 0; i < PASSOS.length; i++) {
    if (f >= PASSOS[i]) diaAtivo = i;
  }
  const inicio = diaAtivo >= 0 ? PASSOS[diaAtivo] : 0;
  const fim =
    diaAtivo >= 0 && diaAtivo + 1 < PASSOS.length
      ? PASSOS[diaAtivo + 1]
      : inicio + s(1.0);
  const progresso = interpolate(f, [inicio, fim - 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const balaoDia = diaAtivo >= 0 ? passo(f, inicio, inicio + 8) : 0;

  const fecho = janela(f, s(13.4), CENA06_FRAMES, 16, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-06.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 72,
        }}
      >
        {/* a tela recriada, com o cabecalho que e a unica coisa que muda */}
        <div
          style={{
            width: 640,
            flexShrink: 0,
            background: wa.fundoChat,
            borderRadius: marca.raio.arte,
            overflow: "hidden",
            boxShadow: marca.sombra.painel,
            ...entra(tela, 22),
          }}
        >
          <div
            style={{
              background: wa.barra,
              padding: "20px 26px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: UI, fontSize: 24, color: wa.texto }}>
              MODO Soldiers
            </div>
            <div
              style={{
                fontFamily: UI,
                fontSize: 22,
                fontWeight: 600,
                color: diaAtivo >= 0 ? wa.lido : wa.apoio,
              }}
            >
              {diaAtivo >= 0 ? `${DIAS[diaAtivo]} · 7:00` : "7:00"}
            </div>
          </div>

          <div
            style={{
              padding: 26,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minHeight: 460,
              justifyContent: "flex-end",
            }}
          >
            {/* a conversa, que acontece uma vez */}
            {pergunta > 0.001 ? (
              <div
                style={{
                  background: wa.balaoEntrada,
                  borderRadius: 18,
                  borderTopLeftRadius: 5,
                  padding: "16px 20px",
                  alignSelf: "flex-start",
                  maxWidth: 460,
                  fontFamily: UI,
                  fontSize: 24,
                  color: wa.texto,
                  lineHeight: 1.35,
                  ...entra(pergunta, 14),
                }}
              >
                Que horas você costuma tomar?
              </div>
            ) : null}

            {resposta > 0.001 ? (
              <div
                style={{
                  background: wa.balaoSaida,
                  borderRadius: 18,
                  borderTopRightRadius: 5,
                  padding: "16px 20px",
                  alignSelf: "flex-end",
                  fontFamily: UI,
                  fontSize: 24,
                  color: wa.texto,
                  ...entra(resposta, 14),
                }}
              >
                7h
              </div>
            ) : null}

            {/* e o audio que chega todo dia, no mesmo lugar */}
            {diaAtivo >= 0 ? (
              <BalaoAgente o={balaoDia} progresso={progresso} />
            ) : null}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: janela(f, s(0.6), CENA06_FRAMES, 14, 0),
            }}
          >
            O ritual diário
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: "-1.82px",
              lineHeight: 1.22,
              opacity: janela(f, s(1.2), CENA06_FRAMES, 16, 0),
            }}
          >
            No horário que
            <br />
            o cliente escolheu.
            <br />
            <span style={{ color: marca.azul }}>Todo dia.</span>
          </div>
          <div
            style={{
              fontSize: 30,
              letterSpacing: "-1.05px",
              color: m.apoio,
              borderTop: "1px solid rgba(16,18,24,0.22)",
              paddingTop: 20,
              ...entra(fecho, 16),
            }}
          >
            cerca de 600 lembretes disparados
            <br />
            a cada 24 horas
          </div>
        </div>
      </AbsoluteFill>

      <Sfx som="pop" em={PERGUNTA_EM} volume={0.16} />
      <Sfx som="pop" em={RESPOSTA_EM} volume={0.16} />
      {PASSOS.map((p, i) => (
        <Sfx key={i} som="recebido" em={p} volume={0.2} />
      ))}
      <Sfx som="surge" em={s(13.4)} volume={0.2} />
    </AbsoluteFill>
  );
};
