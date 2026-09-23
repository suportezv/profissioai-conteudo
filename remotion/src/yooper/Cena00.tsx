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
import { marca } from "../marca";
import { passo, s } from "../anim";

/**
 * Cena 00 do case Yooper: a agência apresentando o relatório.
 *
 * 4,8 s num **plano só**, com a narração já correndo por cima. É o padrão da
 * casa desde o case 03: o filme abre com um plano que estabelece o mundo antes
 * de qualquer afirmação.
 *
 * ## A abertura custou quatro rodadas, e cada recusa ensinou uma coisa
 *
 * 1. **Executivo de terno diante de gráficos holográficos sobre a cidade.** A
 *    leitura automática de "empresa de dados", e exatamente a foto de banco de
 *    imagem que o case 04 já tinha recusado, ainda por cima com números falsos
 *    ilegíveis renderizados na tela.
 * 2. **Corredor de mesas vazias.** Saiu com borda de filme fotográfico
 *    desenhada dentro do quadro: pedir "35mm film grain" faz o modelo desenhar
 *    a película em vez do grão.
 * 3. **Celular na mesa com a chuva da cidade desfocada atrás.** Bonito, e o
 *    usuário cortou com a pergunta que virou o critério da casa: **qual a
 *    relação entre esta imagem e a frase "toda agência de mídia entrega
 *    dashboard"?** Nenhuma. Clima não é conceito.
 * 4. **Sala de reunião vazia com a tela ligada.** Mais perto, e ainda faltava:
 *    a tese tem duas metades e a sala vazia só mostrava a segunda.
 *
 * O que ficou mostra a **entrega acontecendo**: alguém apresentando, gesto,
 * expressão, e a câmera correndo pelos dados na tela. A segunda metade, a
 * decisão que não acontece, é a cena 01 inteira.
 *
 * ## Era em dois planos, e virou um
 *
 * A primeira versão abria com o analista gesticulando e cortava para a
 * travelling pela tela em 2,30 s, exatamente na palavra "dashboard". O corte
 * na palavra funcionava, mas o usuário cortou o plano do analista: **um rosto
 * em close abre um filme sobre uma pessoa**, e este é sobre a operação dela.
 * A travelling sozinha diz "a entrega está acontecendo" sem prometer um
 * personagem que o filme não tem.
 *
 * O clipe do analista fica em `broll/`, porque a decisão pode voltar se algum
 * corte derivado precisar de rosto na abertura.
 *
 * ## A locução começa aqui, e por isso o arquivo foi partido
 *
 * A abertura anterior rodava muda, e o usuário pegou isso. A `cena-01.mp3` foi
 * cortada em 2,5 s, no silêncio entre "entrega dashboard" e "o dado está lá":
 * a primeira metade toca aqui, a segunda abre a cena 01. Partir no silêncio é
 * o que faz o corte de cena ser invisível para o ouvido.
 *
 * ## O áudio do clipe fica mudo
 *
 * Vídeo gerado traz trilha, e às vezes fala, que ninguém pediu. A atmosfera,
 * quando precisa existir, é gerada à parte, onde dá para medir e refazer.
 */

export const CENA00_FRAMES = s(5.3);

const NARRACAO_EM = s(0.7);

/** Onde o clipe começa, em segundos do arquivo de origem (24 fps). */
const DE = 1.5;

export const Cena00: React.FC = () => {
  const f = useCurrentFrame();
  const abre = passo(f, 0, s(0.5));

  // aproximação leve: o dolly do clipe já anda, isto só impede o plano de
  // ler como foto no primeiro segundo
  const empurra = interpolate(f, [0, CENA00_FRAMES], [1.02, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      <AbsoluteFill
        style={{
          opacity: abre,
          transform: `scale(${empurra})`,
          transformOrigin: "50% 50%",
        }}
      >
        <OffthreadVideo
          src={staticFile("yooper/abertura-dados.mp4")}
          startFrom={Math.round(DE * 24)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* vinheta discreta: os dois planos são claros, então ela é leve */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(90% 84% at 50% 50%, transparent 46%, rgba(0,0,0,0.42) 100%)",
          opacity: abre,
        }}
      />

      <Sequence from={NARRACAO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-01a.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
