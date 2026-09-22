import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca } from "../marca";
import { passo, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 00 do case Yooper: a abertura conceitual, gerada no Veo.
 *
 * 4,2 s, sem narracao e sem lettering. **E o padrao da casa**: os cases 03 e 04
 * abrem com um plano que estabelece o mundo do filme antes de qualquer
 * afirmacao, e este segue a mesma regra.
 *
 * ## Por que este plano, e nao o primeiro que saiu
 *
 * A primeira geracao foi a leitura automatica de "empresa de dados": um
 * executivo de terno, de costas, diante de graficos holograficos flutuando
 * sobre a cidade. Bonita e **exatamente a foto de banco de imagem** que o case
 * 04 ja tinha recusado, com o agravante de trazer numeros falsos ilegiveis
 * renderizados na tela, que leem como artefato de IA.
 *
 * O plano que ficou e fisico em vez de holografico e aponta para **o canal**,
 * nao para o dado: um celular deitado numa mesa escura, tela acesa, ninguem
 * tocando nele, e a chuva da cidade desfocada atras. E o objeto de que o filme
 * inteiro trata, e a categoria e Experiencia do Cliente no WhatsApp.
 *
 * Uma terceira tentativa, o corredor de mesas vazias, saiu com **borda de
 * filme fotografico desenhada no quadro**: pedir "35mm film grain" fez o modelo
 * renderizar a pelicula em vez do grao. Fica registrada como armadilha de
 * prompt.
 *
 * ## O audio nao e o do clipe
 *
 * Video gerado vem com trilha propria que ninguem controla, e ja apareceu com
 * fala e com musica onde o prompt nao pediu. A atmosfera daqui e SFX gerado a
 * parte, que se mede e se refaz.
 *
 * ## O corte para a cena 01 e seco
 *
 * Do quarto escuro e quente para a superficie clara do dashboard, sem
 * transicao. O contraste e o primeiro argumento do filme: o mundo real e
 * noturno e ambiguo, o painel e limpo e nao decide nada.
 */

export const CENA00_FRAMES = s(4.2);

/** Onde o clipe comeca: o rack focus ja saiu do bokeh e vai para o celular. */
const ENTRA_EM = 2.8;

export const Cena00: React.FC = () => {
  const f = useCurrentFrame();

  // abre do preto e empurra de leve: plano parado de quatro segundos lê como foto
  const abre = passo(f, 0, s(0.7));
  const empurra = interpolate(f, [0, CENA00_FRAMES], [1.02, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      {/* a ancora da escala fica no celular, nao no centro do quadro.
          Deslocar com translateY descobria a borda do video, porque o
          objectFit cover preenche exatamente; mudar a origem do scale
          aproxima do mesmo jeito e nunca abre buraco. */}
      <AbsoluteFill
        style={{
          opacity: abre,
          transform: `scale(${empurra})`,
          transformOrigin: "50% 80%",
        }}
      >
        <OffthreadVideo
          src={staticFile("yooper/abertura-celular.mp4")}
          startFrom={Math.round(ENTRA_EM * 24)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* vinheta: empurra as bordas para tras e segura o olho no celular */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(74% 70% at 50% 68%, transparent 30%, rgba(0,0,0,0.70) 100%)",
          opacity: abre,
        }}
      />

      <Sfx som="chuva-noite" em={0} volume={0.5} />
    </AbsoluteFill>
  );
};
