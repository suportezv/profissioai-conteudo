import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./fonte";
import { marca } from "./marca";

/**
 * Hero do site: uma conversa que nunca sai de cena e se transforma tres vezes.
 *
 * Ato 1  a conversa chega e a IA responde       (Agentes de IA)
 * Ato 2  a equipe assume, a IA pausa            (Atendimento)
 * Ato 3  a conversa vira contato e anda no funil (CRM e Ativacao)
 *
 * Peca continua, sem corte: os estados se encadeiam por transformacao, cada um
 * segurando 2 a 3 segundos. Os rotulos sao os do App Profissio de verdade,
 * inclusive os estagios do funil da conta Profissio SDR.
 */

const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Opacidade com entrada e saida, em frames locais.
 *
 * Monta a faixa sem ponto repetido: com fade de saida zero, [ini, ini+ent,
 * fim, fim] nao e estritamente crescente e o interpolate do Remotion recusa.
 */
const janela = (f: number, ini: number, fim: number, ent = 12, sai = 12) => {
  const a = ini;
  const b = Math.min(ini + Math.max(ent, 1), fim - 1);
  if (sai <= 0) {
    return interpolate(f, [a, b, fim], [0, 1, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });
  }
  const c = Math.max(fim - sai, b + 1);
  return interpolate(f, [a, b, c, Math.max(fim, c + 1)], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
};

/** Progresso 0..1 entre dois frames. */
const passo = (f: number, ini: number, fim: number) =>
  interpolate(f, [ini, fim], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

const ATOS = [
  { ini: 20, fim: 195, eyebrow: "Agentes de IA", titulo: ["Uma conversa", "chega."] },
  { ini: 195, fim: 360, eyebrow: "Atendimento", titulo: ["A equipe", "assume."] },
  { ini: 360, fim: 530, eyebrow: "CRM e Ativação", titulo: ["O negócio", "se move."] },
];

const ESTAGIOS = ["Conversas básicas", "Com objeções", "Interessado", "Reunião marcada"];

/* ---------------------------------------------------------------- palco --- */

const Palco: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / durationInFrames;
  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      {/* profundidade: um halo azul que deriva devagar, quase imperceptivel */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 760px at ${68 + Math.sin(t * Math.PI * 2) * 3}% ${
            26 + Math.cos(t * Math.PI * 2) * 4
          }%, ${marca.azul} 0%, transparent 62%)`,
          opacity: 0.2,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 620px at 8% 88%, ${marca.ciano} 0%, transparent 60%)`,
          opacity: 0.05,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- trilho ----- */

const Trilho: React.FC = () => {
  const f = useCurrentFrame();
  const larg = 420;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ position: "relative", width: larg, height: 2 }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.12)" }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 2,
            width: larg * passo(f, ATOS[0].ini, ATOS[2].fim),
            background: marca.azul,
          }}
        />
        {ATOS.map((a, i) => {
          const x = (larg / 3) * i + larg / 6;
          const aceso = f >= a.ini;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 4,
                top: -3,
                width: 8,
                height: 8,
                borderRadius: 4,
                background: aceso ? marca.azul : "rgba(255,255,255,0.25)",
                transform: `scale(${aceso ? 1 : 0.7})`,
                transition: "none",
              }}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", width: larg }}>
        {ATOS.map((a, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: marca.tracking,
              color: f >= a.ini && f < a.fim ? marca.branco : marca.apoioEscuro,
              opacity: f >= a.ini && f < a.fim ? 1 : 0.5,
            }}
          >
            {a.eyebrow}
          </div>
        ))}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- chip ----- */

const Chip: React.FC<{ texto: string; cor: string; pontoPulsa?: boolean }> = ({
  texto,
  cor,
  pontoPulsa,
}) => {
  const f = useCurrentFrame();
  const pulso = pontoPulsa ? 0.55 + 0.45 * Math.abs(Math.sin(f / 9)) : 1;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "7px 14px",
        borderRadius: 8,
        background: `${cor}1A`,
        border: `1px solid ${cor}55`,
        fontSize: 17,
        fontWeight: 500,
        letterSpacing: marca.tracking,
        color: cor,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 4,
          background: cor,
          opacity: pulso,
        }}
      />
      {texto}
    </div>
  );
};

/* ---------------------------------------------------------- mensagens ----- */

const Balao: React.FC<{
  de: "cliente" | "agente";
  texto: string;
  entra: number;
}> = ({ de, texto, entra }) => {
  const f = useCurrentFrame();
  const p = passo(f, entra, entra + 18);
  const doCliente = de === "cliente";
  return (
    <div
      style={{
        alignSelf: doCliente ? "flex-start" : "flex-end",
        maxWidth: "76%",
        padding: "16px 20px",
        borderRadius: 20,
        borderBottomLeftRadius: doCliente ? 6 : 20,
        borderBottomRightRadius: doCliente ? 20 : 6,
        background: doCliente ? marca.superficie : marca.azul,
        color: doCliente ? marca.tinta : marca.branco,
        fontSize: 21,
        fontWeight: 400,
        lineHeight: 1.42,
        letterSpacing: marca.tracking,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
      }}
    >
      {texto}
    </div>
  );
};

/* ------------------------------------------------------------- painel ----- */

const Painel: React.FC = () => {
  const f = useCurrentFrame();

  // o painel encolhe de leve no ato 3, quando a conversa vira ficha no funil
  const recuo = passo(f, 372, 420);
  const escala = interpolate(recuo, [0, 1], [1, 0.965]);

  return (
    <div
      style={{
        width: 860,
        background: marca.branco,
        borderRadius: 20,
        boxShadow: "0 40px 90px rgba(0,0,0,0.42)",
        overflow: "hidden",
        transform: `scale(${escala})`,
        transformOrigin: "center",
      }}
    >
      {/* cabecalho do painel: status da conversa */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 26px",
          borderBottom: `1px solid ${marca.linha}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: marca.superficie,
              border: `1px solid ${marca.linha}`,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 500,
                letterSpacing: marca.tracking,
                color: marca.tinta,
              }}
            >
              Contato via WhatsApp
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 400,
                letterSpacing: marca.tracking,
                color: marca.apoio,
              }}
            >
              Profissio SDR
            </div>
          </div>
        </div>

        {/* o chip troca de estado: e a virada do ato 2 */}
        <div style={{ position: "relative", height: 40, minWidth: 268 }}>
          <div style={{ position: "absolute", right: 0, opacity: janela(f, 46, 214, 14, 14) }}>
            <Chip texto="IA Gerenciando" cor={marca.azul} pontoPulsa />
          </div>
          <div style={{ position: "absolute", right: 0, opacity: janela(f, 214, 600, 16, 0) }}>
            <Chip texto="Humano Gerenciando" cor="#1F9D55" />
          </div>
        </div>
      </div>

      {/* corpo: a conversa */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "26px 26px 22px",
        }}
      >
        <Balao de="cliente" texto="Oi! Vocês atendem por WhatsApp e integram com o meu CRM?" entra={54} />
        <Balao
          de="agente"
          texto="Atendemos, sim. A conversa vira contato e estágio no funil automaticamente."
          entra={106}
        />
        <Balao de="cliente" texto="Consigo ver uma demonstração essa semana?" entra={168} />

        {/* ato 2: a pessoa entra em cena */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 6,
            opacity: janela(f, 232, 600, 16, 0),
            transform: `translateY(${interpolate(passo(f, 232, 256), [0, 1], [10, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              background: marca.azul,
              color: marca.branco,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: marca.tracking,
            }}
          >
            CS
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: marca.tracking,
              color: marca.apoio,
            }}
          >
            Clésio assumiu a conversa. A IA pausou as respostas.
          </div>
        </div>
      </div>

      {/* rodape do painel: sinais coletados, aparece no ato 3 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 26px",
          borderTop: `1px solid ${marca.linha}`,
          background: marca.superficie,
          opacity: janela(f, 392, 600, 18, 0),
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: marca.tracking,
            color: marca.apoio,
          }}
        >
          Informações coletadas
        </span>
        {["Interessado", "Reunião marcada"].map((t, i) => (
          <span
            key={t}
            style={{
              padding: "5px 11px",
              borderRadius: 8,
              background: marca.branco,
              border: `1px solid ${marca.linha}`,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: marca.tracking,
              color: marca.tinta,
              opacity: janela(f, 400 + i * 22, 600, 14, 0),
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- funil ----- */

const Funil: React.FC = () => {
  const f = useCurrentFrame();
  const aparece = janela(f, 402, 600, 20, 0);
  // a ficha caminha pelos quatro estagios
  const pos = interpolate(f, [418, 446, 470, 494], [0, 1, 2, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  const colL = 196;
  const gap = 14;

  return (
    <div
      style={{
        width: colL * 4 + gap * 3,
        opacity: aparece,
        transform: `translateY(${interpolate(passo(f, 402, 430), [0, 1], [24, 0])}px)`,
      }}
    >
      <div style={{ display: "flex", gap, position: "relative" }}>
        {ESTAGIOS.map((e, i) => {
          const ativo = pos >= i - 0.35;
          return (
            <div
              key={e}
              style={{
                width: colL,
                padding: "14px 14px 96px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${ativo ? `${marca.azul}88` : "rgba(255,255,255,0.10)"}`,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: marca.tracking,
                  color: ativo ? marca.branco : marca.apoioEscuro,
                }}
              >
                {e}
              </div>
            </div>
          );
        })}

        {/* a ficha: e a mesma conversa, agora como contato */}
        <div
          style={{
            position: "absolute",
            top: 46,
            left: pos * (colL + gap) + 14,
            width: colL - 28,
            padding: "11px 13px",
            borderRadius: 12,
            background: marca.branco,
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: marca.tracking,
              color: marca.tinta,
            }}
          >
            Contato via WhatsApp
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: marca.tracking,
              color: marca.apoio,
            }}
          >
            estágio atualizado
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- fecho ----- */

const Fecho: React.FC = () => {
  const f = useCurrentFrame();
  const palavras = ["Cada", "conversa", "move", "o", "seu", "negócio."];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 34,
        opacity: janela(f, 530, 640, 18, 0),
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.26em",
          fontSize: 92,
          fontWeight: 500,
          letterSpacing: marca.tracking,
          lineHeight: 1.16,
          maxWidth: 1100,
        }}
      >
        {palavras.map((p, i) => {
          const pp = passo(f, 540 + i * 6, 560 + i * 6);
          return (
            <span
              key={i}
              style={{
                color: p === "conversa" ? marca.azul : marca.branco,
                opacity: pp,
                transform: `translateY(${interpolate(pp, [0, 1], [16, 0])}px)`,
                display: "inline-block",
              }}
            >
              {p}
            </span>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: janela(f, 592, 640, 14, 0),
        }}
      >
        <div
          style={{
            padding: "16px 28px",
            borderRadius: 8,
            background: marca.azul,
            color: marca.branco,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: marca.tracking,
            whiteSpace: "nowrap",
          }}
        >
          Agendar demonstração
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: marca.tracking,
            color: marca.apoioEscuro,
            whiteSpace: "nowrap",
          }}
        >
          Agentes de IA, atendimento e CRM na mesma plataforma.
        </span>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- hero ----- */

export const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const atoAtual = ATOS.findIndex((a) => f >= a.ini && f < a.fim);
  const ato = atoAtual === -1 ? (f < ATOS[0].ini ? 0 : ATOS.length - 1) : atoAtual;
  const naCena = f < 528;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: marca.branco }}>
      <Palco />

      {/* assinatura, fixa */}
      <div style={{ position: "absolute", left: 120, top: 84, opacity: janela(f, 0, 640, 18, 0) }}>
        <Img src={staticFile("logo-branco.svg")} style={{ width: 232 }} />
      </div>

      {/* coluna da esquerda: a frase do ato, ou o fecho */}
      <div style={{ position: "absolute", left: 120, top: 330, width: 780 }}>
        {naCena
          ? ATOS.map((a, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: janela(f, a.ini, a.fim, 20, 20),
                  transform: `translateY(${interpolate(
                    passo(f, a.ini, a.ini + 26),
                    [0, 1],
                    [22, 0],
                  )}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: marca.apoioEscuro,
                    marginBottom: 26,
                  }}
                >
                  {a.eyebrow}
                </div>
                <div
                  style={{
                    fontSize: 86,
                    fontWeight: 500,
                    letterSpacing: marca.tracking,
                    lineHeight: 1.15,
                  }}
                >
                  {a.titulo.map((l, j) => (
                    <div key={j}>{l}</div>
                  ))}
                </div>
              </div>
            ))
          : null}
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <Fecho />
        </div>
      </div>

      {/* trilho de progresso, discreto */}
      <div style={{ position: "absolute", left: 120, bottom: 96, opacity: janela(f, 24, 528, 20, 18) }}>
        <Trilho />
      </div>

      {/* direita: o painel, que atravessa os tres atos */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 200,
          opacity: janela(f, 30, 528, 22, 22),
          transform: `translateY(${interpolate(passo(f, 30, 66), [0, 1], [28, 0])}px)`,
        }}
      >
        <Painel />
      </div>

      {/* o funil entra sob o painel no ato 3 e sobe no fecho, para nao deixar
          a direita vazia quando o painel sai de cena */}
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 118,
          transform: `translateY(${interpolate(passo(f, 528, 586), [0, 1], [0, -250])}px)`,
        }}
      >
        <Funil />
      </div>

      {/* marca d'agua do ato, canto inferior direito */}
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 52,
          fontSize: 15,
          fontWeight: 400,
          letterSpacing: marca.tracking,
          color: marca.apoioEscuro,
          opacity: janela(f, 24, 528, 20, 18),
        }}
      >
        {String(ato + 1).padStart(2, "0")} / 03
      </div>
    </AbsoluteFill>
  );
};
