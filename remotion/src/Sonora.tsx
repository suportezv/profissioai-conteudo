import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { marca } from "./marca";
import { PlanoVertical, type Fala } from "./PlanoVertical";
import { janela, entra, s } from "./anim";

/**
 * Uma sonora: plano filmado com som proprio e o GC de quem fala.
 *
 * O GC entra depois da primeira frase, nao junto com o corte. Nome aparecendo
 * no mesmo frame em que a pessoa comeca a falar rouba a frase: quem le nao
 * ouve. Entra no segundo beat, segura e sai antes do fim do plano.
 *
 * O filete e azul porque na peca a marca e quem apresenta quem fala. Sobre
 * imagem filmada o texto e branco com sombra curta, nunca caixa cheia: caixa
 * preta sobre rosto e legenda de telejornal, e o filme nao e isso.
 *
 * **Mas sombra sozinha nao garante leitura.** A linha de apoio, no cinza
 * #AAB3C4, sumiu sobre uma janela clara no fundo do plano: cinza claro sobre
 * claro nao le, por mais sombra que tenha. Entrou um veu no canto inferior
 * esquerdo, que aparece e some junto com o GC. Ele fica aqui, no componente, e
 * nao na cena, porque as sonoras que ainda vao ser captadas vao usar este
 * mesmo GC sobre planos que ninguem viu: a legibilidade tem que ser do
 * componente, nao da sorte do enquadramento.
 */
export const Sonora: React.FC<{
  arquivo: string;
  nome: string;
  papel: string;
  /** Quando o GC entra, em segundos, contados do inicio do plano. */
  gcEm?: number;
  /** Quanto tempo o GC fica, em segundos. */
  gcDura?: number;
  /**
   * Sobrelinha no alto do quadro, dizendo do que a pessoa esta falando.
   *
   * Existe porque uma sonora cortada no meio de uma narracao perde o assunto:
   * quem ouve entrou agora e nao sabe a pergunta que foi feita. Duas palavras
   * no alto devolvem o contexto sem roubar a frase.
   */
  rotulo?: string;
  /**
   * Plano gravado na vertical, que nao preenche o quadro.
   *
   * O material da Anaclaudia e de celular, 1080x1920. Para encher um 16:9 sem
   * deformar seria preciso cortar uma faixa de 608px de altura, e ai **some o
   * cabelo e sobra meio rosto**: a largura do fonte ja esta toda em uso, entao
   * nao existe "afastar a camera" dentro de um corte. A saida e o contrario de
   * cortar mais: mostrar o plano quase inteiro e **nao preencher o quadro**.
   *
   * O espaco que sobra nao fica vazio, vira o lugar do GC, na superficie clara
   * com regua de 1px. Isso resolve de quebra a legibilidade que antes obrigava
   * um veu por cima da imagem, e assume o que o material e: filmado no
   * celular, numa peca que documenta uma conversa de WhatsApp.
   */
  vertical?: boolean;
  /** Quando a EITA responde em audio, para o balao entrar. */
  fala?: Fala;
  /**
   * Ganho do som do plano, para nivelar sonoras gravadas em condicoes
   * diferentes.
   *
   * As tres do filme chegaram longe uma da outra: a Anaclaudia em -18,5 e
   * -18,7 LUFS, perto da narracao (-19,5), e o Clesio em **-12,0**, sete
   * decibeis acima de tudo. Isso nao se conserta no master, que mede o filme
   * inteiro e so empurra a media: quem esta alto continua alto no lugar dele.
   *
   * O ajuste mora aqui, no componente, e nao no arquivo: o bruto do Clesio foi
   * aprovado como esta, e corrigir nivel reescrevendo o asset perde o
   * original. Aqui o numero fica visivel e volta atras numa linha.
   */
  volume?: number;
  /**
   * Se o GC com nome e papel entra.
   *
   * **A segunda aparicao da mesma pessoa nao se credita de novo.** Quem ja foi
   * apresentado continua apresentado; repetir o nome trata o espectador como
   * se ele tivesse esquecido em noventa segundos, e rouba a tela de uma cena
   * que ali esta contando outra coisa. Vale para a Anaclaudia, que fala nas
   * cenas 02 e 07.
   */
  creditar?: boolean;
  /**
   * Os planos de uma sonora horizontal, cortados na fala: **punch-in de rede
   * social**, cada oracao num enquadramento.
   *
   * O take da Anaclaudia da cena 02 foi gravado de longe: ela ocupa menos de
   * um terco da altura, com parede, sofa e um quadro grande em volta. Um zoom
   * fixo so aproximava; o pedido era **acompanhar o que ela fala**, e isso e
   * corte seco na primeira palavra de cada oracao, alternando medio e close,
   * com o mais fechado guardado para o fecho da frase. Dentro de cada plano a
   * escala ainda deriva 3%, para nenhum deles ler como foto.
   *
   * **A aproximacao se faz movendo a origem do `scale`, nunca com
   * `translate`.** O `objectFit: cover` preenche o quadro exatamente, entao
   * deslocar descobre a borda e aparece faixa preta. A origem de cada plano e
   * calculada para os olhos cairem onde o enquadramento pede
   * (`O = (z*alvo_fonte - alvo_tela) / (z - 1)`) e presa dentro do quadro, o
   * que garante que a janela nunca sai do video.
   *
   * O teto e 1,6x: o material e 1024x576, e acima disso a janela real no
   * bruto fica abaixo de 640 px de largura e o rosto amolece.
   */
  planos?: { em: number; zoom: number; origem: string }[];
}> = ({
  arquivo,
  nome,
  papel,
  gcEm = 2.4,
  gcDura = 3.4,
  rotulo,
  vertical = false,
  fala,
  volume = 1,
  creditar = true,
  planos,
}) => {
  const f = useCurrentFrame();
  const gc = creditar ? janela(f, s(gcEm), s(gcEm + gcDura), 14, 14) : 0;
  const rot = janela(f, s(0.3), s(3.6), 14, 12);

  // o plano vigente e o ultimo cujo inicio ja passou; a deriva vai ate o
  // proximo corte (ou ate 3 s, no ultimo plano)
  const plano = (() => {
    if (!planos || planos.length === 0) return undefined;
    let i = 0;
    for (let k = 0; k < planos.length; k++) if (f >= s(planos[k].em)) i = k;
    const a = planos[i];
    const ate = i + 1 < planos.length ? s(planos[i + 1].em) : s(a.em + 3);
    const z = interpolate(f, [s(a.em), ate], [a.zoom, a.zoom * 1.03], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { z, origem: a.origem };
  })();

  const video = (
    <OffthreadVideo
      src={staticFile("broll/" + arquivo)}
      volume={volume}
      style={
        vertical
          ? { height: "100%", width: "auto" }
          : {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              ...(plano
                ? { transform: `scale(${plano.z})`, transformOrigin: plano.origem }
                : {}),
            }
      }
    />
  );

  if (vertical) {
    return (
      <AbsoluteFill style={{ fontFamily: marca.fonte }}>
        <PlanoVertical arquivo={arquivo} fala={fala} />

        {/* o veu segue o GC, para o nome ler sobre o fundo desfocado */}
        {gc > 0.001 ? (
          <AbsoluteFill
            style={{
              opacity: gc,
              background:
                "linear-gradient(to top right, rgba(16,18,24,0.58) 0%, rgba(16,18,24,0.24) 24%, rgba(16,18,24,0) 48%)",
            }}
          />
        ) : null}

        {/* mesmo canto do GC do Clesio: credito de sonora mora embaixo a
            esquerda, nas duas, senao cada entrevistado parece de um filme */}
        {gc > 0.001 ? (
          <div
            style={{
              position: "absolute",
              left: 120,
              bottom: 120,
              display: "flex",
              gap: 24,
              alignItems: "stretch",
              maxWidth: 640,
              textShadow: "0 2px 18px rgba(16,18,24,0.6)",
              ...entra(gc, 16),
            }}
          >
            <div style={{ width: 3, background: marca.azul, borderRadius: 2 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 46,
                  fontWeight: 500,
                  letterSpacing: "-1.61px",
                  lineHeight: 1.05,
                  color: marca.branco,
                }}
              >
                {nome}
              </div>
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: "-0.91px",
                  color: marca.apoioEscuro,
                  lineHeight: 1.2,
                }}
              >
                {papel}
              </div>
            </div>
          </div>
        ) : null}

        {rotulo ? (
          <div
            style={{
              position: "absolute",
              right: 72,
              top: 96,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.branco,
              ...entra(rot, 14),
            }}
          >
            {rotulo}
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: marca.tinta }}>
      {video}

      {rotulo && rot > 0.001 ? (
        <AbsoluteFill style={{ opacity: rot, fontFamily: marca.fonte }}>
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to bottom, rgba(16,18,24,0.55) 0%, rgba(16,18,24,0) 34%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 120,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.branco,
              ...entra(rot, 14),
            }}
          >
            {rotulo}
          </div>
        </AbsoluteFill>
      ) : null}

      {gc > 0.001 ? (
        <AbsoluteFill
          style={{
            opacity: gc,
            background:
              "linear-gradient(to top right, rgba(16,18,24,0.62) 0%, rgba(16,18,24,0.28) 26%, rgba(16,18,24,0) 52%)",
          }}
        />
      ) : null}

      {gc > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: 120,
            bottom: 120,
            display: "flex",
            gap: 24,
            alignItems: "stretch",
            fontFamily: marca.fonte,
            textShadow: "0 2px 18px rgba(16,18,24,0.55)",
            ...entra(gc, 16),
          }}
        >
          <div style={{ width: 3, background: marca.azul, borderRadius: 2 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 500,
                letterSpacing: "-1.61px",
                color: marca.branco,
                lineHeight: 1.05,
              }}
            >
              {nome}
            </div>
            <div
              style={{
                fontSize: 26,
                letterSpacing: "-0.91px",
                color: marca.apoioEscuro,
                lineHeight: 1.2,
              }}
            >
              {papel}
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
