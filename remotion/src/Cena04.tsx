import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { janela, entra, passo, s } from "./anim";
import { Sfx } from "./Sfx";
import { IconeBalao } from "./Icones";
import { useFormato } from "./formato";

/**
 * Cena 04 do case: o desafio tecnico, dito pela Profissio.
 *
 * **A cena e um bloco de tres partes, nao uma cena so.** A narracao quebra em
 * "...quando enfrentam os seus desafios", entra a sonora do Clesio respondendo
 * qual foi o maior desafio, e so entao volta o "isso tudo no canal mais popular
 * do Brasil: o WhatsApp". Por isso o arquivo exporta `Cena04A` e `Cena04B`, e a
 * montagem poe a sonora entre as duas.
 *
 * O motivo da quebra e de sentido: solta depois da cena, a fala do Clesio ficava
 * desconexa, porque ela responde uma pergunta que ninguem tinha feito em voz
 * alta. Encaixada na frase que enuncia o desafio, ela vira resposta. A
 * sobrelinha "O maior desafio" no alto do plano dele fecha isso, porque quem
 * ouve entrou agora e precisa saber a pergunta.
 *
 * Os tempos saem dos silencios medidos nos arquivos de locucao, nunca de uma
 * grade: a `cena-04a` quebra em 1,96 s e termina em 11,48 s; a `cena-04b` tem
 * uma pausa em 2,58 s e o "o WhatsApp" comeca em 3,06 s.
 *
 * ## Por que esta cena nao tem imagem filmada
 *
 * A primeira versao usava b-roll gerado: alguem desenhando num quadro de vidro,
 * uma dupla na frente de um laptop, maos num teclado. Todos legiveis como banco
 * de imagem, **e nenhum deles dizia nada que a narracao ja nao dissesse**.
 *
 * A troca nao e de plano, e de criterio: **a tela de uma cena tecnica tem que
 * carregar informacao que a fala nao carrega.** Entao a cena mostra duas coisas
 * que nao estao na narracao: **o que um chatbot e** (o menu numerado que todo
 * mundo reconhece, e que e justo o que eles NAO fizeram) e **com o que a EITA
 * foi treinada** (as quatro fontes, num grafo que converge).
 *
 * ## O fecho
 *
 * A ultima frase nomeia o WhatsApp, e o cartao vai no **verde do canal**, nao no
 * azul da marca: aqui quem fala e o lugar onde a EITA mora, e o azul confundia o
 * canal com a Profissio. Continua sem logo de terceiro, so a cor, a palavra e um
 * balao generico.
 */

const MARGEM = 120;
const m = modos.claro;

/** O verde do canal. So aparece no cartao de fecho, nunca como cor da marca. */
const VERDE_CANAL = "#25D366";

// ---------------------------------------------------------------- parte A --

/**
 * 0,6 s de respiro + 11,62 s de locucao + 1,4 s para o avatar assentar.
 *
 * A cena ganhou 0,9 s em 23/set/2026: o avatar da EITA entra depois da ultima
 * palavra, e nome de marca que aparece e some em meio segundo nao se le.
 */
export const CENA04A_FRAMES = s(13.6);
const AUDIO_A_EM = s(0.6);

/** O menu que todo bot de atendimento tem, e que a EITA nao e. */
const MENU = [
  "1 · Falar com um atendente",
  "2 · Horários de atendimento",
  "3 · Voltar ao menu anterior",
];

/** As quatro fontes com que a IA foi treinada. */
const FONTES = [
  { texto: "20 anos de consultório", em: s(3.4) },
  { texto: "o método dela", em: s(5.2) },
  { texto: "o jeito dela de falar", em: s(7.0) },
  { texto: "o cuidado e empatia que ela tem", em: s(8.8) },
];

const CONVERGE = s(10.4);
const CURVAS_EM = s(10.8);
const CURVAS_ATE = s(11.6);
const AVATAR_EM = s(11.5);
const NOME_EM = s(11.9);

/*
 * ## Geometria do fecho: a lista tem que desaguar no avatar
 *
 * A versao anterior tinha a lista a esquerda com linhas correndo ate a borda,
 * e um cartao azul "uma IA que responde como ela" solto embaixo, a direita. O
 * usuario leu certo: **nada ali dizia que uma coisa e consequencia da outra**.
 * As linhas nao chegavam a lugar nenhum e o cartao nao vinha de lugar nenhum.
 *
 * Agora cada fonte termina num ponto comum a x=800, e dali sai uma curva que
 * converge no avatar da EITA, com um ponto correndo por ela. O avatar so entra
 * quando as quatro curvas chegam: ele e o resultado do treino, e a ordem na
 * tela e a ordem da causa.
 */
/**
 * A geometria do grafo, uma por formato.
 *
 * No 16:9 a lista fica a esquerda e as curvas correm para a direita ate o
 * avatar. **No 9:16 o grafo fica em pe**: a lista ocupa o alto, as linhas
 * correm ate a direita da lista e as quatro curvas descem convergindo no alto
 * do avatar, que assenta no meio do quadro com o nome embaixo. A causa
 * continua em cima da consequencia, agora no sentido da leitura.
 */
type Geo = {
  vertical: boolean;
  listaL: number;
  listaFim: number;
  itemY0: number;
  itemPasso: number;
  avCx: number;
  avCy: number;
  avTam: number;
  corpo: number;
};

const GEO_H: Geo = {
  vertical: false,
  listaL: 120,
  listaFim: 800,
  itemY0: 408,
  itemPasso: 80,
  avCx: 1440,
  avCy: 470,
  avTam: 250,
  corpo: 38,
};

const GEO_V: Geo = {
  vertical: true,
  listaL: 72,
  listaFim: 960,
  itemY0: 400,
  itemPasso: 100,
  avCx: 540,
  avCy: 1060,
  avTam: 300,
  corpo: 44,
};

/** Onde as curvas chegam: a esquerda do avatar no 16:9, em cima dele no 9:16. */
const chegada = (g: Geo): [number, number] =>
  g.vertical
    ? [g.avCx, g.avCy - g.avTam / 2 - 28]
    : [g.avCx - g.avTam / 2 - 28, g.avCy];

/**
 * Onde a linha da fonte `i` termina. No 16:9 e um ponto comum; no 9:16 elas
 * terminam em degrau (a de cima mais a direita), para as quatro curvas
 * descerem em faixas paralelas ate o avatar sem se cruzar.
 */
const fimDa = (i: number, g: Geo) => (g.vertical ? g.listaFim - i * 44 : g.listaFim);

const curva = (i: number, g: Geo) => {
  const c = chegada(g);
  const y = g.itemY0 + i * g.itemPasso;
  const fim = fimDa(i, g);
  const p0: [number, number] = [fim, y];
  const p1: [number, number] = g.vertical ? [fim, y + (c[1] - y) * 0.62] : [fim + 230, y];
  const p2: [number, number] = g.vertical ? [c[0], c[1] - 170] : [c[0] - 220, c[1]];
  return { p0, p1, p2, p3: c };
};

const noBezier = (c: ReturnType<typeof curva>, k: number): [number, number] => {
  const u = 1 - k;
  const a = u * u * u, b = 3 * u * u * k, d = 3 * u * k * k, e = k * k * k;
  return [
    a * c.p0[0] + b * c.p1[0] + d * c.p2[0] + e * c.p3[0],
    a * c.p0[1] + b * c.p1[1] + d * c.p2[1] + e * c.p3[1],
  ];
};

/** Uma fonte de treino: filete azul, texto, e a linha que corre ate x=800. */
const Fonte: React.FC<{
  texto: string;
  o: number;
  puxa: number;
  y: number;
  g: Geo;
  /** Onde a linha termina, em x do quadro. */
  fim: number;
}> = ({ texto, o, puxa, y, g, fim }) => (
  <div
    style={{
      position: "absolute",
      left: g.listaL,
      width: fim - g.listaL,
      top: y - 22,
      height: 44,
      display: "flex",
      alignItems: "center",
      gap: 20,
      ...entra(o, 14),
    }}
  >
    <div
      style={{
        width: 3,
        height: 34,
        background: marca.azul,
        borderRadius: 2,
        opacity: 0.35 + puxa * 0.65,
      }}
    />
    <div
      style={{
        fontSize: g.corpo,
        fontWeight: 500,
        letterSpacing: g.vertical ? "-1.54px" : "-1.33px",
        color: m.tinta,
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
    {/* a linha so existe depois que as quatro entraram: ate la nao ha para
        onde convergir, e uma linha apontando para nada e ruido */}
    <div
      style={{
        flex: 1,
        height: 2,
        background: marca.azul,
        opacity: 0.55,
        transformOrigin: "left",
        transform: `scaleX(${puxa})`,
      }}
    />
  </div>
);

export const Cena04A: React.FC = () => {
  const f = useCurrentFrame();

  const rotulo = janela(f, s(0.6), s(3.2), 14, 12);
  const menu = janela(f, s(0.9), s(3.2), 14, 12);
  // o menu apaga antes de sair: ele e o contraexemplo, nao a resposta
  const morre = passo(f, s(2.2), s(3.0));

  // a saida e uma so, do bloco inteiro: se cada elemento tambem saisse, as
  // opacidades se multiplicariam e o avatar apagaria antes do corte
  const rotulo2 = janela(f, s(3.0), CENA04A_FRAMES, 14, 6);
  const puxa = passo(f, CONVERGE, CONVERGE + s(0.6));
  const desenha = passo(f, CURVAS_EM, CURVAS_ATE);
  const avatar = janela(f, AVATAR_EM, CENA04A_FRAMES, 12, 0);
  // o avatar chega com um pequeno assentamento: 0,9 -> 1,03 -> 1
  const escala =
    f < AVATAR_EM
      ? 0.9
      : f < AVATAR_EM + 9
        ? 0.9 + 0.13 * passo(f, AVATAR_EM, AVATAR_EM + 9)
        : 1.03 - 0.03 * passo(f, AVATAR_EM + 9, AVATAR_EM + 16);
  const nome = janela(f, NOME_EM, CENA04A_FRAMES, 11, 0);
  const papel = janela(f, NOME_EM + 6, CENA04A_FRAMES, 11, 0);

  const { vertical, W, H, M, seguro } = useFormato();
  const g = vertical ? GEO_V : GEO_H;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />

      <Sequence from={AUDIO_A_EM}>
        <Audio src={staticFile("locucao/cena-04a.mp3")} />
      </Sequence>

      {/* --- o que eles NAO fizeram --- */}
      {menu > 0.001 ? (
        <AbsoluteFill
          style={
            vertical
              ? {
                  // no 9:16 o cartao centra na faixa segura, nao no quadro
                  padding: `${seguro.topo}px ${M}px ${H - seguro.base}px`,
                  justifyContent: "center",
                }
              : { padding: MARGEM, justifyContent: "center" }
          }
        >
          <div
            style={{
              fontSize: vertical ? 28 : 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: m.apoio,
              opacity: rotulo,
              marginBottom: 40,
            }}
          >
            Um chatbot faz isto
          </div>
          <div
            style={{
              opacity: menu * (1 - morre * 0.55),
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 1000,
              padding: 48,
              background: marca.branco,
              border: `1px solid ${marca.linha}`,
              borderRadius: marca.raio.painel,
              boxShadow: marca.sombra.painel,
              filter: `grayscale(${morre})`,
            }}
          >
            {MENU.map((linha) => (
              <div
                key={linha}
                style={{
                  fontSize: vertical ? 44 : 40,
                  letterSpacing: vertical ? "-1.54px" : "-1.4px",
                  color: m.apoio,
                  textDecoration: morre > 0.5 ? "line-through" : "none",
                }}
              >
                {linha}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- com o que a IA foi treinada, e o que ela virou --- */}
      {rotulo2 > 0.001 ? (
        <AbsoluteFill style={{ opacity: rotulo2 }}>
          <div
            style={{
              position: "absolute",
              left: g.listaL,
              top: g.itemY0 - 110,
              fontSize: vertical ? 28 : 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
            }}
          >
            A IA foi treinada com
          </div>

          {FONTES.map((fo, i) => (
            <Fonte
              key={fo.texto}
              texto={fo.texto}
              o={janela(f, fo.em, CENA04A_FRAMES, 14, 10)}
              puxa={puxa}
              y={g.itemY0 + i * g.itemPasso}
              g={g}
              fim={fimDa(i, g)}
            />
          ))}

          {/* as quatro curvas que desaguam no avatar, cada uma com um ponto
              correndo por ela: o device de grafo da referencia */}
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            {FONTES.map((fo, i) => {
              const c = curva(i, g);
              const d = `M ${c.p0[0]} ${c.p0[1]} C ${c.p1[0]} ${c.p1[1]}, ${c.p2[0]} ${c.p2[1]}, ${c.p3[0]} ${c.p3[1]}`;
              const k = passo(f, CURVAS_EM + i * 2, CURVAS_ATE + i * 2);
              const [px, py] = noBezier(c, k);
              return (
                <g key={fo.texto}>
                  <path
                    d={d}
                    fill="none"
                    stroke={marca.azul}
                    strokeWidth={2}
                    opacity={0.55}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - desenha}
                  />
                  {k > 0.001 && k < 0.999 ? (
                    <circle cx={px} cy={py} r={6} fill={marca.azul} />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {/* o resultado: o avatar da EITA, com o nome embaixo.

              O avatar e a ilustracao que ja aparece no canto dos videos da
              Anaclaudia (cenas 07 e 09), e nao o icone da lampada do logo:
              assim o rosto apresentado aqui e o mesmo que o espectador
              reencontra depois. Ele foi tirado da mediana de 44 quadros do
              bruto `ana-0112-0134.mp4`: a ilustracao e fixa na tela e o fundo
              atras dela se mexe com a camera, entao a mediana deixa o rosto
              nitido e alisa o predio que aparece pelo disco translucido.
              O icone da lampada ficou em `marca/eita-icone.png`. */}
          <div
            style={{
              position: "absolute",
              left: g.avCx - 260,
              width: 520,
              top: g.avCy - g.avTam / 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Img
              src={staticFile("marca/eita-avatar.png")}
              style={{
                width: g.avTam,
                height: g.avTam,
                opacity: avatar,
                transform: `scale(${escala})`,
                filter: `drop-shadow(0 24px 48px rgba(16,18,24,0.18)) blur(${(1 - avatar) * 6}px)`,
              }}
            />
            <div
              style={{
                marginTop: 34,
                fontSize: vertical ? 80 : 64,
                fontWeight: 500,
                letterSpacing: vertical ? "-2.8px" : "-2.24px",
                lineHeight: 1,
                color: m.tinta,
                ...entra(nome, 14),
              }}
            >
              EITA
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: vertical ? 40 : 34,
                fontWeight: 400,
                letterSpacing: vertical ? "-1.4px" : "-1.19px",
                color: m.apoio,
                ...entra(papel, 12),
              }}
            >
              Mentora Virtual
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="marca" em={s(2.2)} volume={0.18} />
      {FONTES.map((fo) => (
        <Sfx key={fo.texto} som="pop" em={fo.em} volume={0.16} />
      ))}
      <Sfx som="surge" em={CURVAS_EM} volume={0.2} />
      <Sfx som="assenta" em={AVATAR_EM + 4} volume={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- parte B --

/** 0,2 s + 4,18 s de locucao + meio segundo de cauda. */
export const CENA04B_FRAMES = s(4.9);
const AUDIO_B_EM = s(0.2);
const ICONE_EM = s(0.35);
/** A palavra so entra quando a locucao a diz: 3,06 s + 0,2 s de atraso. */
const PALAVRA_EM = s(3.26);

export const Cena04B: React.FC = () => {
  const f = useCurrentFrame();
  const icone = janela(f, ICONE_EM, CENA04B_FRAMES, 12, 0);
  const sobre = janela(f, ICONE_EM + s(0.2), CENA04B_FRAMES, 14, 0);
  const palavra = janela(f, PALAVRA_EM, CENA04B_FRAMES, 12, 0);
  const { vertical, H, M, seguro } = useFormato();

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte }}>
      <AbsoluteFill style={{ backgroundColor: VERDE_CANAL }} />

      <Sequence from={AUDIO_B_EM}>
        <Audio src={staticFile("locucao/cena-04b.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          // no 9:16 o bloco centra na faixa segura e cresce: e a tela inteira
          // dizendo uma palavra so
          padding: vertical ? `${seguro.topo}px ${M}px ${H - seguro.base}px` : MARGEM,
          justifyContent: "center",
          gap: 28,
        }}
      >
        <div style={entra(icone, 18)}>
          <IconeBalao cor={m.tinta} tam={vertical ? 160 : 132} />
        </div>
        <div
          style={{
            fontSize: vertical ? 46 : 40,
            fontWeight: 500,
            letterSpacing: vertical ? "-1.61px" : "-1.4px",
            color: m.tinta,
            opacity: sobre * 0.72,
          }}
        >
          o canal mais popular do Brasil
        </div>
        <div
          style={{
            fontSize: vertical ? 184 : 148,
            fontWeight: 500,
            letterSpacing: vertical ? "-6.44px" : "-5.18px",
            lineHeight: 1,
            color: m.tinta,
            marginTop: -16,
            ...entra(palavra, 26),
          }}
        >
          WhatsApp
        </div>
      </AbsoluteFill>

      <Sfx som="surge" em={0} volume={0.2} />
      <Sfx som="pop" em={ICONE_EM} volume={0.22} />
      <Sfx som="marca" em={PALAVRA_EM} volume={0.24} />
    </AbsoluteFill>
  );
};
