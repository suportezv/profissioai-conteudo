import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "./marca";
import { Superficie } from "./Superficie";
import { PlanoVertical } from "./PlanoVertical";
import { ONDA_MISSAO } from "./ondas";
import { janela, entra, s } from "./anim";
import { Sfx } from "./Sfx";

/**
 * Cena 09 do case: a missao dita pelo proprio produto, e os lockups.
 *
 * ## O que mudou, e por que a troca e boa
 *
 * Antes daqui saia uma tese escrita pela Profissio ("A barreira nunca foi
 * falta de interesse"), narrada em off e revelada verso a verso. Saiu inteira.
 * No lugar entra **a Anaclaudia dando a licenca e a EITA respondendo na voz
 * dela**, do material real.
 *
 * A diferenca nao e de forma: a tese era a Profissio afirmando o que o produto
 * significa, e isso num case de premiacao vale menos que o produto mostrando.
 * O trecho fecha o arco do filme sozinho, porque e a criadora autorizando e a
 * criatura assumindo a missao, nas duas vozes, sem locutor.
 *
 * **Consequencia que nao da para esquecer**: sem a tese, o filme nao tem mais
 * narracao de fecho, e `locucao/cena-09.mp3` deixou de ser usado. O arquivo
 * continua no repo caso a tese volte.
 *
 * ## Os lockups
 *
 * A ordem nao e decorativa: no formulario da premiacao a anunciante e a EITA,
 * e a Profissio assina como quem construiu. A peca nao pode sugerir que a
 * Profissio e dona do produto.
 */

/**
 * O trecho real, 22,1 s, de 1:12 a 1:34 do bruto da Anaclaudia.
 *
 * Tres consertos entraram neste corte e todos vieram de ouvir, nao de ler o
 * roteiro:
 *
 *  - **A trilha do video original saiu.** Ela brigava com a trilha do case,
 *    duas musicas diferentes no mesmo trecho. Resolvido com a isolacao de voz
 *    da ElevenLabs (`/v1/audio-isolation`), que devolve so a fala. Efeito
 *    colateral util: com a musica fora, o `silencedetect` passou a achar os
 *    silencios de verdade, que a musica mascarava.
 *  - **A pausa entre "ta bom?" e "Pode deixar" foi cortada.** Eram 0,82 s de
 *    ar no meio da virada mais importante do trecho, a pessoa perguntando e o
 *    produto respondendo. Ficaram 0,12 s. O corte de 0,6 s vale para imagem e
 *    som, com um fade de 0,2 s para o salto nao pular.
 *  - **A ultima palavra estava sendo comida.** O corte terminava em 94,0 s do
 *    bruto e a frase e "organizar as emocoes", que so fecha em 94,45 s. Vai
 *    ate 94,9 s, que ainda e antes do "Se quiser" seguinte.
 */
export const TRECHO_FRAMES = s(22.1);
/** A assinatura, depois do trecho. */
export const ASSINA_FRAMES = s(5);
export const CENA09_FRAMES = TRECHO_FRAMES + ASSINA_FRAMES;

const MARGEM = 120;
const m = modos.claro;

const Assinatura: React.FC = () => {
  const f = useCurrentFrame();
  const o = janela(f, 0, ASSINA_FRAMES, 18, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" grade />
      <AbsoluteFill
        style={{
          padding: MARGEM,
          alignItems: "center",
          justifyContent: "center",
          ...entra(o, 20),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 88 }}>
          {/* a EITA aparece como ela e, sem reestilizar: e a marca da cliente,
              nao um elemento da Profissio. O PNG ja vem com fundo
              transparente e foi aparado ate o conteudo, senao um retangulo
              branco apareceria sobre a superficie #F4F6F9. */}
          <Img
            src={staticFile("marca/eita-mentora-virtual.png")}
            style={{ height: 290, width: "auto" }}
          />
          <div style={{ width: 1, height: 200, background: marca.linha }} />
          <Img
            src={staticFile("marca/profissio-ai-escuro.svg")}
            style={{ width: 500, height: "auto" }}
          />
        </div>
      </AbsoluteFill>
      <Sfx som="surge" em={0} volume={0.2} />
    </AbsoluteFill>
  );
};

export const Cena09: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: modos.claro.fundo }}>
    <Series>
      {/* o plano e vertical: entra inteiro, com as laterais preenchidas por
          uma copia desfocada dele mesmo, e o balao de audio entra quando a
          EITA assume a missao */}
      <Series.Sequence durationInFrames={TRECHO_FRAMES}>
        <PlanoVertical
          arquivo="ana-missao.mp4"
          fala={{ de: 6.44, ate: 21.68, valores: ONDA_MISSAO, duracao: "0:15" }}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={ASSINA_FRAMES}>
        <Assinatura />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
