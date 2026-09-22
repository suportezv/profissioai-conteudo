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
import { Sfx } from "../Sfx";

/**
 * Cena 06 do case Soldiers: o ritual diario. **E o filme.**
 *
 * 18 s, narracao de 12,82 s que comeca em 0,6 s. Pausas do arquivo em 1,97 /
 * 3,61 / 7,39 / 9,68 / 10,64 / 12,43 s, somado o atraso: 2,57 / 4,21 / 7,99 /
 * 10,28 / 11,24 / 13,03.
 *
 * ## A conversa acumula, ela nao pisca
 *
 * A versao anterior mantinha **um** balao de audio no mesmo lugar, sumindo e
 * reaparecendo com o cabecalho trocando de dia. Lia como glitch, nao como
 * habito: nada sobrava na tela para provar que os dias passaram.
 *
 * Agora a conversa **empilha**. Cada dia entra com a marcacao central de data,
 * o agente manda a mensagem e o cliente responde, e o conteudo antigo sobe e sai
 * por cima. E assim que a continuidade fica visivel: no fim da cena da para ver
 * que aquilo ja vem acontecendo ha dias, porque o rastro esta ali.
 *
 * O empilhamento nao precisa de scroll animado. A coluna tem altura fixa,
 * `justify-content: flex-end` e `overflow: hidden`: mensagem nova empurra a
 * antiga para cima e ela sai sozinha, que e exatamente o que um app faz.
 *
 * ## Toda mensagem do agente e precedida de "digitando"
 *
 * Mensagem que aparece do nada lê como cartao de motion. Com os tres pontinhos
 * antes, lê como alguem do outro lado. O indicador dura 0,5 s e some no frame
 * em que o balao entra, porque os dois juntos na tela seria erro de app.
 *
 * ## Todo lembrete chega as 7:00, e isso precisa estar escrito
 *
 * O cliente escolheu 7h, entao **toda mensagem do agente carrega 7:00**, dia
 * apos dia. Sem a hora em cada balao a cena mostrava mensagens em dias
 * diferentes sem provar o que a narracao afirma, que e a pontualidade. As
 * respostas dele vem alguns minutos depois, porque pessoa nao responde no
 * mesmo minuto.
 *
 * As mensagens de boas vindas ficam de fora dessa regra e levam 20:14: elas
 * sao o cadastro, aconteceram na vespera, e e o contraste com elas que faz o
 * 7:00 repetido ler como ritual.
 *
 * ## A alternancia audio / texto e proposital
 *
 * O agente manda audio num dia e texto no outro, e o cliente as vezes responde
 * e as vezes so **curte**. E o que uma conversa real de lembrete parece depois
 * da primeira semana: o engajamento cai de resposta para reacao sem o vinculo
 * cair junto. Mostrar sempre a mesma troca entusiasmada seria propaganda.
 *
 * ## Nenhuma conversa real na tela
 *
 * Os baloes sao recriados com a paleta do `whatsapp.ts`. Nenhuma captura de
 * tela de usuario entra na peca, e nenhuma reacao usa emoji de fonte: os
 * simbolos sao SVG, porque o render headless nao tem fonte de emoji e o que
 * sairia seria um retangulo vazio.
 */

export const CENA06_FRAMES = s(18);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.8);
/**
 * A conversa comeca no onboarding, e nao na pergunta do horario.
 *
 * Sem isso o painel abria como um retangulo preto quase vazio por cinco
 * segundos, porque a coluna e alinhada embaixo e so havia um balao. A boas
 * vindas nao e enchimento: e o momento em que o cliente estreia o MODO, que e
 * de onde o ritual parte.
 */
const DIA_ZERO = s(1.2);
const DIGITA_BOAS = s(1.7);
const BOAS_EM = s(2.3);
const DIGITA_PERGUNTA = s(3.4);
const PERGUNTA_EM = s(4.0);
const RESPOSTA_EM = s(5.3);

/** Onde o ritual comeca. Os dias sao medidos a partir daqui. */
const RITUAL_EM = s(6.2);

type Dia = {
  nome: string;
  /** Segundos depois de `RITUAL_EM`. Os intervalos encurtam de proposito. */
  t: number;
  tipo: "audio" | "texto";
  /** O texto, quando o agente escreve em vez de mandar audio. */
  msg?: string;
  /** Resposta escrita do cliente, quando ele responde. */
  resposta?: string;
  /** Quando ele respondeu. Sempre alguns minutos depois do lembrete. */
  respostaHora?: string;
  /** Quando ele so reage, em vez de responder. */
  curte?: "coracao" | "joinha";
};

/**
 * Cinco dias, com intervalos de 2,5 · 2,1 · 1,8 · 1,5 s.
 *
 * A aceleracao e o que impede a cena de virar monotonia: repeticao em intervalo
 * constante lê como loop travado, encurtando lê como rotina que ja pegou.
 */
const DIAS: Dia[] = [
  {
    nome: "terça-feira",
    t: 0,
    tipo: "audio",
    resposta: "valeu, já tomei!",
    respostaHora: "7:06",
  },
  {
    nome: "quarta-feira",
    t: 2.5,
    tipo: "texto",
    msg: "7h! bora de creatina antes do treino",
    resposta: "bora",
    respostaHora: "7:03",
  },
  { nome: "quinta-feira", t: 4.6, tipo: "audio", curte: "coracao" },
  {
    nome: "sexta-feira",
    t: 6.4,
    tipo: "texto",
    msg: "já tomou hoje?",
    curte: "joinha",
  },
  { nome: "sábado", t: 7.9, tipo: "audio", curte: "coracao" },
];

/** Deslocamentos dentro de um dia: marcacao, digitando, mensagem, reacao. */
const D_DIGITA = 0.3;
const D_MSG = 0.8;
const D_REACAO = 1.45;

const emDia = (d: Dia) => RITUAL_EM + s(d.t);

/** Onda curta do audio, desenhada uma vez e reusada. */
const ONDA = [
  0.4, 0.75, 0.5, 0.95, 0.65, 0.45, 0.85, 0.6, 0.35, 0.8, 0.55, 0.9, 0.6, 0.4,
];

/** Os tres pontinhos, com salto defasado. */
const Digitando: React.FC<{ o: number }> = ({ o }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        background: wa.balaoEntrada,
        borderRadius: 18,
        borderTopLeftRadius: 5,
        padding: "18px 22px",
        alignSelf: "flex-start",
        display: "flex",
        gap: 7,
        alignItems: "center",
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
              width: 10,
              height: 10,
              borderRadius: 5,
              background: wa.apoio,
              opacity: 0.45 + sobe * 0.55,
              transform: `translateY(${-sobe * 5}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

/** A marcacao central de data, como a do proprio app. */
const MarcaDia: React.FC<{ o: number; texto: string }> = ({ o, texto }) => (
  <div
    style={{
      alignSelf: "center",
      background: wa.barra,
      borderRadius: 10,
      padding: "8px 18px",
      fontFamily: UI,
      fontSize: 17,
      letterSpacing: "0.6px",
      textTransform: "uppercase",
      color: wa.apoio,
      ...entra(o, 8),
    }}
  >
    {texto}
  </div>
);

/** Coracao e joinha em SVG: o render headless nao tem fonte de emoji. */
const Reacao: React.FC<{ tipo: "coracao" | "joinha" }> = ({ tipo }) =>
  tipo === "coracao" ? (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M12 21s-7.5-4.7-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12c-1.8 4.3-9.3 9-9.3 9z"
        fill="#F0475B"
      />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M7 22H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3v10zm2-10.4 4.2-8.2a1 1 0 0 1 1.8.1l.4 1a4 4 0 0 1 .1 2.8L14.8 10H20a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 18.6 21H9V11.6z"
        fill="#F6C800"
      />
    </svg>
  );

/** O balao do agente com audio, com a onda correndo de verdade. */
const BalaoAudio: React.FC<{
  o: number;
  progresso: number;
  hora: string;
}> = ({ o, progresso, hora }) => (
  <div
    style={{
      background: wa.balaoEntrada,
      borderRadius: 18,
      borderTopLeftRadius: 5,
      padding: "14px 20px 8px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignSelf: "flex-start",
      ...entra(o, 12),
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          background: wa.verde,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="15" height="18" viewBox="0 0 12 14">
          <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
          <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
        </svg>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3, height: 38 }}>
        {ONDA.map((v, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 4 + v * 30,
              borderRadius: 2,
              background: i / ONDA.length <= progresso ? wa.lido : wa.apoio,
              opacity: i / ONDA.length <= progresso ? 0.95 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
    <div
      style={{
        fontFamily: UI,
        fontSize: 15,
        color: wa.apoio,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>0:12</span>
      <span>{hora}</span>
    </div>
  </div>
);

/** Balao de texto, de qualquer lado. */
const BalaoTexto: React.FC<{
  o: number;
  texto: string;
  hora: string;
  saida?: boolean;
  reacao?: "coracao" | "joinha";
  reacaoO?: number;
}> = ({ o, texto, hora, saida, reacao, reacaoO = 0 }) => (
  <div
    style={{
      position: "relative",
      alignSelf: saida ? "flex-end" : "flex-start",
      maxWidth: 440,
      marginBottom: reacao && reacaoO > 0.01 ? 16 : 0,
      ...entra(o, 12),
    }}
  >
    <div
      style={{
        background: saida ? wa.balaoSaida : wa.balaoEntrada,
        borderRadius: 18,
        borderTopLeftRadius: saida ? 18 : 5,
        borderTopRightRadius: saida ? 5 : 18,
        padding: "14px 18px",
        fontFamily: UI,
        fontSize: 22,
        color: wa.texto,
        lineHeight: 1.35,
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
      }}
    >
      <span>{texto}</span>
      <span style={{ fontSize: 15, color: wa.apoio, whiteSpace: "nowrap" }}>
        {hora}
      </span>
    </div>
    {reacao && reacaoO > 0.01 ? (
      <div
        style={{
          position: "absolute",
          left: 14,
          bottom: -14,
          background: wa.barra,
          borderRadius: 14,
          padding: "3px 8px",
          display: "flex",
          alignItems: "center",
          transform: `scale(${0.6 + reacaoO * 0.4})`,
          opacity: reacaoO,
        }}
      >
        <Reacao tipo={reacao} />
      </div>
    ) : null}
  </div>
);

export const Cena06: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, TELA_EM, CENA06_FRAMES, 11, 0);
  const pergunta = janela(f, PERGUNTA_EM, CENA06_FRAMES, 9, 0);
  const resposta = janela(f, RESPOSTA_EM, CENA06_FRAMES, 9, 0);
  // o indicador da pergunta some no frame em que o balao entra
  const digitaPergunta =
    f >= DIGITA_PERGUNTA && f < PERGUNTA_EM
      ? passo(f, DIGITA_PERGUNTA, DIGITA_PERGUNTA + 6)
      : 0;
  const diaZero = janela(f, DIA_ZERO, CENA06_FRAMES, 10, 0);
  const boas = janela(f, BOAS_EM, CENA06_FRAMES, 9, 0);
  const digitaBoas =
    f >= DIGITA_BOAS && f < BOAS_EM ? passo(f, DIGITA_BOAS, DIGITA_BOAS + 6) : 0;

  /** Qual dia esta tocando audio agora, para a onda correr no balao certo. */
  const ultimoAudio = DIAS.reduce<number>((ac, d, i) => {
    if (d.tipo === "audio" && f >= emDia(d) + s(D_MSG)) return i;
    return ac;
  }, -1);

  const fecho = janela(f, s(14.2), CENA06_FRAMES, 10, 0);

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
        {/* a tela recriada: a conversa empilha e o antigo sobe e sai */}
        <div
          style={{
            width: 660,
            flexShrink: 0,
            background: wa.fundoChat,
            borderRadius: marca.raio.arte,
            overflow: "hidden",
            boxShadow: marca.sombra.painel,
            ...entra(tela, 22),
          }}
        >
          {/* a barra do app: avatar e nome, como qualquer conversa.
              O 7:00 saiu daqui: hora de cabecalho nao existe no WhatsApp e
              competia com as 7:00 que cada lembrete carrega, que e onde o
              dado tem sentido. */}
          <div
            style={{
              background: wa.barra,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Img
              src={staticFile("marca-soldiers/modo-avatar.png")}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                display: "block",
                objectFit: "cover",
              }}
            />
            <div style={{ fontFamily: UI, fontSize: 23, color: wa.texto }}>
              MODO Soldiers
            </div>
          </div>

          <div
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              height: 440,
              justifyContent: "flex-end",
              overflow: "hidden",
            }}
          >
            {/* o onboarding, e depois a combinacao do horario */}
            {diaZero > 0.001 ? (
              <MarcaDia o={diaZero} texto="segunda-feira" />
            ) : null}
            {digitaBoas > 0.001 ? <Digitando o={digitaBoas} /> : null}
            {boas > 0.001 ? (
              <BalaoTexto
                o={boas}
                texto="Bem-vindo ao MODO Soldiers. Vou te acompanhar todo dia."
                hora="20:14"
              />
            ) : null}
            {digitaPergunta > 0.001 ? <Digitando o={digitaPergunta} /> : null}
            {pergunta > 0.001 ? (
              <BalaoTexto o={pergunta} texto="Que horas você costuma tomar?" hora="20:14" />
            ) : null}
            {resposta > 0.001 ? (
              <BalaoTexto o={resposta} texto="7h" hora="20:16" saida />
            ) : null}

            {/* e entao o ritual, dia a dia, acumulando */}
            {DIAS.map((d, i) => {
              const t0 = emDia(d);
              if (f < t0) return null;
              const oDia = passo(f, t0, t0 + 8);
              const tMsg = t0 + s(D_MSG);
              const tDigita = t0 + s(D_DIGITA);
              const oMsg = f >= tMsg ? passo(f, tMsg, tMsg + 8) : 0;
              const oDigita =
                f >= tDigita && f < tMsg ? passo(f, tDigita, tDigita + 5) : 0;
              const tReacao = t0 + s(D_REACAO);
              const oReacao = f >= tReacao ? passo(f, tReacao, tReacao + 7) : 0;
              const progresso =
                i === ultimoAudio
                  ? interpolate(f, [tMsg, tMsg + s(1.1)], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 1;

              return (
                <React.Fragment key={d.nome}>
                  <MarcaDia o={oDia} texto={d.nome} />
                  {oDigita > 0.001 ? <Digitando o={oDigita} /> : null}
                  {oMsg > 0.001 ? (
                    d.tipo === "audio" ? (
                      <div style={{ position: "relative", alignSelf: "flex-start" }}>
                        <BalaoAudio o={oMsg} progresso={progresso} hora="7:00" />
                        {d.curte && oReacao > 0.01 ? (
                          <div
                            style={{
                              position: "absolute",
                              left: 14,
                              bottom: -12,
                              background: wa.barra,
                              borderRadius: 14,
                              padding: "3px 8px",
                              display: "flex",
                              transform: `scale(${0.6 + oReacao * 0.4})`,
                              opacity: oReacao,
                            }}
                          >
                            <Reacao tipo={d.curte} />
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <BalaoTexto
                        o={oMsg}
                        texto={d.msg as string}
                        hora="7:00"
                        reacao={d.curte}
                        reacaoO={oReacao}
                      />
                    )
                  ) : null}
                  {d.resposta && oReacao > 0.001 ? (
                    <BalaoTexto o={oReacao} texto={d.resposta} hora={d.respostaHora ?? "7:05"} saida />
                  ) : null}
                </React.Fragment>
              );
            })}
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
              opacity: janela(f, s(0.6), CENA06_FRAMES, 9, 0),
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
              opacity: janela(f, s(1.2), CENA06_FRAMES, 10, 0),
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

      <Sfx som="tique" em={DIA_ZERO} volume={0.07} />
      <Sfx som="recebido" em={BOAS_EM} volume={0.16} />
      <Sfx som="pop" em={PERGUNTA_EM} volume={0.16} />
      <Sfx som="pop" em={RESPOSTA_EM} volume={0.16} />
      {DIAS.map((d) => (
        <React.Fragment key={d.nome}>
          <Sfx som="tique" em={emDia(d)} volume={0.07} />
          <Sfx som="recebido" em={emDia(d) + s(D_MSG)} volume={0.18} />
          {d.resposta || d.curte ? (
            <Sfx som="pop" em={emDia(d) + s(D_REACAO)} volume={0.12} />
          ) : null}
        </React.Fragment>
      ))}
      <Sfx som="surge" em={s(14.2)} volume={0.2} />
    </AbsoluteFill>
  );
};
