import React from "react";
import { AbsoluteFill, Audio, Sequence, Series, staticFile } from "remotion";
import { s } from "./anim";
import { Cena01, CENA01_FRAMES } from "./Cena01";
import { Cena03, CENA03_FRAMES } from "./Cena03";
import { Cena06, CENA06_FRAMES } from "./Cena06";
import { Cena07, CENA07_FRAMES } from "./Cena07";
import { Cena08, CENA08_FRAMES } from "./Cena08";
import { Cena09, CENA09_FRAMES } from "./Cena09";
import { Placeholder } from "./Placeholder";

/**
 * Corte de montagem do case, ponta a ponta.
 *
 * Junta o que existe e **ocupa com cartao de lacuna o que ainda nao foi
 * captado**, no tempo exato que a cena vai ter. Serve para julgar o filme
 * antes da captacao: se o ritmo nao funciona aqui, nao vai funcionar depois.
 *
 * Duas coisas que este corte nao e:
 *
 *  - **Nao tem 2:00.** Soma 1:53, porque as cenas prontas ficaram mais curtas
 *    que a estimativa do roteiro (a locucao real deu 17% menos que o previsto)
 *    e a cena 01 tem os 8 s do clipe, nao os 11 s da tabela. A diferenca esta
 *    detalhada no `PLANO.md`; fechar em 2:00 e decisao de montagem, nao de
 *    codigo, e depende das sonoras reais.
 *  - **Nao tem trilha nem mixagem.** So a locucao, no volume em que saiu. O
 *    master a -14 LUFS e o ultimo passo, depois das sonoras.
 *
 * A cena 01 nao carrega a locucao dentro dela de proposito: a narracao entra
 * depois do silencio de abertura, e esse atraso e uma decisao de montagem.
 * Aqui ela e colocada por cima, com a Sequence.
 */

const FPS = 30;

/** Onde a narracao da cena 01 entra, contado do inicio do filme. */
const NARRACAO_01_EM = s(1.2);

/** Tempo dos cartoes de lacuna, tirado do roteiro. */
const LACUNA_02 = s(13);
const LACUNA_04 = s(17.5);
const LACUNA_05 = s(12);
const LACUNA_07_SONORA = s(5);

export const COMPLETO_FRAMES =
  CENA01_FRAMES +
  LACUNA_02 +
  CENA03_FRAMES +
  LACUNA_04 +
  LACUNA_05 +
  CENA06_FRAMES +
  CENA07_FRAMES +
  LACUNA_07_SONORA +
  CENA08_FRAMES +
  CENA09_FRAMES;

export const Completo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence durationInFrames={CENA01_FRAMES}>
        <AbsoluteFill>
          <Cena01 />
          {/* a narracao entra depois do silencio de abertura */}
          <Sequence from={NARRACAO_01_EM}>
            <Audio src={staticFile("locucao/cena-01.mp3")} />
          </Sequence>
        </AbsoluteFill>
      </Series.Sequence>

      <Series.Sequence durationInFrames={LACUNA_02}>
        <Placeholder
          cena="02"
          rotulo="Sonora a captar"
          titulo="Anaclaudia Zani, no consultório"
          detalhe="“Eu percebi que a conta não fechava e precisava levar o que aprendi nesses 20 anos de consultório para o máximo de pessoas possível.” GC entra depois da frase: 547 mil psicólogos no Brasil · R$ 200 a R$ 2.000 por sessão."
          origem="Captação: janela, cortina fina, plano médio, tripé travado. Referência de luz no artboard de fotografia do moodboard."
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA03_FRAMES}>
        <Cena03 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={LACUNA_04}>
        <AbsoluteFill>
          <Placeholder
            cena="04"
            rotulo="Bastidor a captar · locução pronta"
            titulo="O desafio, dito pela Profissio"
            detalhe="Tela de código, painel do agente sendo configurado, equipe trabalhando. Ritmo seco, sem música épica. Fecha no ícone do WhatsApp na última frase."
            origem="Captação: equipe real da Profissio, ou Gravações Base no Drive. A locução já está sincronizada neste corte."
          />
          {/* a locucao da 04 ja existe e toca por cima do cartao: e ela que da
              o tempo real da cena, nao o chute do roteiro */}
          <Sequence from={s(0.6)}>
            <Audio src={staticFile("locucao/cena-04.mp3")} />
          </Sequence>
        </AbsoluteFill>
      </Series.Sequence>

      <Series.Sequence durationInFrames={LACUNA_05}>
        <Placeholder
          cena="05"
          rotulo="Sonora a captar"
          titulo="Clésio Souza, na Profissio"
          detalhe="“Foi construir uma IA que não fale para o usuário o que ele quer ouvir, mas sim o que a Anaclaudia falaria para ele.”"
          origem="Captação: mesma gramática de luz da cena 02, para o corte entre as duas parecer o mesmo filme."
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA06_FRAMES}>
        <Cena06 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA07_FRAMES}>
        <Cena07 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={LACUNA_07_SONORA}>
        <Placeholder
          cena="07"
          rotulo="Sonora a captar"
          titulo="Anaclaudia ouvindo a própria voz"
          detalhe="Reação, não fala preparada. A pergunta que puxa: o que você sentiu ao ouvir sua própria voz respondendo alguém que você nunca vai conhecer?"
          origem="Captação junto com a cena 02. O áudio real do produto precisa de aprovação e checagem de LGPD."
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA08_FRAMES}>
        <Cena08 />
      </Series.Sequence>

      <Series.Sequence durationInFrames={CENA09_FRAMES}>
        <Cena09 />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
