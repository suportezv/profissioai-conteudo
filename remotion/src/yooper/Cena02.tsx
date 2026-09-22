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
 * Cena 02 do case Yooper: o caminho que a pergunta tomava antes.
 *
 * 13,5 s. Locucao de 9,71 s entrando em 0,4 s, e **2,8 s de cena depois que a
 * narracao acaba**. Esse silencio nao e sobra: e onde a ultima mensagem cai
 * com um check so.
 *
 * Marcas de palavra, ja com o atraso: "especifica" 1,40 · "o caminho era o de
 * sempre" 2,56 · "mandar mensagem para o analista" 4,34 · "esperar" 5,96 ·
 * "Funciona" 6,96 · "depende de alguem estar disponivel" 8,04.
 *
 * ## A espera precisa ter tamanho, e uma mensagem so nao tem
 *
 * A versao anterior mostrava **uma** pergunta parada com dois checks. Aquilo
 * dizia "ninguem respondeu ainda", que e um inconveniente. Com cinco mensagens
 * ao longo de tres dias, com as marcacoes de data entre elas, a tela passa a
 * dizer **quanto tempo**, e a espera vira um problema de operacao em vez de um
 * atraso.
 *
 * A escalada e de tom, nao de drama: as mensagens ficam mais curtas e mais
 * secas conforme os dias passam, que e como gente realmente cobra.
 *
 * ## O check que falta e a virada da cena
 *
 * As quatro primeiras chegam: **dois checks cinza**, entregue e nao lido. A
 * quinta fica com **um check so**, ou seja nem chegou ao aparelho do outro
 * lado. E o pior estado dos dois, e nenhuma linha da narracao o menciona: e
 * informacao que so a tela carrega. Por isso ela cai **depois** da narracao
 * terminar, em silencio.
 *
 * ## A coluna da direita ficou com uma frase so
 *
 * Ela carregava tambem a anotacao "entregue, nao lido", uma barra de espera e
 * o rotulo "tres dias". O usuario mandou tirar os tres, e a peca ficou melhor:
 * **a contagem de check e a marcacao de data ja estao dentro da conversa**, e
 * repetir em lettering o que a tela mostra transforma prova em legenda. Sobrou
 * a sobrelinha e a frase que a narracao diz.
 *
 * ## Sem vilao, e isso e deliberado
 *
 * A narracao diz "funciona", e a cena concorda: o analista nao e lento, ele e
 * uma pessoa com horario. Nada fica vermelho e ninguem e nomeado. O contato na
 * barra e **o cargo**, porque inventar uma pessoa para ela ser o gargalo seria
 * mesquinho e desnecessario.
 */

export const CENA02_FRAMES = s(13.5);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.5);
const ROTULO_EM = s(2.56);
const CHECKS_EM = s(4.34);
const TESE_EM = s(8.04);
/** A ultima mensagem cai depois da narracao, em silencio. */
const SEM_ENTREGA_EM = s(11.3);

type Msg = {
  texto: string;
  hora: string;
  em: number;
  /** Quando os checks aparecem. Ausente na ultima, que nunca chega. */
  checkEm?: number;
  dia?: string;
  diaEm?: number;
};

/**
 * Cinco mensagens em tres dias. As frases encurtam de proposito: e assim que
 * alguem cobra de novo sem querer parecer que esta cobrando.
 */
const MSGS: Msg[] = [
  {
    texto: "consegue me mandar o ROAS por campanha de setembro até hoje?",
    hora: "14:32",
    em: s(1.4),
    checkEm: CHECKS_EM,
  },
  {
    texto: "oi, conseguiu olhar?",
    hora: "9:12",
    em: s(6.3),
    checkEm: s(6.6),
    dia: "quarta-feira",
    diaEm: s(5.9),
  },
  {
    texto: "é pra reunião das 3, se der",
    hora: "11:47",
    em: s(7.9),
    checkEm: s(8.2),
  },
  {
    texto: "bom dia! alguma chance hoje?",
    hora: "8:05",
    em: s(9.9),
    checkEm: s(10.2),
    dia: "quinta-feira",
    diaEm: s(9.5),
  },
  { texto: "consegue hoje?", hora: "15:20", em: SEM_ENTREGA_EM },
];

/** Um check ou dois, em SVG. Cinza e entregue; azul seria lido, e nao foi. */
const Checks: React.FC<{ cor: string; dois?: boolean }> = ({ cor, dois = true }) => (
  <svg width={dois ? 22 : 13} height="13" viewBox={dois ? "0 0 22 13" : "9 0 13 13"}>
    {dois ? (
      <path
        d="M1 7.2l3.4 3.4L11.2 2"
        stroke={cor}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : null}
    <path
      d="M9.6 7.2L13 10.6 20.8 2"
      stroke={cor}
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MarcaDia: React.FC<{ o: number; texto: string }> = ({ o, texto }) => (
  <div
    style={{
      alignSelf: "center",
      background: wa.barra,
      borderRadius: 10,
      padding: "6px 16px",
      fontFamily: UI,
      fontSize: 15,
      letterSpacing: "0.6px",
      textTransform: "uppercase",
      color: wa.apoio,
      ...entra(o, 8),
    }}
  >
    {texto}
  </div>
);

export const Cena02: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, TELA_EM, CENA02_FRAMES, 12, 0);
  const rotulo = janela(f, ROTULO_EM, CENA02_FRAMES, 10, 0);
  const tese = janela(f, TESE_EM, CENA02_FRAMES, 12, 0);
  const pisca = f % 32 < 17 ? 1 : 0;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-02.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          flexDirection: "row",
          alignItems: "center",
          gap: 84,
        }}
      >
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
          {/* o cargo, nao um nome: a cena nao precisa de culpado */}
          <div
            style={{
              background: wa.barra,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* o contato padrao do proprio app: circulo cinza com a silhueta.
                Um disco cinza chapado lê como imagem que nao carregou, e foi
                assim que ele foi lido no corte anterior. Aqui e uma pessoa sem
                foto, que e o que a cena precisa: o analista nao tem marca. */}
            <svg width="46" height="46" viewBox="0 0 46 46">
              <circle cx="23" cy="23" r="23" fill="#4A5860" />
              <circle cx="23" cy="18" r="7.4" fill="#C9D2D6" />
              <path d="M9.5 41a13.5 13.5 0 0 1 27 0z" fill="#C9D2D6" />
            </svg>
            <div style={{ fontFamily: UI, fontSize: 23, color: wa.texto }}>
              Analista de mídia
            </div>
          </div>

          <div
            style={{
              padding: 24,
              height: 470,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 12,
              overflow: "hidden",
            }}
          >
            {MSGS.map((msg) => {
              const o = janela(f, msg.em, CENA02_FRAMES, 9, 0);
              if (o <= 0.001) return null;
              const oDia =
                msg.dia && msg.diaEm !== undefined
                  ? janela(f, msg.diaEm, CENA02_FRAMES, 8, 0)
                  : 0;
              const oCheck =
                msg.checkEm !== undefined ? passo(f, msg.checkEm, msg.checkEm + 7) : 0;
              const semEntrega = msg.checkEm === undefined;
              return (
                <React.Fragment key={msg.hora}>
                  {oDia > 0.001 ? <MarcaDia o={oDia} texto={msg.dia as string} /> : null}
                  <div
                    style={{
                      alignSelf: "flex-end",
                      maxWidth: 470,
                      background: wa.balaoSaida,
                      borderRadius: 18,
                      borderTopRightRadius: 5,
                      padding: "13px 17px",
                      fontFamily: UI,
                      fontSize: 22,
                      color: wa.texto,
                      lineHeight: 1.35,
                      ...entra(o, 12),
                    }}
                  >
                    {msg.texto}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 5,
                      }}
                    >
                      <span style={{ fontSize: 15, color: wa.apoio }}>{msg.hora}</span>
                      {/* a ultima entra ja com um check: ela nunca chegou */}
                      <div style={{ opacity: semEntrega ? o : oCheck }}>
                        <Checks cor={wa.apoio} dois={!semEntrega} />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* o campo vazio: ninguem esta digitando do outro lado */}
          <div
            style={{
              background: wa.teclado,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                background: wa.tecla,
                borderRadius: 22,
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ width: 2, height: 22, background: wa.apoio, opacity: pisca }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30, flex: 1 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: rotulo,
            }}
          >
            O caminho de sempre
          </div>

          {tese > 0.001 ? (
            <div
              style={{
                fontSize: 52,
                fontWeight: 500,
                letterSpacing: "-1.82px",
                lineHeight: 1.2,
                ...entra(tese, 18),
              }}
            >
              Funciona.
              <br />
              <span style={{ color: marca.azul }}>
                Depende de alguém
                <br />
                estar disponível.
              </span>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      {MSGS.map((msg) => (
        <React.Fragment key={msg.hora}>
          <Sfx som="pop" em={msg.em} volume={msg.checkEm === undefined ? 0.1 : 0.16} />
          {msg.diaEm !== undefined ? (
            <Sfx som="tique" em={msg.diaEm} volume={0.06} />
          ) : null}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
