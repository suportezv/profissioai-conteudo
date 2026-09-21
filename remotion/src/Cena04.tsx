import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  Series,
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
 * 17,5 s, narracao de 15,84 s que comeca em 0,6 s.
 *
 * **Os cortes saem das pausas da propria locucao, nao de uma grade.** Os
 * silencios do arquivo foram medidos (`silencedetect`) e caem em 1,96 / 11,48 /
 * 14,24 / 15,53 s; somado o atraso de 0,6 s, e neles que a imagem vira. Cortar
 * em cima da respiracao e o que faz um corte seco parecer intencional em vez de
 * apressado.
 *
 * ## Por que os planos sao estes
 *
 * O clipe de bastidor que existia era o laboratorio azul escuro de banco de
 * imagem, e sozinho ele empurra um filme de saude mental para thriller de
 * tecnologia, que e exatamente a leitura recusada no moodboard. Ele continua
 * aqui, mas **no meio e cercado de luz de dia**: pessoa desenhando o fluxo,
 * dupla conversando na frente do laptop, maos no teclado com luz de janela. O
 * arco vira gente -> foco -> gente, e o azul frio passa a ler como concentracao
 * em vez de cenario.
 *
 * ## O fecho
 *
 * A ultima frase nomeia o WhatsApp, e ela ganha a superficie azul da marca com
 * **balao generico**, nunca o logo do canal: identidade de terceiro nao se
 * recria a mao numa peca de premiacao. O azul tambem so aparece aqui no filme
 * inteiro, entao o corte para ele e o acento da cena.
 */

export const CENA04_FRAMES = s(17.5);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

/** Os quatro planos, com o frame em que cada um entra. */
const PLANOS = [
  { arq: "c04-a-fluxo-quadro.mp4", em: 0, ate: s(4.0), de: 0 },
  { arq: "c04-b-bastidor.mp4", em: s(4.0), ate: s(8.2), de: s(2.2) },
  { arq: "c04-c-dupla-laptop.mp4", em: s(8.2), ate: s(11.9), de: 0 },
  { arq: "c04-d-maos-teclado.mp4", em: s(11.9), ate: s(14.9), de: s(0.6) },
];

/**
 * O cartao final entra na pausa antes da ultima frase, e **a palavra so entra
 * quando a locucao a diz**: 15,53 s medidos no arquivo, mais os 0,6 s de
 * atraso. Lettering que se adianta a fala entrega a piada antes da hora.
 */
const FECHO_EM = s(14.9);
const ICONE_EM = FECHO_EM + s(0.4);
const PALAVRA_EM = s(15.4);

/** Escurece o alto do quadro o bastante para a sobrelinha ler, e so. */
const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to bottom, rgba(16,18,24,0.55) 0%, rgba(16,18,24,0) 38%)",
    }}
  />
);

export const Cena04: React.FC = () => {
  const f = useCurrentFrame();

  // a sobrelinha acompanha a primeira frase e sai quando a segunda comeca
  const rotulo = janela(f, s(0.8), s(4.2), 14, 12);
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

      {/* os planos: corte seco, sem dissolve, como manda o roteiro */}
      <Series>
        {PLANOS.map((p) => (
          <Series.Sequence key={p.arq} durationInFrames={p.ate - p.em}>
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile("broll/" + p.arq)}
                startFrom={p.de}
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>

      {rotulo > 0.001 ? (
        <AbsoluteFill style={{ opacity: rotulo }}>
          <Scrim />
          <div
            style={{
              position: "absolute",
              left: MARGEM,
              top: MARGEM,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.branco,
              ...entra(rotulo, 14),
            }}
          >
            O desafio
          </div>
        </AbsoluteFill>
      ) : null}

      {/* fecho: a superficie azul cobre o plano quando a frase nomeia o canal */}
      {fecho > 0.001 ? (
        <AbsoluteFill style={{ opacity: fecho }}>
          <Superficie modo="azul" />
          <AbsoluteFill
            style={{
              padding: MARGEM,
              justifyContent: "center",
              gap: 28,
            }}
          >
            <div style={entra(icone, 18)}>
              <IconeBalao cor={marca.branco} tam={132} />
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 500,
                letterSpacing: "-1.4px",
                color: marca.apoioAzul,
                ...entra(sobre, 16),
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
                color: marca.branco,
                marginTop: -16,
                ...entra(palavra, 26),
              }}
            >
              WhatsApp
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* som so no fecho: sob nove segundos de narracao, tique de corte vira
          sujeira, e o roteiro pede ritmo seco */}
      <Sfx som="surge" em={FECHO_EM} volume={0.2} />
      <Sfx som="pop" em={ICONE_EM} volume={0.22} />
      <Sfx som="marca" em={PALAVRA_EM} volume={0.24} />
    </AbsoluteFill>
  );
};
