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
 * 4,8 s em **dois planos**, com a narração já correndo por cima. É o padrão da
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
 * ## Dois planos, e o corte cai na palavra
 *
 * O plano A é o analista gesticulando; o B é a travelling lateral pela tela.
 * O corte acontece em **2,30 s, exatamente quando a locução diz "dashboard"**:
 * a palavra e a imagem chegam juntas, o que é o oposto de cortar quando o
 * plano cansou.
 *
 * ## A locução começa aqui, e por isso o arquivo foi partido
 *
 * A abertura anterior rodava muda, e o usuário pegou isso. A `cena-01.mp3` foi
 * cortada em 2,5 s, no silêncio entre "entrega dashboard" e "o dado está lá":
 * a primeira metade toca aqui, a segunda abre a cena 01. Partir no silêncio é
 * o que faz o corte de cena ser invisível para o ouvido.
 *
 * ## O reenquadramento do plano A não é gosto
 *
 * A tela ao fundo dele saiu com texto ilegível gerado, que lê como artefato de
 * IA. A escala com a origem deslocada para a direita empurra aquele lado para
 * fora e desfoca o que sobra, sem precisar de máscara; a origem também sobe,
 * porque recortar só pela horizontal cortava o alto da cabeça. O áudio dos
 * dois clipes fica mudo: vídeo gerado traz trilha que ninguém pediu.
 */

export const CENA00_FRAMES = s(4.8);

/** Onde o plano B entra. Cai em cima da palavra "dashboard". */
const CORTE = s(2.3);
const NARRACAO_EM = s(0.7);

/** Onde cada clipe começa, em segundos do arquivo de origem (24 fps). */
const A_DE = 3.0;
const B_DE = 2.0;

export const Cena00: React.FC = () => {
  const f = useCurrentFrame();
  const abre = passo(f, 0, s(0.5));

  // plano A: recorte forte à direita, que é o que tira a tela do quadro
  const empurraA = interpolate(f, [0, CORTE], [1.16, 1.24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // plano B: aproximação leve, só para o plano não ler como foto
  const empurraB = interpolate(f, [CORTE, CENA00_FRAMES], [1.02, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      {f < CORTE ? (
        <AbsoluteFill
          style={{
            opacity: abre,
            transform: `scale(${empurraA})`,
            transformOrigin: "74% 42%",
          }}
        >
          <OffthreadVideo
            src={staticFile("yooper/abertura-analista.mp4")}
            startFrom={Math.round(A_DE * 24)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{ transform: `scale(${empurraB})`, transformOrigin: "50% 50%" }}
        >
          <OffthreadVideo
            src={staticFile("yooper/abertura-dados.mp4")}
            startFrom={Math.round(B_DE * 24)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

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
