import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { passo, s } from "./anim";
import { interpolate } from "remotion";
import { BalaoAudio } from "./BalaoAudio";
import { wa } from "./whatsapp";
import { Sfx } from "./Sfx";
import { useFormato } from "./formato";

/**
 * Plano gravado na vertical ocupando um quadro 16:9, sem corte e sem barra.
 *
 * ## O problema, com numero
 *
 * O material da Anaclaudia e 1080x1920 de celular. Para preencher 1920x1080
 * sem deformar seria preciso ampliar 1,78x e ficar com uma faixa de 608px de
 * altura, e ai **sai o cabelo dela ou sai o queixo**: a largura do fonte ja
 * esta toda em uso, entao nao existe afastar a camera dentro de um corte. As
 * duas coisas que o pedido queria, tela cheia e sem zoom, nao cabem juntas.
 *
 * ## A saida
 *
 * O plano inteiro vai no centro, no tamanho que cabe na altura, e **as laterais
 * recebem uma copia ampliada e desfocada dele mesmo**. O quadro fica cheio, o
 * corte continua sendo nenhum, e o que preenche nao inventa informacao: e a
 * propria imagem, sem nitidez e sem nada para ler. E convencao de documentario
 * com material de celular, e foi a escolha do usuario entre as tres possiveis.
 *
 * O desfoque e forte de proposito (60px). Desfoque timido lê como imagem fora
 * de foco, que parece defeito; desfoque forte le como fundo, que e o que ele e.
 */

export type Fala = {
  /** Quando a EITA comeca a falar, em segundos do clipe. */
  de: number;
  /** Quando termina. */
  ate: number;
  /** O envelope medido no proprio arquivo. */
  valores: number[];
  /**
   * **A ponta do rabicho**, em coordenadas do quadro 1920x1080: o ponto do
   * celular de onde o audio sai.
   *
   * Antes aqui ficava o canto do balao, e ele encostava ao lado do aparelho
   * com o rabicho de mensagem do app, virado para cima. O usuario pediu o
   * contrario, e com razao: o balao tem que **sair do celular**. Agora ele fica
   * acima da ponta de cima do aparelho, com um rabicho pontudo descendo ate
   * ela, e a entrada cresce a partir dessa ponta. Medido nos quadros do trecho
   * em que o audio toca, porque ela mexe o celular.
   */
  ponta: { x: number; y: number };
  /**
   * O mesmo plano no quadro 9:16, onde ele deixa de ser um plano no meio de
   * laterais desfocadas e **ocupa o quadro inteiro**: o bruto e 1080x1294, e o
   * `cover` amplia 1,4838x e corta uma janela de 728 px da largura dele.
   *
   * `foco` e onde essa janela fica, em % da folga horizontal (0 = colada a
   * esquerda). O bruto traz a ilustracao da EITA fixa no canto de cima a
   * direita (x 750 a 966 do bruto), e a janela e escolhida para **ou deixar a
   * ilustracao inteira de fora, ou nao cortar o rosto dela**: disco cortado ao
   * meio le como defeito, nao como enquadramento.
   *
   * `ponta` e a ponta do rabicho **medida no quadro 1080x1920 recortado**, e
   * nao convertida da do 16:9: ancora e do plano, nao da cena. Com a janela a
   * esquerda a ponta de cima do celular fica rente a borda direita, entao no
   * 9:16 o balao sai do celular **para a esquerda e para cima**, espelhado, e
   * fica fora da coluna de botoes do app.
   */
  vertical?: { foco: number; ponta: { x: number; y: number } };
};

export const PlanoVertical: React.FC<{
  arquivo: string;
  /** Se existir, desenha o balao de audio enquanto a EITA fala. */
  fala?: Fala;
}> = ({ arquivo, fala }) => {
  const f = useCurrentFrame();
  const src = staticFile("broll/" + arquivo);
  const { vertical, H } = useFormato();

  // entrada de mensagem do app: cresce da ponta do rabicho, passa um pouco do
  // tamanho e assenta (0 -> 1,06 -> 1), com a opacidade chegando antes
  const POP = fala ? s(fala.de - 0.45) : 0;
  const SAI = fala ? s(fala.ate + 0.5) : 0;
  const escala = !fala
    ? 0
    : f < POP
      ? 0
      : f < POP + 8
        ? 1.06 * passo(f, POP, POP + 8)
        : f < POP + 13
          ? 1.06 - 0.06 * passo(f, POP + 8, POP + 13)
          : 1 - 0.08 * passo(f, SAI, SAI + 8);
  const opac = !fala
    ? 0
    : Math.min(passo(f, POP, POP + 5), 1 - passo(f, SAI, SAI + 8));

  // linear, sem easing: mensagem de audio toca em velocidade constante, e a
  // curva suave da casa fazia o cabecote correr na frente da voz
  const progresso = fala
    ? interpolate(f, [s(fala.de), s(fala.ate)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  if (vertical) {
    const cfg = fala?.vertical;
    const ponta = cfg?.ponta ?? { x: 540, y: 1300 };
    /**
     * Distancia entre a ponta do rabicho e o canto de baixo-direito do corpo.
     * Curta de proposito: no 9:16 o celular fica logo abaixo do queixo dela, e
     * um rabicho longo empurraria o balao para cima do rosto.
     */
    const RECUO = { x: 60, y: 50 };
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {/* o plano ocupa o quadro: sem copia desfocada, sem barra */}
        <OffthreadVideo
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${cfg?.foco ?? 50}% 50%`,
          }}
        />

        {fala && opac > 0.001 ? (
          <div
            style={{
              position: "absolute",
              // o canto de baixo-direito do corpo fica RECUO a esquerda e
              // acima da ponta: o rabicho cobre essa distancia
              right: 1080 - (ponta.x - RECUO.x),
              bottom: H - (ponta.y - RECUO.y),
              opacity: opac,
              transform: `scale(${escala})`,
              // a escala nasce na ponta do rabicho, que e o celular
              transformOrigin: `calc(100% + ${RECUO.x}px) calc(100% + ${RECUO.y}px)`,
              filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.35))",
            }}
          >
            <BalaoAudio
              valores={fala.valores}
              progresso={progresso}
              o={1}
              segundos={fala.ate - fala.de}
              escala={1.4}
              cauda="baseDireita"
              desliza={false}
            />
            {/* o rabicho: pontudo, descendo da base do balao ate o celular */}
            <svg
              width={RECUO.x + 60}
              height={RECUO.y + 10}
              viewBox={`-50 -4 ${RECUO.x + 60} ${RECUO.y + 10}`}
              // a origem do desenho e o canto de baixo-direito do corpo
              style={{
                position: "absolute",
                left: "calc(100% - 50px)",
                top: "calc(100% - 4px)",
                overflow: "visible",
              }}
            >
              <path
                d={`M -46 0 L -2 0 Q ${RECUO.x * 0.5} ${RECUO.y * 0.25} ${RECUO.x} ${RECUO.y} Q ${RECUO.x * 0.1} ${RECUO.y * 0.55} -46 0 Z`}
                fill={wa.balaoEntrada}
              />
            </svg>
          </div>
        ) : null}
        {fala ? <Sfx som="recebido" em={s(fala.de - 0.45)} volume={0.28} /> : null}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* o fundo: a mesma imagem, ampliada ate cobrir, desfocada e escurecida
          de leve para nao competir com o plano nitido */}
      <AbsoluteFill>
        <OffthreadVideo
          src={src}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(60px) brightness(0.86) saturate(1.1)",
            transform: "scale(1.15)",
          }}
        />
      </AbsoluteFill>

      {/* o plano, inteiro, no centro */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <OffthreadVideo src={src} style={{ height: "100%", width: "auto" }} />
      </AbsoluteFill>

      {fala && opac > 0.001 ? (
        <div
          style={{
            position: "absolute",
            // o canto de baixo-esquerdo do corpo fica 10 px a direita e 40 px
            // acima da ponta: o rabicho cobre essa distancia
            left: fala.ponta.x + 10,
            bottom: 1080 - (fala.ponta.y - 40),
            opacity: opac,
            transform: `scale(${escala})`,
            // a escala nasce na ponta do rabicho, que e o celular
            transformOrigin: "-10px calc(100% + 40px)",
            filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.35))",
          }}
        >
          <BalaoAudio
            valores={fala.valores}
            progresso={progresso}
            o={1}
            segundos={fala.ate - fala.de}
            escala={0.92}
            cauda="base"
            desliza={false}
          />
          {/* o rabicho: pontudo, descendo da base do balao ate o celular */}
          <svg
            width={60}
            height={50}
            viewBox="-20 -6 60 50"
            style={{ position: "absolute", left: -20, top: "calc(100% - 6px)", overflow: "visible" }}
          >
            <path d="M 0 0 L 34 0 Q 12 10 -10 40 Q 4 16 0 0 Z" fill={wa.balaoEntrada} />
          </svg>
        </div>
      ) : null}
      {fala ? <Sfx som="recebido" em={s(fala.de - 0.45)} volume={0.28} /> : null}
    </AbsoluteFill>
  );
};
