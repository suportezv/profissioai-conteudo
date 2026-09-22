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
 * ## Por que este plano, e as tres tentativas que ele custou
 *
 * A abertura tem que ser **do que a narracao diz**, nao um clima bonito. A
 * primeira linha do filme e "toda agencia de midia entrega dashboard", e o
 * plano precisa carregar as duas metades da tese: **a entrega aconteceu** e
 * **a decisao nao**.
 *
 * Uma sala de reuniao vazia a noite, com a tela grande ainda ligada na parede
 * e as cadeiras encostadas na mesa, diz as duas coisas numa imagem so. O
 * conteudo da tela fica estourado e ilegivel de proposito: nao e o dado que
 * importa, e o fato de ele estar la sem ninguem na frente.
 *
 * Os dois planos recusados no caminho valem como registro:
 *
 * 1. **O executivo de terno diante de graficos holograficos sobre a cidade.**
 *    E a leitura automatica de "empresa de dados" e e exatamente a foto de
 *    banco de imagem que o case 04 ja tinha recusado, com numeros falsos
 *    ilegiveis renderizados na tela, que leem como artefato de IA.
 * 2. **O celular na mesa com a chuva da cidade desfocada atras.** Bonito, e o
 *    usuario cortou com a pergunta certa: qual a relacao de um celular com
 *    luzes ao fundo e a frase "toda agencia de midia entrega dashboard"?
 *    Nenhuma. **Clima nao e conceito**, e abertura de case nao e cartao
 *    postal.
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
 * Da sala escura com a tela estourada para a superficie clara do dashboard,
 * sem transicao. As duas imagens rimam de proposito: a segunda e o que estava
 * naquela tela, agora legivel, completo e igualmente incapaz de decidir
 * sozinho.
 */

export const CENA00_FRAMES = s(4.2);

/** Onde o clipe comeca. O dolly ja esta em movimento, entao a cena nasce andando. */
const ENTRA_EM = 2.0;

export const Cena00: React.FC = () => {
  const f = useCurrentFrame();

  // abre do preto e empurra de leve: plano parado de quatro segundos lê como foto
  const abre = passo(f, 0, s(0.7));
  const empurra = interpolate(f, [0, CENA00_FRAMES], [1.01, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      {/* o dolly do proprio clipe ja aproxima; a escala daqui so acrescenta
          um empurrao continuo. Deslocar com translate descobriria a borda do
          video, porque o objectFit cover preenche exatamente: quando precisar
          reenquadrar, mexer na origem do scale, nunca no translate. */}
      <AbsoluteFill style={{ opacity: abre, transform: `scale(${empurra})` }}>
        <OffthreadVideo
          src={staticFile("yooper/abertura-sala.mp4")}
          startFrom={Math.round(ENTRA_EM * 24)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* vinheta: empurra as bordas para tras e segura o olho no celular */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(82% 78% at 50% 48%, transparent 34%, rgba(0,0,0,0.60) 100%)",
          opacity: abre,
        }}
      />

      <Sfx som="sala-noite" em={0} volume={0.55} />
    </AbsoluteFill>
  );
};
