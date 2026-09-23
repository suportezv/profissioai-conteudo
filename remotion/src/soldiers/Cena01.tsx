import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, conta, br, s, tiquesDaContagem } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 01 do case Soldiers: o produto nao diferencia.
 *
 * 12 s, narracao de 9,94 s que comeca em 1,0 s. Pausas medidas no arquivo
 * (1,86 / 5,83 / 9,65 s), somado o atraso: "Creatina e creatina" fecha em
 * 2,86, o dado de mercado em 6,83 e a frase do preco em 10,65.
 *
 * ## Tres tempos, um por frase da narracao
 *
 * A primeira versao tinha dois: o plano filmado com o dado de mercado por
 * cima, e os potes. **Nao funcionou por dois motivos.** O dado, escrito sobre
 * a prateleira, competia com a prateleira e nao era lido como dado; e os potes
 * ficavam quase sete segundos em cena para uma frase que dura tres.
 *
 * Agora cada frase tem o seu tempo:
 *
 * 1. **A gondola filmada** (0 a 3,4 s), enquanto a narracao diz "creatina e
 *    creatina". Com aproximacao lenta, porque plano parado de 3 s lê como foto.
 * 2. **O tamanho do mercado** (3,2 a 7,0 s), sozinho na superficie clara. O
 *    numero conta em vez de aparecer pronto, que e o que faz o espectador
 *    esperar por ele.
 * 3. **A decisao** (6,8 a 12 s): dois potes iguais, so o preco muda, e o
 *    cursor pousa no mais barato.
 *
 * ## O que a cena mostra e a narracao nao diz
 *
 * O gancho precisa da prateleira real, porque "creatina e creatina" e uma
 * afirmacao sobre o mundo: desenhada, vira opiniao; filmada, vira constatacao.
 * E os potes executam a decisao que aquela prateleira produz, em vez de
 * ilustra-la.
 *
 * Os potes sao genericos de proposito. **Nenhum rotulo de marca, nem da
 * Soldiers nem de concorrente**: a cena fala do mercado inteiro, e pintar um
 * concorrente aqui seria comparacao, que o `Comunicacao_Profissio.md` proibe.
 * Pelo mesmo motivo o clipe foi conferido quadro a quadro antes de entrar: os
 * rotulos dizem "CRE...", nunca uma marca legivel.
 */

export const CENA01_FRAMES = s(11.5);
const AUDIO_EM = s(1.0);
const MARGEM = 120;
const m = modos.claro;

/**
 * Os tres tempos. Cada um cobre uma frase da narracao, e **todos saem das
 * marcas de palavra do arquivo de locucao**, nao de estimativa: a faixa entra
 * em `AUDIO_EM`, entao tempo de cena e tempo de audio mais 1,0 s.
 *
 * Marcas do Scribe na faixa atual: a frase de efeito fecha em 1,72; a segunda
 * frase abre em 2,58 e diz "7,6" entre 3,62 e 4,54; a terceira abre em 6,16 e
 * poe "preco" entre 8,52 e 8,84.
 */
const GONDOLA_ATE = s(3.5);
const MERCADO_EM = s(3.35);

/**
 * A contagem tem tempo proprio, e nao um deslocamento a partir do rotulo.
 *
 * O rotulo entra quando a frase comeca; o numero tem que **assentar na palavra
 * falada**, que vem quase um segundo depois. Derivar um do outro amarrava os
 * dois a uma distancia fixa que quebrava a cada regravacao da locucao.
 */
const CONTA_EM = s(4.45);
const CONTA_ATE = s(5.65);

const MERCADO_ATE = s(7.15);
const ENTRA_POTES = s(7.05);

const CAI_PRECO = s(9.0);
const CURSOR_CHEGA = s(9.9);
const ESCOLHE = s(10.6);

/**
 * A frase de efeito que abre o filme, em quatro tempos: "Creatina / e tudo /
 * igual, / ne?".
 *
 * **O texto mudou em 23/set**, depois de o usuario recusar as tres versoes de
 * "Creatina e creatina" com desdem. A frase agora diz a tese do mercado com
 * todas as letras, entao a sobrelinha deixou de ser "Tudo igual?" (repetiria a
 * frase) e passou a dizer de quem e a fala. O take e da voz Lair no
 * `eleven_multilingual_v2`, com os ajustes do filme e `next_text` apontando
 * para "Num mercado...", emendado no arquivo aprovado em 2,15 s: o resto da
 * cena nao mudou de tempo. Dos oito takes, todos transcritos certo, ficou o de
 * mediana de f0 mais alta (124 Hz contra 101 da frase seguinte) e o unico que
 * sustenta a altura em "igual" em vez de cair nele.
 *
 * "IGUAL," entra na tonica da palavra e leva o som forte. O "ne?" foi pedido
 * depois, com a entonacao aprovada: por isso ele e emendado no mesmo take (o
 * "ne?" vem do take 5, que sobe de 113 para 124 Hz, na altura em que o take 2
 * termina o "igual"), e nao um take novo da frase inteira. A pausa entre
 * "igual," e "ne?" e de 0,14 s: a primeira emenda tinha 0,32 s, a do take
 * original, e o usuario ouviu como pausa longa demais. Com quatro tempos a
 * segunda linha nao cabia a 132 px, e o corpo desceu para 112.
 */
const PALAVRAS: { texto: string; em: number }[] = [
  { texto: "CREATINA", em: s(1.08) },
  { texto: "É TUDO", em: s(1.52) },
  { texto: "IGUAL,", em: s(1.9) },
  { texto: "NÉ?", em: s(2.38) },
];

const Estalo: React.FC<{ o: number; children: React.ReactNode }> = ({
  o,
  children,
}) => (
  <span
    style={{
      display: "inline-block",
      opacity: o,
      transform: `scale(${interpolate(o, [0, 1], [1.08, 1])})`,
      filter: `blur(${(1 - o) * 12}px)`,
    }}
  >
    {children}
  </span>
);

/**
 * A silhueta do pote, desenhada e nao sugerida por um retangulo.
 *
 * O quadrado cinza que estava aqui antes nao lia como suplemento. A forma e a
 * de qualquer pote do mercado, tampa larga e corpo cilindrico, **sem rotulo**,
 * porque o argumento da cena e que eles sao indistinguiveis.
 */
const PoteSilhueta: React.FC<{ cor: string; altura: number }> = ({
  cor,
  altura,
}) => (
  <svg
    viewBox="0 0 120 168"
    style={{ height: altura, width: "auto", display: "block" }}
  >
    <rect x="28" y="4" width="64" height="22" rx="7" fill={cor} />
    <path
      d="M24 28 h72 a8 8 0 0 1 8 8 v116 a10 10 0 0 1 -10 10 h-68 a10 10 0 0 1 -10 -10 v-116 a8 8 0 0 1 8 -8 z"
      fill={cor}
    />
    {/* a janela do rotulo, vazia: nao ha marca nenhuma nesta cena */}
    <rect
      x="34"
      y="64"
      width="52"
      height="58"
      rx="5"
      fill={marca.branco}
      opacity="0.9"
    />
  </svg>
);

/** Um pote: silhueta neutra, peso igual, so o preco distingue. */
const Pote: React.FC<{
  preco: number;
  o: number;
  escolhido: boolean;
  destaque: boolean;
}> = ({ preco, o, escolhido, destaque }) => (
  <div
    style={{
      flexGrow: 1,
      background: marca.branco,
      border: `1px solid ${escolhido ? marca.azul : marca.linha}`,
      borderRadius: marca.raio.painel,
      boxShadow: escolhido ? marca.sombra.azul : marca.sombra.painel,
      padding: 40,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 22,
      ...entra(o, 22),
    }}
  >
    <PoteSilhueta cor={escolhido ? marca.azul : "#C7CEDA"} altura={230} />
    <div
      style={{
        fontSize: 28,
        letterSpacing: "-0.98px",
        color: m.apoio,
        textAlign: "center",
      }}
    >
      creatina monoidratada · 300 g
    </div>
    <div
      style={{
        fontSize: 68,
        fontWeight: 500,
        letterSpacing: "-2.38px",
        lineHeight: 1,
        color: destaque ? marca.azul : m.tinta,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      R$ {br(preco, 0)}
    </div>
  </div>
);

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();

  const gondola = interpolate(
    f,
    [GONDOLA_ATE - s(0.4), GONDOLA_ATE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // aproximacao lenta e continua: plano parado de tres segundos le como foto
  const zoom = interpolate(f, [0, GONDOLA_ATE], [1, 1.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mercado = janela(f, MERCADO_EM, MERCADO_ATE, 10, 9);
  const bilhoes = conta(f, CONTA_EM, CONTA_ATE, 7.6);

  const potes = janela(f, ENTRA_POTES, CENA01_FRAMES, 11, 0);
  const precoB = conta(f, CAI_PRECO, CAI_PRECO + s(0.8), 22);
  const cursor = passo(f, CURSOR_CHEGA, CURSOR_CHEGA + s(0.6));
  const escolheu = f >= ESCOLHE;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-01.mp3")} />
      </Sequence>

      {/* ---------- 1. a gondola filmada ---------- */}
      {gondola > 0.001 ? (
        <AbsoluteFill style={{ opacity: gondola, zIndex: 3, overflow: "hidden" }}>
          <OffthreadVideo
            src={staticFile("soldiers-broll/c01-gondola.mp4")}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`,
              transformOrigin: "60% 50%",
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(90deg, rgba(16,18,24,0.66) 0%, rgba(16,18,24,0.3) 34%, rgba(16,18,24,0) 60%)",
            }}
          />
          <AbsoluteFill
            style={{
              padding: MARGEM,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: marca.apoioEscuro,
                opacity: janela(f, s(0.5), GONDOLA_ATE, 10, 10),
              }}
            >
              O mercado de suplementação
            </div>

            {/* a frase de efeito, empilhada para a repeticao ser vista */}
            <div>
              {/* a pergunta em cima transforma a frase em provocacao: sozinha
                  ela e constatacao, com a duvida acima ela cobra resposta */}
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: marca.ciano,
                  marginBottom: 18,
                  opacity: passo(f, s(0.6), s(0.6) + 8),
                }}
              >
                O que o mercado diz
              </div>
            <div
              style={{
                fontSize: 112,
                fontWeight: 500,
                letterSpacing: "-3.92px",
                lineHeight: 1.02,
                color: marca.branco,
                maxWidth: 1180,
                textShadow: "0 12px 44px rgba(16,18,24,0.55)",
              }}
            >
              <Estalo o={passo(f, PALAVRAS[0].em, PALAVRAS[0].em + 7)}>
                <span style={{ color: marca.apoioEscuro }}>“</span>
                {PALAVRAS[0].texto}
              </Estalo>
              <br />
              <Estalo o={passo(f, PALAVRAS[1].em, PALAVRAS[1].em + 7)}>
                {PALAVRAS[1].texto}
              </Estalo>{" "}
              <Estalo o={passo(f, PALAVRAS[2].em, PALAVRAS[2].em + 7)}>
                {PALAVRAS[2].texto}
              </Estalo>{" "}
              <Estalo o={passo(f, PALAVRAS[3].em, PALAVRAS[3].em + 7)}>
                {PALAVRAS[3].texto}
                <span style={{ color: marca.apoioEscuro }}>”</span>
              </Estalo>
            </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* ---------- 2. o tamanho do mercado, sozinho ---------- */}
      {mercado > 0.001 ? (
        <AbsoluteFill
          style={{
            padding: MARGEM,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 34,
            opacity: mercado,
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: m.apoio,
            }}
          >
            Suplementação no Brasil
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 24,
              ...entra(mercado, 22),
            }}
          >
            <div
              style={{
                fontSize: 230,
                fontWeight: 500,
                letterSpacing: "-8.05px",
                lineHeight: 0.95,
                color: marca.azul,
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 20px 56px rgba(36,88,245,0.22)",
              }}
            >
              R$ {br(bilhoes, 1)} bi
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 500,
                letterSpacing: "-1.54px",
                color: m.apoio,
              }}
            >
              por ano
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 32,
              borderTop: "1px solid rgba(16,18,24,0.22)",
              paddingTop: 22,
              maxWidth: 1180,
            }}
          >
            <div
              style={{
                fontSize: 46,
                fontWeight: 500,
                letterSpacing: "-1.61px",
              }}
            >
              +15% em 2025
            </div>
            <div
              style={{ fontSize: 26, letterSpacing: "-0.91px", color: m.apoio }}
            >
              fonte: BRASNUTRI
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ---------- 3. a decisao ---------- */}
      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: m.apoio,
            opacity: janela(f, ENTRA_POTES, CENA01_FRAMES, 9, 0),
          }}
        >
          Mesmo produto, mesma dose
        </div>

        <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
          <Pote preco={119} o={potes} escolhido={false} destaque={false} />
          <Pote
            preco={119 - precoB}
            o={potes}
            escolhido={escolheu}
            destaque={precoB > 0.5}
          />
        </div>
      </AbsoluteFill>

      {/* o cursor: entra pela direita e para em cima do preco mais barato */}
      {cursor > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: 1420 + (1 - cursor) * 420,
            top: 706 + (1 - cursor) * 160,
            opacity: cursor,
            zIndex: 4,
          }}
        >
          <svg width="46" height="52" viewBox="0 0 24 28">
            <path
              d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.5 L18 15.5 Z"
              fill={marca.tinta}
              stroke={marca.branco}
              strokeWidth="1.4"
            />
          </svg>
        </div>
      ) : null}

      <Sfx som="tique" em={PALAVRAS[0].em} volume={0.14} />
      <Sfx som="tique" em={PALAVRAS[1].em} volume={0.12} />
      <Sfx som="marca" em={PALAVRAS[2].em} volume={0.26} />
      <Sfx som="tique" em={PALAVRAS[3].em} volume={0.12} />
      <Sfx som="surge" em={MERCADO_EM} volume={0.2} />
      {tiquesDaContagem(CONTA_EM, CONTA_ATE).map((fr, i) => (
        <Sfx key={i} som="tique" em={fr} volume={0.06} />
      ))}
      <Sfx som="assenta" em={CONTA_ATE} volume={0.34} />
      <Sfx som="pop" em={ENTRA_POTES} volume={0.18} />
      <Sfx som="tique" em={CAI_PRECO} volume={0.12} />
      <Sfx som="assenta" em={CAI_PRECO + s(0.8)} volume={0.3} />
      <Sfx som="marca" em={ESCOLHE} volume={0.28} />
    </AbsoluteFill>
  );
};
