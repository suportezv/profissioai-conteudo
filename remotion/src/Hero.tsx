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
 * Hero do site: uma conversa que nunca sai de cena e se transforma.
 *
 * Ato 1  a conversa chega e a IA responde              (Agentes de IA)
 * Ato 2  a equipe assume, a IA pausa                   (Atendimento)
 * Ato 3  duas batidas, porque a frente tem duas metades (CRM e Ativacao)
 *          3a  a conversa vira contato e anda no funil   -> CRM
 *          3b  o contato entra numa lista e numa campanha -> Ativacao
 *
 * Peca continua, sem corte: os estados se encadeiam por transformacao. No ato 3
 * o painel da conversa nao some, ele recua e fica pequeno no alto: tudo que
 * aparece depois descende dele, que e a ideia da peca.
 *
 * Todo rotulo saiu do App Profissio de verdade (conta Profissio SDR): os status
 * de conversa, os quatro estagios do funil e os filtros de lista de Ativacoes.
 * As mensagens sao ficticias, escritas para a peca.
 */

const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Opacidade com entrada e saida, em frames.
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
  { ini: 20, fim: 175, eyebrow: "Agentes de IA", titulo: ["Uma conversa", "chega."] },
  { ini: 175, fim: 320, eyebrow: "Atendimento", titulo: ["A equipe", "assume."] },
  { ini: 320, fim: 580, eyebrow: "CRM e Ativação", titulo: ["O negócio", "se move."] },
];

const CRM_INI = 334;
const CRM_FIM = 452;
const ATIV_INI = 452;
const ATIV_FIM = 578;
const FECHO_INI = 580;

const ESTAGIOS = ["Conversas básicas", "Com objeções", "Interessado", "Reunião marcada"];

const LARG_PAINEL = 860;

/* ---------------------------------------------------------------- palco --- */

const Palco: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / durationInFrames;
  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
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
        {ATOS.map((a, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (larg / 3) * i + larg / 6 - 4,
              top: -3,
              width: 8,
              height: 8,
              borderRadius: 4,
              background: f >= a.ini ? marca.azul : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", width: larg }}>
        {ATOS.map((a, i) => {
          const dentro = f >= a.ini && f < a.fim;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: marca.tracking,
                color: dentro ? marca.branco : marca.apoioEscuro,
                opacity: dentro ? 1 : 0.5,
              }}
            >
              {a.eyebrow}
            </div>
          );
        })}
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
      <span style={{ width: 7, height: 7, borderRadius: 4, background: cor, opacity: pulso }} />
      {texto}
    </div>
  );
};

/** Pilula pequena de filtro ou etiqueta, sobre o painel claro. */
const Pilula: React.FC<{ children: React.ReactNode; forte?: boolean }> = ({ children, forte }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 12px",
      borderRadius: 8,
      whiteSpace: "nowrap",
      background: forte ? `${marca.azul}14` : marca.branco,
      border: `1px solid ${forte ? `${marca.azul}55` : marca.linha}`,
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: marca.tracking,
      color: forte ? marca.azul : marca.tinta,
    }}
  >
    {children}
  </span>
);

/* ---------------------------------------------------------- mensagens ----- */

const Balao: React.FC<{ de: "cliente" | "agente"; texto: string; entra: number }> = ({
  de,
  texto,
  entra,
}) => {
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

/* ------------------------------------------------------ painel conversa --- */

const PainelConversa: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        width: LARG_PAINEL,
        background: marca.branco,
        borderRadius: 20,
        boxShadow: "0 40px 90px rgba(0,0,0,0.42)",
        overflow: "hidden",
      }}
    >
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
        <div style={{ position: "relative", height: 40, minWidth: 268 }}>
          <div style={{ position: "absolute", right: 0, opacity: janela(f, 46, 194, 14, 14) }}>
            <Chip texto="IA Gerenciando" cor={marca.azul} pontoPulsa />
          </div>
          <div style={{ position: "absolute", right: 0, opacity: janela(f, 194, 720, 16, 0) }}>
            <Chip texto="Humano Gerenciando" cor="#1F9D55" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "26px 26px 22px" }}>
        <Balao de="cliente" texto="Oi! Vocês atendem por WhatsApp e integram com o meu CRM?" entra={54} />
        <Balao
          de="agente"
          texto="Atendemos, sim. A conversa vira contato e estágio no funil automaticamente."
          entra={104}
        />
        <Balao de="cliente" texto="Consigo ver uma demonstração essa semana?" entra={152} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 6,
            opacity: janela(f, 212, 720, 16, 0),
            transform: `translateY(${interpolate(passo(f, 212, 236), [0, 1], [10, 0])}px)`,
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
    </div>
  );
};

/* ------------------------------------------------------ 3a: CRM ----------- */

const BlocoCRM: React.FC = () => {
  const f = useCurrentFrame();
  const vis = janela(f, CRM_INI, CRM_FIM + 16, 22, 20);
  // a ficha caminha pelos quatro estagios
  const pos = interpolate(f, [372, 396, 416, 436], [0, 1, 2, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  const colL = 200;
  const gap = 14;

  return (
    <div
      style={{
        width: colL * 4 + gap * 3,
        opacity: vis,
        transform: `translateY(${interpolate(passo(f, CRM_INI, CRM_INI + 28), [0, 1], [26, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* a conversa virou registro: a aba Contatos */}
      <div
        style={{
          background: marca.branco,
          borderRadius: 16,
          padding: "16px 20px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.38)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: marca.apoio,
            marginBottom: 12,
          }}
        >
          Contatos · cadastro automático
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
          {[
            ["Nome", "Contato via WhatsApp"],
            ["Telefone", "+55 11 9••••-••••"],
            ["Estágio", "Interessado"],
            ["Mensagens", "6"],
            ["Última conversa", "agora"],
          ].map(([rot, val], i) => (
            <div key={rot} style={{ opacity: janela(f, CRM_INI + 14 + i * 7, 720, 12, 0) }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: marca.tracking,
                  color: marca.apoio,
                  marginBottom: 4,
                }}
              >
                {rot}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  letterSpacing: marca.tracking,
                  color: rot === "Estágio" ? marca.azul : marca.tinta,
                  whiteSpace: "nowrap",
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* e anda no funil sozinha */}
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
                  whiteSpace: "nowrap",
                }}
              >
                {e}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            top: 48,
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

/* -------------------------------------------------- 3b: Ativacao ---------- */

const BlocoAtivacao: React.FC = () => {
  const f = useCurrentFrame();
  const vis = janela(f, ATIV_INI, ATIV_FIM + 22, 22, 22);
  const envio = passo(f, 516, 566);

  return (
    <div
      style={{
        width: 856,
        opacity: vis,
        transform: `translateY(${interpolate(passo(f, ATIV_INI, ATIV_INI + 28), [0, 1], [26, 0])}px)`,
        background: marca.branco,
        borderRadius: 20,
        padding: "24px 26px 26px",
        boxShadow: "0 40px 90px rgba(0,0,0,0.42)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: marca.apoio,
          }}
        >
          Ativações · nova campanha
        </div>
        <Chip texto="Agendada" cor={marca.azul} />
      </div>

      {/* a lista nasce de filtros: o produto exige pelo menos um */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 400,
          letterSpacing: marca.tracking,
          color: marca.apoio,
          marginBottom: 10,
        }}
      >
        Lista segmentada
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
        {["Estágio: Reunião marcada", "Última conversa: 30 dias", "Etiqueta: Interessado"].map(
          (t, i) => (
            <span key={t} style={{ opacity: janela(f, ATIV_INI + 16 + i * 10, 720, 12, 0) }}>
              <Pilula forte>{t}</Pilula>
            </span>
          ),
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          borderRadius: 16,
          background: marca.superficie,
          border: `1px solid ${marca.linha}`,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: marca.tracking,
              color: marca.apoio,
              marginBottom: 6,
            }}
          >
            Template aprovado pela Meta
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: marca.tracking,
              color: marca.tinta,
            }}
          >
            profissio_retomada_demo
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: marca.tracking,
              color: marca.apoio,
              marginBottom: 6,
            }}
          >
            Destinatários
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: marca.tracking,
              color: marca.tinta,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            248 contatos
          </div>
        </div>
      </div>

      {/* progresso de envio: o painel acompanha a campanha depois do disparo */}
      <div style={{ marginTop: 20, opacity: janela(f, 508, 720, 14, 0) }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: marca.tracking,
            color: marca.apoio,
            marginBottom: 8,
          }}
        >
          <span>Progresso de envio</span>
          <span style={{ color: marca.tinta, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(envio * 248)} / 248
          </span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 8,
            background: marca.linha,
            overflow: "hidden",
          }}
        >
          <div style={{ width: `${envio * 100}%`, height: 8, background: marca.azul }} />
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 15,
            fontWeight: 400,
            letterSpacing: marca.tracking,
            color: marca.apoio,
          }}
        >
          A oportunidade volta para a conversa.
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------- resumo das frentes ----- */

/** No fecho as tres frentes voltam juntas: e o que a peca acabou de mostrar. */
const ResumoFrentes: React.FC = () => {
  const f = useCurrentFrame();
  const linhas = [
    ["Agentes de IA", "Entendem o contexto e respondem."],
    ["Atendimento", "Sua equipe assume quando importa."],
    ["CRM e Ativação", "Contato, estágio e retomada."],
  ];
  return (
    <div style={{ width: 560, opacity: janela(f, FECHO_INI + 40, 720, 20, 0) }}>
      {linhas.map(([nome, linha], i) => {
        const p = passo(f, FECHO_INI + 46 + i * 14, FECHO_INI + 74 + i * 14);
        return (
          <div
            key={nome}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "baseline",
              padding: "22px 0",
              borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: marca.tracking,
                color: marca.azul,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ flex: 1 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: marca.tracking,
                  color: marca.branco,
                }}
              >
                {nome}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: 6,
                  fontSize: 17,
                  fontWeight: 400,
                  letterSpacing: marca.tracking,
                  color: marca.apoioEscuro,
                }}
              >
                {linha}
              </span>
            </span>
          </div>
        );
      })}
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
        opacity: janela(f, FECHO_INI, 720, 18, 0),
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
          const pp = passo(f, FECHO_INI + 10 + i * 6, FECHO_INI + 30 + i * 6);
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
          opacity: janela(f, FECHO_INI + 62, 720, 14, 0),
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
  const idx = ATOS.findIndex((a) => f >= a.ini && f < a.fim);
  const ato = idx === -1 ? (f < ATOS[0].ini ? 0 : ATOS.length - 1) : idx;
  const naCena = f < FECHO_INI - 2;

  // no ato 3 o painel da conversa recua: encolhe, sobe e perde peso, virando a
  // origem visivel de tudo que vem depois em vez de sumir de cena
  const recuo = passo(f, ATOS[2].ini, ATOS[2].ini + 46);
  const escalaPainel = interpolate(recuo, [0, 1], [1, 0.5]);
  const opacPainel = interpolate(recuo, [0, 1], [1, 0.34]);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: marca.branco }}>
      <Palco />

      <div style={{ position: "absolute", left: 120, top: 84, opacity: janela(f, 0, 720, 18, 0) }}>
        <Img src={staticFile("logo-branco.svg")} style={{ width: 232 }} />
      </div>

      {/* coluna da esquerda: a frase do ato, depois o fecho */}
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

      <div
        style={{ position: "absolute", left: 120, bottom: 96, opacity: janela(f, 24, FECHO_INI, 20, 18) }}
      >
        <Trilho />
      </div>

      {/* direita, alto: a conversa. atravessa a peca inteira e recua no ato 3 */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 172,
          width: LARG_PAINEL,
          transformOrigin: "top right",
          transform: `scale(${escalaPainel}) translateY(${interpolate(
            passo(f, 30, 66),
            [0, 1],
            [28, 0],
          )}px)`,
          opacity: janela(f, 30, FECHO_INI, 22, 22) * opacPainel,
        }}
      >
        <PainelConversa />
      </div>

      {/* direita, baixo: as duas metades do ato 3 */}
      <div style={{ position: "absolute", right: 120, top: 470 }}>
        <BlocoCRM />
      </div>
      <div style={{ position: "absolute", right: 120, top: 470 }}>
        <BlocoAtivacao />
      </div>

      {/* no fecho, as tres frentes voltam juntas na direita */}
      <div style={{ position: "absolute", right: 120, top: 356 }}>
        <ResumoFrentes />
      </div>

      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 52,
          fontSize: 15,
          fontWeight: 400,
          letterSpacing: marca.tracking,
          color: marca.apoioEscuro,
          opacity: janela(f, 24, FECHO_INI, 20, 18),
        }}
      >
        {String(ato + 1).padStart(2, "0")} / 03
      </div>
    </AbsoluteFill>
  );
};
