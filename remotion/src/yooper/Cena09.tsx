import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { useFormato } from "../formato";

/**
 * Cena 09 do case Yooper: a tese e a assinatura.
 *
 * 10,0 s. Locucao de 6,69 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "nao esta em automatizar uma resposta" 0,46 ·
 * "reduzir" 3,90 · "distancia" 4,44 · "pergunta" 5,52 · "decisao" 6,24.
 *
 * ## A tese vira desenho, e nao so lettering
 *
 * "Reduzir a distancia entre uma pergunta e uma decisao" e uma frase sobre
 * **espaco**, entao as duas palavras nascem nas bordas opostas do quadro, com
 * a distancia pontilhada escrita entre elas, e **andam uma na direcao da
 * outra** no exato frame em que a locucao diz "decisao". A frase afirma e a
 * imagem confirma, que e a diferenca entre ilustrar e provar.
 *
 * ## A assinatura
 *
 * Ate 22/set o lockup carregava uma caixa tracejada dizendo que a arte final
 * da Yooper nao tinha chegado, porque desenhar uma aproximacao da marca do
 * anunciante seria pior que assumir que ela falta. O arquivo chegou e a caixa
 * saiu.
 *
 * As duas assinam sobre faixa escura porque e ali que a versao branca da
 * Profissio existe, e porque coautoria pede que as duas estejam na mesma
 * condicao. A Yooper e a anunciante; a Profissio assina como coautora.
 */

export const CENA09_FRAMES = s(11.4);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const NEGA_EM = s(0.46);
const EIXOS_EM = s(3.9);
const LINHA_EM = s(4.44);
const APROXIMA_EM = s(6.24);
const ASSINA_EM = s(7.7);

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();
  /**
   * No 9:16 a distancia fica **vertical**: "uma pergunta" em cima, "uma
   * decisao" embaixo, e o vao pontilhado entre as duas encolhe na altura. E a
   * mesma frase sobre espaco, desenhada no eixo que o quadro tem de sobra; na
   * horizontal as duas palavras a 78 px nao caberiam lado a lado com o vao.
   */
  const { vertical, M } = useFormato();

  const nega = janela(f, NEGA_EM, EIXOS_EM + s(0.4), 11, 11);
  const eixos = janela(f, EIXOS_EM, ASSINA_EM, 11, 10);
  const linha = passo(f, LINHA_EM, LINHA_EM + s(0.7));
  const aproxima = passo(f, APROXIMA_EM, APROXIMA_EM + s(0.9));
  const assina = janela(f, ASSINA_EM, CENA09_FRAMES, 12, 0);

  /**
   * As duas palavras andam uma para a outra, e **quem anda e o vao**.
   *
   * A primeira versao encolhia o vao E deslocava cada palavra por
   * `desloca / 2`, o que contava o mesmo afastamento duas vezes e jogava as
   * duas para fora do quadro. Com o flex centralizado, animar so a largura do
   * meio ja aproxima as duas simetricamente.
   */
  const desloca = interpolate(aproxima, [0, 1], [520, 56]);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-09.mp3")} />
      </Sequence>

      {nega > 0.001 ? (
        <AbsoluteFill style={{ padding: vertical ? M : MARGEM, justifyContent: "center" }}>
          <div
            style={{
              fontSize: vertical ? 108 : 72,
              fontWeight: 500,
              letterSpacing: vertical ? "-3.78px" : "-2.52px",
              lineHeight: vertical ? 1.1 : 1.16,
              maxWidth: vertical ? 936 : 1400,
              ...entra(nega, 20),
            }}
          >
            O valor não está em automatizar
            {vertical ? " " : <br />}
            uma resposta.
          </div>
        </AbsoluteFill>
      ) : null}

      {eixos > 0.001 && !vertical ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: eixos,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                fontSize: 78,
                fontWeight: 500,
                letterSpacing: "-2.73px",
                whiteSpace: "nowrap",
              }}
            >
              uma pergunta
            </div>

            <div
              style={{
                width: desloca,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 0,
                  borderTop: `2px dashed ${marca.linha}`,
                  transform: `scaleX(${linha})`,
                }}
              />
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: "1.6px",
                  textTransform: "uppercase",
                  color: m.apoio,
                  opacity: linha * (1 - aproxima),
                  whiteSpace: "nowrap",
                }}
              >
                distância
              </div>
            </div>

            <div
              style={{
                fontSize: 78,
                fontWeight: 500,
                letterSpacing: "-2.73px",
                color: marca.azul,
                whiteSpace: "nowrap",
              }}
            >
              uma decisão
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {eixos > 0.001 && vertical ? (
        <AbsoluteFill
          style={{
            padding: `0 ${M}px`,
            alignItems: "flex-start",
            justifyContent: "center",
            opacity: eixos,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div
              style={{
                fontSize: 136,
                fontWeight: 500,
                letterSpacing: "-4.76px",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}
            >
              uma pergunta
            </div>

            {/* o vao, agora na altura: quem anda continua sendo ele */}
            <div
              style={{
                height: desloca,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 22,
                paddingLeft: 28,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: 0,
                  borderLeft: `2px dashed ${marca.linha}`,
                  transform: `scaleY(${linha})`,
                }}
              />
              <div
                style={{
                  fontSize: 30,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: m.apoio,
                  opacity: linha * (1 - aproxima),
                  whiteSpace: "nowrap",
                }}
              >
                distância
              </div>
            </div>

            <div
              style={{
                fontSize: 136,
                fontWeight: 500,
                letterSpacing: "-4.76px",
                lineHeight: 1.1,
                color: marca.azul,
                whiteSpace: "nowrap",
              }}
            >
              uma decisão
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {assina > 0.001 ? (
        <AbsoluteFill
          style={{
            padding: vertical ? M : MARGEM,
            alignItems: "center",
            justifyContent: "center",
            ...entra(assina, 20),
          }}
        >
          {/* no 9:16 as duas marcas empilham na mesma faixa escura, com a
              regua entre elas deitada */}
          <div
            style={{
              background: marca.tinta,
              borderRadius: marca.raio.arte,
              boxShadow: marca.sombra.painel,
              padding: vertical ? "128px 96px" : "64px 100px",
              display: "flex",
              flexDirection: vertical ? "column" : "row",
              alignItems: "center",
              gap: vertical ? 96 : 86,
            }}
          >
            {/* a arte final chegou em 22/set: o wordmark branco com alfa, que
                e a aplicacao certa sobre a faixa escura */}
            <Img
              src={staticFile("marca-yooper/yooper-branco.png")}
              style={{ width: vertical ? 600 : 400, height: "auto", display: "block" }}
            />

            <div
              style={{
                width: vertical ? 560 : 1,
                height: vertical ? 1 : 130,
                background: "rgba(255,255,255,0.22)",
              }}
            />

            <Img
              src={staticFile("marca/profissio-ai-branco.svg")}
              style={{ width: vertical ? 648 : 430, height: "auto", display: "block" }}
            />
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="tique" em={LINHA_EM} volume={0.07} />
      <Sfx som="assenta" em={APROXIMA_EM + s(0.85)} volume={0.32} />
      <Sfx som="surge" em={ASSINA_EM} volume={0.2} />
    </AbsoluteFill>
  );
};
