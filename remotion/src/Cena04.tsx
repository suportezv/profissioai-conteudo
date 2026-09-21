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
import { janela, entra, passo, s } from "./anim";
import { Sfx } from "./Sfx";
import { IconeBalao } from "./Icones";

/**
 * Cena 04 do case: o desafio tecnico, dito pela Profissio.
 *
 * 17,5 s, narracao de 15,84 s que comeca em 0,6 s. Os tempos abaixo saem dos
 * silencios medidos no arquivo de locucao (1,96 / 11,48 / 14,24 / 15,53 s),
 * somados ao atraso de 0,6 s.
 *
 * ## Por que esta cena nao tem imagem filmada
 *
 * A primeira versao usava b-roll gerado: alguem desenhando num quadro de
 * vidro, uma dupla na frente de um laptop, maos num teclado. Todos legiveis
 * como banco de imagem, **e nenhum deles dizia nada que a narracao ja nao
 * dissesse**. Pior: eram pessoas genericas num filme sobre um produto
 * brasileiro, o que tira credibilidade em vez de dar.
 *
 * A troca nao e de plano, e de criterio: **a tela de uma cena tecnica tem que
 * carregar informacao que a fala nao carrega.** E a gramatica das empresas de
 * IA que servem de referencia ao estudio, e tambem a da marca (o grafo de nos
 * do @elevenlabsio). Entao a cena mostra duas coisas que nao estao na
 * narracao: **o que um chatbot e** (o menu numerado que todo mundo reconhece,
 * e que e justo o que eles NAO fizeram) e **com o que a EITA foi treinada**
 * (as quatro fontes, num grafo que converge).
 *
 * Efeito colateral que vale registrar: a cena passou a custar zero em API.
 *
 * ## O fecho
 *
 * A ultima frase nomeia o WhatsApp, e o cartao vai no **verde do canal**, nao
 * no azul da marca: aqui quem fala e o lugar onde a EITA mora, e o azul
 * confundia o canal com a Profissio. Continua sem logo de terceiro, so a cor,
 * a palavra e um balao generico.
 */

export const CENA04_FRAMES = s(17.5);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

/** O verde do canal. So aparece no cartao de fecho, nunca como cor da marca. */
const VERDE_CANAL = "#25D366";

/** O menu que todo bot de atendimento tem, e que a EITA nao e. */
const MENU = [
  "1 · Falar com um atendente",
  "2 · Horários de atendimento",
  "3 · Voltar ao menu anterior",
];

/** As quatro fontes com que a EITA foi treinada. */
const FONTES = [
  { texto: "20 anos de consultório", em: s(3.4) },
  { texto: "o método dela", em: s(5.2) },
  { texto: "o jeito dela de falar", em: s(7.0) },
  { texto: "o que nunca se responde", em: s(8.8) },
];

const CONVERGE = s(10.6);
const FECHO_EM = s(14.9);
const ICONE_EM = FECHO_EM + s(0.4);
/** A palavra so entra quando a locucao a diz: 15,53 s + 0,6 s de atraso. */
const PALAVRA_EM = s(15.4);

/** Uma fonte de treino: filete azul, texto, e a linha que corre para o centro. */
const Fonte: React.FC<{ texto: string; o: number; puxa: number }> = ({
  texto,
  o,
  puxa,
}) => (
  <div
    style={{
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
        fontSize: 38,
        fontWeight: 500,
        letterSpacing: "-1.33px",
        color: m.tinta,
      }}
    >
      {texto}
    </div>
    {/* a linha so existe depois que as quatro entraram: ate la nao ha para
        onde convergir, e uma linha apontando para nada e ruido */}
    <div
      style={{
        flex: 1,
        height: 1,
        background: marca.linha,
        transformOrigin: "left",
        transform: `scaleX(${puxa})`,
      }}
    />
  </div>
);

export const Cena04: React.FC = () => {
  const f = useCurrentFrame();

  const rotulo = janela(f, s(0.6), s(3.2), 14, 12);
  const menu = janela(f, s(0.9), s(3.2), 14, 12);
  // o menu apaga antes de sair: ele e o contraexemplo, nao a resposta
  const morre = passo(f, s(2.2), s(3.0));

  const rotulo2 = janela(f, s(3.0), s(14.6), 14, 12);
  const puxa = passo(f, CONVERGE, CONVERGE + s(1.1));
  const convergiu = janela(f, CONVERGE + s(0.5), s(14.6), 16, 12);

  const fecho = passo(f, FECHO_EM, FECHO_EM + s(0.5));
  const icone = janela(f, ICONE_EM, CENA04_FRAMES, 12, 0);
  const sobre = janela(f, ICONE_EM + s(0.2), CENA04_FRAMES, 14, 0);
  const palavra = janela(f, PALAVRA_EM, CENA04_FRAMES, 12, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" />

      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao/cena-04.mp3")} />
      </Sequence>

      {/* --- beat 1: o que eles NAO fizeram --- */}
      {menu > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div style={{ opacity: rotulo, marginBottom: 40 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: m.apoio,
              }}
            >
              Um chatbot faz isto
            </div>
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
              filter: `grayscale(${morre})`,
            }}
          >
            {MENU.map((linha) => (
              <div
                key={linha}
                style={{
                  fontSize: 40,
                  letterSpacing: "-1.4px",
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

      {/* --- beat 2: com o que a EITA foi treinada --- */}
      {rotulo2 > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: rotulo2,
              marginBottom: 48,
            }}
          >
            A EITA foi treinada com
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 30,
              opacity: rotulo2,
            }}
          >
            {FONTES.map((fo) => (
              <Fonte
                key={fo.texto}
                texto={fo.texto}
                o={janela(f, fo.em, s(14.6), 14, 12)}
                puxa={puxa}
              />
            ))}
          </div>

          {/* o ponto para onde as quatro linhas convergem */}
          <div
            style={{
              marginTop: 52,
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 36px",
              background: marca.azul,
              borderRadius: marca.raio.painel,
              ...entra(convergiu, 16),
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 500,
                letterSpacing: "-1.54px",
                color: marca.branco,
              }}
            >
              uma IA que responde como ela
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- beat 3: o canal --- */}
      {fecho > 0.001 ? (
        <AbsoluteFill style={{ opacity: fecho }}>
          <AbsoluteFill style={{ backgroundColor: VERDE_CANAL }} />
          <AbsoluteFill
            style={{ padding: MARGEM, justifyContent: "center", gap: 28 }}
          >
            <div style={entra(icone, 18)}>
              <IconeBalao cor={m.tinta} tam={132} />
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 500,
                letterSpacing: "-1.4px",
                color: m.tinta,
                opacity: sobre * 0.72,
              }}
            >
              o canal mais popular do Brasil
            </div>
            <div
              style={{
                fontSize: 148,
                fontWeight: 500,
                letterSpacing: "-5.18px",
                lineHeight: 1,
                color: m.tinta,
                marginTop: -16,
                ...entra(palavra, 26),
              }}
            >
              WhatsApp
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Sfx som="marca" em={s(2.2)} volume={0.18} />
      {FONTES.map((fo) => (
        <Sfx key={fo.texto} som="pop" em={fo.em} volume={0.16} />
      ))}
      <Sfx som="surge" em={CONVERGE} volume={0.2} />
      <Sfx som="surge" em={FECHO_EM} volume={0.2} />
      <Sfx som="pop" em={ICONE_EM} volume={0.22} />
      <Sfx som="marca" em={PALAVRA_EM} volume={0.24} />
    </AbsoluteFill>
  );
};
