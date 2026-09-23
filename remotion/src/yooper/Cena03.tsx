import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { wa, UI } from "../whatsapp";
import { janela, entra, passo, s } from "../anim";
import { useFormato } from "../formato";
import { Sfx } from "../Sfx";
import { dash } from "./Painel";

/**
 * Cena 03 do case Yooper: a virada. O agente, o data lake e as cinco fontes.
 *
 * 15,8 s. Locucao de 14,58 s entrando em 0,5 s.
 *
 * Marcas de palavra, com o atraso somado: "dentro do WhatsApp" 3,52 ·
 * "Data Lake da Yoodash" 4,58 · "Midia paga" 6,90 · "analytics" 7,80 ·
 * "e-commerce" 8,70 · "CRM" 9,42 · "canais organicos" 10,18 ·
 * "na mesma base" 11,78 · "linguagem natural" 13,04.
 *
 * ## Tres nomes parecidos, e a tela e rigida com isso
 *
 * **Yooper** e a agencia que assina, **Yoodash** e a plataforma dela, e **o
 * agente nao recebe nome proprio**. Num filme de dois minutos com tres nomes
 * que rimam, a unica defesa e cada um aparecer em um papel so: a Yooper no
 * lettering de autoria, a Yoodash escrita dentro do no de dados, e o agente
 * sempre como "o agente". Em nenhum frame os tres aparecem como pares.
 *
 * ## A conversa entra vazia e fica
 *
 * O painel do WhatsApp aparece em "dentro do WhatsApp" e **so recebe conteudo
 * no fim**. Sem isso a cena teria que trocar de layout no meio para caber a
 * conversa, e o corte perderia o unico elemento que amarra o grafo ao canal.
 *
 * ## O que a troca do fim mostra e cruzamento, nao resposta
 *
 * A resposta cita **midia e estoque na mesma frase**, que e exatamente o que
 * cinco fontes na mesma base permitem e o que nenhuma outra cena do filme
 * mostra. Uma resposta que so devolvesse um numero provaria menos que o grafo
 * que acabou de ser desenhado.

 */

export const CENA03_FRAMES = s(16.3);
const AUDIO_EM = s(0.5);
const m = modos.claro;

const TITULO_EM = s(0.6);
const CANAL_EM = s(3.52);
/**
 * O painel so entra aqui, e nao em "dentro do WhatsApp".
 *
 * Na primeira versao ele nascia em 3,5 s e ficava **nove segundos como um
 * retangulo preto vazio** no canto do quadro, que e o mesmo defeito que o case
 * Soldiers ja tinha cobrado: conversa alinhada embaixo, sem conteudo, lê como
 * bloco morto. Em "dentro do WhatsApp" quem acende e a palavra no titulo; o
 * canal so vira tela quando tem o que mostrar.
 */
const PAINEL_EM = s(12.3);
const NO_EM = s(4.58);
const CONVERGE_EM = s(11.78);
const PERGUNTA_EM = s(12.7);
const DIGITA_EM = s(13.3);
const RESPOSTA_EM = s(13.95);

type Fonte = { texto: string; em: number };

/** As cinco fontes, cada uma no frame em que a narracao a nomeia. */
const FONTES: Fonte[] = [
  { texto: "mídia paga", em: s(6.9) },
  { texto: "analytics", em: s(7.8) },
  { texto: "e-commerce", em: s(8.7) },
  { texto: "CRM", em: s(9.42) },
  { texto: "canais orgânicos", em: s(10.18) },
];

const CHIP_L = 120;
const CHIP_W = 400;
const NO_L = 820;
const NO_W = 300;
const PAINEL_L = 1230;
const PAINEL_W = 570;
const EIXO = 610;
const LINHA_ALT = 90;

/**
 * As linhas convergem de verdade, em curva, e isso nao e enfeite.
 *
 * A primeira versao usava cinco reguas horizontais que paravam antes do no.
 * Regua que para no vazio lê como filete solto, e o argumento da cena e
 * justamente que as cinco fontes **chegam ao mesmo lugar**. Com a cubica
 * saindo na altura do chip e entrando na altura do no, a convergencia fica
 * desenhada em vez de sugerida.
 */
const FAN_L = CHIP_L + CHIP_W;
const FAN_W = NO_L - FAN_L;

/** Ponto da cubica no parametro t, para o pulso viajar em cima da curva. */
const naCurva = (
  t: number,
  y0: number,
  FAN_W: number,
  EIXO: number,
): [number, number] => {
  const u = 1 - t;
  const x =
    3 * u * u * t * (FAN_W * 0.5) + 3 * u * t * t * (FAN_W * 0.5) + t * t * t * FAN_W;
  const yv = u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * EIXO + t * t * t * EIXO;
  return [x, yv];
};

/** A grade do 16:9, a aprovada. */
const GRADE_H = {
  CHIP_L,
  CHIP_W,
  NO_L,
  NO_W,
  EIXO,
  LINHA_ALT,
  FAN_L,
  FAN_W,
  CHIP_FONTE: 36,
};

/**
 * A grade do 9:16. O titulo fica no alto, o leque ocupa o meio com as fontes
 * a esquerda convergindo no no a direita, e a conversa entra **embaixo** do
 * no, ligada a ele por uma linha vertical, em vez de ao lado. A ordem de
 * leitura continua a mesma: fontes, base, canal.
 */
const V_CHIP_L = 72;
const V_CHIP_W = 380;
const V_NO_L = 656;
const GRADE_V = {
  CHIP_L: V_CHIP_L,
  CHIP_W: V_CHIP_W,
  NO_L: V_NO_L,
  NO_W: 284,
  EIXO: 834,
  LINHA_ALT: 104,
  FAN_L: V_CHIP_L + V_CHIP_W,
  FAN_W: V_NO_L - V_CHIP_L - V_CHIP_W,
  CHIP_FONTE: 42,
};
/** A conversa do 9:16: mesma largura base maior, em escala. */
const V_PAINEL_T = 1104;
const V_PAINEL_W = 690;
const V_PAINEL_ESCALA = 1.25;

const Cilindro: React.FC = () => (
  <svg width="30" height="34" viewBox="0 0 30 34">
    <ellipse cx="15" cy="7" rx="13" ry="5.5" fill="none" stroke={marca.branco} strokeWidth="2" />
    <path d="M2 7v20c0 3 5.8 5.5 13 5.5s13-2.5 13-5.5V7" fill="none" stroke={marca.branco} strokeWidth="2" />
    <path d="M2 17c0 3 5.8 5.5 13 5.5s13-2.5 13-5.5" fill="none" stroke={marca.branco} strokeWidth="2" opacity="0.55" />
  </svg>
);

const Digitando: React.FC<{ o: number }> = ({ o }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        background: wa.balaoEntrada,
        borderRadius: 18,
        borderTopLeftRadius: 5,
        padding: "16px 20px",
        alignSelf: "flex-start",
        display: "flex",
        gap: 7,
        ...entra(o, 8),
      }}
    >
      {[0, 1, 2].map((i) => {
        const fase = ((f - i * 4) % 30) / 30;
        const sobe = Math.sin(fase * Math.PI * 2) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: 5,
              background: wa.apoio,
              opacity: 0.45 + sobe * 0.55,
              transform: `translateY(${-sobe * 4}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const Cena03: React.FC = () => {
  const f = useCurrentFrame();
  const { vertical, M } = useFormato();
  const G = vertical ? GRADE_V : GRADE_H;
  const { CHIP_L, CHIP_W, NO_L, NO_W, EIXO, LINHA_ALT, FAN_L, FAN_W } = G;

  const titulo = janela(f, TITULO_EM, CENA03_FRAMES, 12, 0);
  const canal = janela(f, PAINEL_EM, CENA03_FRAMES, 12, 0);
  const no = janela(f, NO_EM, CENA03_FRAMES, 12, 0);
  const converge = passo(f, CONVERGE_EM, CONVERGE_EM + s(1.0));
  const pergunta = janela(f, PERGUNTA_EM, CENA03_FRAMES, 9, 0);
  const digita = f >= DIGITA_EM && f < RESPOSTA_EM ? passo(f, DIGITA_EM, DIGITA_EM + 5) : 0;
  const resposta = janela(f, RESPOSTA_EM, CENA03_FRAMES, 9, 0);
  const destaca = passo(f, CANAL_EM, CANAL_EM + 10);

  const topo = EIXO - ((FONTES.length - 1) * LINHA_ALT) / 2;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-03.mp3")} />
      </Sequence>

      {/* o titulo fica no alto e nao sai: e o enunciado da cena inteira */}
      <div
        style={{
          position: "absolute",
          left: CHIP_L,
          top: vertical ? 236 : 118,
          ...entra(titulo, 18),
        }}
      >
        <div
          style={{
            fontSize: vertical ? 28 : 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
          }}
        >
          A virada
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: vertical ? 64 : 54,
            fontWeight: 500,
            letterSpacing: vertical ? "-2.24px" : "-1.89px",
            lineHeight: 1.18,
            maxWidth: vertical ? 936 : 940,
          }}
        >
          Um agente{" "}
          <span style={{ color: interpolate(destaca, [0, 1], [0, 1]) > 0.5 ? marca.azul : m.tinta }}>
            dentro do WhatsApp
          </span>
          , ligado à base da Yoodash.
        </div>
      </div>

      {/* o leque de linhas: uma cubica por fonte, todas entrando no mesmo no */}
      <svg
        width={FAN_W}
        height={vertical ? 1920 : 1080}
        style={{ position: "absolute", left: FAN_L, top: 0 }}
      >
        {FONTES.map((fo, i) => {
          const o = janela(f, fo.em, CENA03_FRAMES, 10, 0);
          if (o <= 0.001) return null;
          const y = topo + i * LINHA_ALT;
          const puxa = passo(f, fo.em + 4, fo.em + 18);
          return (
            <path
              key={fo.texto}
              d={`M 0 ${y} C ${FAN_W * 0.5} ${y} ${FAN_W * 0.5} ${EIXO} ${FAN_W} ${EIXO}`}
              fill="none"
              stroke="rgba(16,18,24,0.18)"
              strokeWidth={1.5}
              strokeDasharray={1400}
              strokeDashoffset={1400 * (1 - puxa)}
              opacity={o}
            />
          );
        })}
      </svg>

      {/* as cinco fontes, cada uma no frame em que a narracao a nomeia */}
      {FONTES.map((fo, i) => {
        const o = janela(f, fo.em, CENA03_FRAMES, 10, 0);
        if (o <= 0.001) return null;
        const y = topo + i * LINHA_ALT;
        // o pulso so existe em "na mesma base": ate la nao ha convergencia
        const pulso = Math.max(0, Math.min(1, converge * 1.3 - i * 0.06));
        const anda = converge > 0.02 && converge < 0.999;
        const [px, py] = naCurva(pulso, y, FAN_W, EIXO);
        return (
          <div key={fo.texto}>
            <div
              style={{
                position: "absolute",
                left: CHIP_L,
                top: y - (vertical ? 30 : 26),
                width: CHIP_W,
                display: "flex",
                alignItems: "center",
                gap: 16,
                ...entra(o, 14),
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 30,
                  borderRadius: 2,
                  background: marca.azul,
                  opacity: 0.4 + converge * 0.6,
                }}
              />
              <div
                style={{
                  fontSize: G.CHIP_FONTE,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-1.47px" : "-1.26px",
                }}
              >
                {fo.texto}
              </div>
            </div>
            {anda ? (
              <div
                style={{
                  position: "absolute",
                  left: FAN_L + px - 4,
                  top: py - 4,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: marca.azul,
                  opacity: o,
                }}
              />
            ) : null}
          </div>
        );
      })}

      {/* o no: a base unica, com o nome da plataforma escrito dentro */}
      {no > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: NO_L,
            top: EIXO - 92,
            width: NO_W,
            background: marca.azul,
            borderRadius: marca.raio.painel,
            boxShadow: marca.sombra.azul,
            padding: "30px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            ...entra(no, 18),
          }}
        >
          <Cilindro />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              color: marca.apoioAzul,
            }}
          >
            data lake
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 500,
              letterSpacing: "-1.47px",
              color: marca.branco,
            }}
          >
            Yoodash
          </div>
        </div>
      ) : null}

      {/* do no para o canal, e a linha so existe junto com o canal */}
      {canal > 0.001 && !vertical ? (
        <div
          style={{
            position: "absolute",
            left: NO_L + NO_W,
            top: EIXO - 1,
            width: PAINEL_L - NO_L - NO_W,
            height: 1,
            background: marca.linha,
            transformOrigin: "left",
            transform: `scaleX(${passo(f, PAINEL_EM, PAINEL_EM + 12)})`,
            opacity: canal,
          }}
        />
      ) : null}
      {/* no 9:16 o canal fica embaixo do no, e a linha desce ate ele */}
      {canal > 0.001 && vertical ? (
        <div
          style={{
            position: "absolute",
            left: NO_L + NO_W / 2,
            top: EIXO + 96,
            width: 1,
            height: V_PAINEL_T - EIXO - 96,
            background: marca.linha,
            transformOrigin: "top",
            transform: `scaleY(${passo(f, PAINEL_EM, PAINEL_EM + 12)})`,
            opacity: canal,
          }}
        />
      ) : null}

      {/* a conversa: entra vazia e so recebe conteudo no fim */}
      {canal > 0.001 ? (
        <div
          style={
            vertical
              ? {
                  position: "absolute",
                  left: M,
                  top: V_PAINEL_T,
                  transformOrigin: "left top",
                  transform: `scale(${V_PAINEL_ESCALA * interpolate(canal, [0, 1], [0.86, 1])})`,
                  opacity: canal,
                }
              : {
                  position: "absolute",
                  left: PAINEL_L,
                  top: 336,
                  transformOrigin: "left center",
                  transform: `scale(${interpolate(canal, [0, 1], [0.86, 1])})`,
                  opacity: canal,
                }
          }
        >
          <div
            style={{
              width: vertical ? V_PAINEL_W : PAINEL_W,
              background: wa.fundoChat,
              borderRadius: marca.raio.arte,
              overflow: "hidden",
              boxShadow: marca.sombra.painel,
            }}
          >
            <div
              style={{
                background: wa.barra,
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              {/* o contato e a plataforma, nao o agente: a regra de que o
                  agente nao ganha nome proprio continua valendo, e o avatar
                  oficial da Yoodash e o que o cliente ve no aparelho dele */}
              <Img
                src={staticFile("marca-yooper/yoodash-avatar.png")}
                style={{ width: 42, height: 42, borderRadius: 21, display: "block", objectFit: "cover" }}
              />
              <div style={{ fontFamily: UI, fontSize: 22, color: wa.texto }}>
                Yoodash
              </div>
            </div>

            <div
              style={{
                padding: 22,
                // no 9:16 a coluna e mais baixa: a conversa mora embaixo do
                // no e precisa fechar antes da faixa de interface do app
                height: vertical ? 232 : 264,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              {pergunta > 0.001 ? (
                <div
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: 440,
                    background: wa.balaoSaida,
                    borderRadius: 18,
                    borderTopRightRadius: 5,
                    padding: "13px 17px",
                    fontFamily: UI,
                    fontSize: 21,
                    color: wa.texto,
                    lineHeight: 1.35,
                    ...entra(pergunta, 12),
                  }}
                >
                  qual campanha caiu essa semana?
                </div>
              ) : null}
              {digita > 0.001 ? <Digitando o={digita} /> : null}
              {resposta > 0.001 ? (
                <div
                  style={{
                    alignSelf: "flex-start",
                    maxWidth: 480,
                    background: wa.balaoEntrada,
                    borderRadius: 18,
                    borderTopLeftRadius: 5,
                    padding: "13px 17px",
                    fontFamily: UI,
                    fontSize: 21,
                    color: wa.texto,
                    lineHeight: 1.4,
                    ...entra(resposta, 12),
                  }}
                >
                  Prospecção caiu três dias seguidos. O estoque do carro-chefe
                  também está baixo, então parte da queda pode ser boa.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {FONTES.map((fo) => (
        <Sfx key={fo.texto} som="tique" em={fo.em} volume={0.07} />
      ))}
      <Sfx som="surge" em={NO_EM} volume={0.18} />
      <Sfx som="assenta" em={CONVERGE_EM + s(0.9)} volume={0.3} />
      <Sfx som="pop" em={PERGUNTA_EM} volume={0.16} />
      <Sfx som="recebido" em={RESPOSTA_EM} volume={0.18} />
    </AbsoluteFill>
  );
};
