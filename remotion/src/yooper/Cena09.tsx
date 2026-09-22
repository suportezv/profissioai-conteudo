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

export const CENA09_FRAMES = s(10);
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
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 500,
              letterSpacing: "-2.52px",
              lineHeight: 1.16,
              maxWidth: 1400,
              ...entra(nega, 20),
            }}
          >
            O valor não está em automatizar
            <br />
            uma resposta.
          </div>
        </AbsoluteFill>
      ) : null}

      {eixos > 0.001 ? (
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

      {assina > 0.001 ? (
        <AbsoluteFill
          style={{
            padding: MARGEM,
            alignItems: "center",
            justifyContent: "center",
            ...entra(assina, 20),
          }}
        >
          <div
            style={{
              background: marca.tinta,
              borderRadius: marca.raio.arte,
              boxShadow: marca.sombra.painel,
              padding: "64px 100px",
              display: "flex",
              alignItems: "center",
              gap: 86,
            }}
          >
            {/* a arte final chegou em 22/set: o wordmark branco com alfa, que
                e a aplicacao certa sobre a faixa escura */}
            <Img
              src={staticFile("marca-yooper/yooper-branco.png")}
              style={{ width: 400, height: "auto", display: "block" }}
            />

            <div style={{ width: 1, height: 130, background: "rgba(255,255,255,0.22)" }} />

            <Img
              src={staticFile("marca/profissio-ai-branco.svg")}
              style={{ width: 430, height: "auto", display: "block" }}
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
