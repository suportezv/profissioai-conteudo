import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 09 do case Soldiers: o encerramento.
 *
 * 7,6 s. Uma frase e a assinatura das duas marcas, e nada mais.
 *
 * ## Ela encolheu de 13,8 s para 7,6 s, e o motivo e o dado novo
 *
 * A versao anterior declarava a janela de medicao: "o coorte completo de 90
 * dias fecha em novembro". Aquilo existia porque o filme **nao tinha** numero
 * de recompra, e a ressalva era o que mantinha o case honesto.
 *
 * Com a cena 08B trazendo reativacao medida, a mesma frase virou o oposto do
 * que era: logo depois de "metade voltou a comprar", falar de medicao futura
 * **esfria o resultado que acabou de ser mostrado**. O usuario leu isso no
 * corte ("com os resultados que agregamos isso perde contundencia") e mandou
 * abandonar a partir dali.
 *
 * Cortar a ressalva nao cria afirmacao falsa, porque o filme deixou de
 * reivindicar retencao de coorte: ele mostra reativacao, com base em tela. **A
 * janela de novembro continua no formulario escrito**, que e onde ela cabe,
 * com espaco para explicar o metodo.
 *
 * ## Por que a frase que ficou e essa
 *
 * "O habito que sustenta esse movimento ja esta de pe" era a segunda metade da
 * narracao antiga, e e a unica que continua verdadeira sozinha: ela nao promete
 * medicao, aponta para a cena 06, que e o coracao do filme. O audio dela foi
 * recortado do proprio arquivo (6,10 a 8,95 s), entao a voz e a mesma leitura,
 * sem regravacao.
 *
 * ## Os lockups
 *
 * A anunciante e a Soldiers Nutrition; a Profissio assina como coautora. A
 * ordem nao e decorativa e a peca nao pode sugerir que a Profissio e dona do
 * produto.
 *
 * **As duas marcas assinam sobre uma faixa escura**, e a razao e do arquivo: o
 * logo que a Soldiers entregou e o branco, e branco sobre a superficie clara
 * nao existe. Painel escuro e a aplicacao correta dele. Como a Profissio
 * tambem tem versao branca para fundo escuro, as duas ficam na mesma condicao,
 * que e o que uma coautoria pede: recolorir a marca de um cliente para ela
 * caber no nosso fundo seria pior que trocar o fundo.
 */

export const CENA09_FRAMES = s(7.6);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const ASSINA_EM = s(3.5);

export const Cena09: React.FC = () => {
  const f = useCurrentFrame();

  const tese = janela(f, s(0.3), ASSINA_EM, 10, 9);
  const assina = janela(f, ASSINA_EM, CENA09_FRAMES, 11, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-09.mp3")} />
      </Sequence>

      {tese > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 500,
              letterSpacing: "-2.66px",
              lineHeight: 1.16,
              maxWidth: 1400,
              ...entra(tese, 20),
            }}
          >
            O hábito que sustenta esse movimento
            <br />
            <span style={{ color: marca.azul }}>já está de pé.</span>
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
          {/* a faixa escura: e onde as duas marcas brancas convivem */}
          <div
            style={{
              background: marca.tinta,
              borderRadius: marca.raio.arte,
              boxShadow: marca.sombra.painel,
              padding: "72px 110px",
              display: "flex",
              alignItems: "center",
              gap: 96,
            }}
          >
            <Img
              src={staticFile("marca-soldiers/soldiers-branco.png")}
              style={{ height: 150, width: "auto", display: "block" }}
            />

            <div
              style={{
                width: 1,
                height: 150,
                background: "rgba(255,255,255,0.22)",
              }}
            />

            <Img
              src={staticFile("marca/profissio-ai-branco.svg")}
              style={{ width: 460, height: "auto", display: "block" }}
            />
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx som="surge" em={ASSINA_EM} volume={0.2} />
    </AbsoluteFill>
  );
};
