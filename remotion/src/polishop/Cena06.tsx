import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { Painel, Balao, BalaoFoto, BalaoVideo, BalaoAudio, Digitando } from "./Conversa";
import { useFormato } from "../formato";

/**
 * Cena 06 do case Polishop: o agente usando o WhatsApp inteiro.
 *
 * 18,4 s. **Duas faixas de locução**, de 5,99 s em 0,4 s e de 10,87 s em
 * 6,84 s.
 *
 * Marcas com o atraso: "usa o WhatsApp inteiro" 0,46 · "a foto dos
 * ingredientes" 2,70 · "vira receita" 5,30 · "A Polishop" 7,04 · "grava as
 * próprias receitas em vídeo" 7,56 · "quando existe uma" 9,92 · "manda o vídeo
 * junto do passo a passo" 11,24 · "se a pergunta vem em áudio" 14,00 · "a
 * resposta volta em áudio" 16,00.
 *
 * ## Por que a locução desta cena está partida em duas
 *
 * A pronúncia de "Polishop" aqui soava errada, e a medida mostrou o quê: na
 * faixa aprovada da cena 02 a palavra sai com **f0 mediano de 143 Hz**, e aqui
 * saía em 108. Não é a sílaba tônica, é o **registro**: a voz declina ao longo
 * de um parágrafo, e a palavra estava na terceira frase de um bloco longo,
 * onde o tom já caiu.
 *
 * O conserto é estrutural, não de grafia: a frase que cita a marca **começa um
 * arquivo novo**, então nasce no registro alto de início de fala. O take
 * escolhido entre dez mede **149 Hz**, seis de diferença da referência. O corte
 * entre as duas faixas cai numa pausa que a narração já tinha, então ele não
 * se ouve.
 *
 * ## Três recursos, três formatos, uma conversa só
 *
 * A conversa **empilha** e o conteúdo antigo sai por cima, que é o que um app
 * faz: coluna de altura fixa, `justify-content: flex-end` e `overflow:
 * hidden`. O rastro é o que prova que tudo isso acontece no mesmo lugar, que é
 * literalmente o argumento da jornada conectada deste case.
 *
 * ## A foto dos ingredientes é gerada, não é de cliente
 *
 * Nenhum material de usuário entra na peça. As duas fotos da conversa saíram
 * da API de imagem, enquadradas como foto de celular, porque uma foto de
 * banco de imagem perfeita leria como catálogo e é justamente o oposto do que
 * a cena afirma: alguém fotografando o que sobrou na geladeira.
 *
 * ## O cartão de vídeo tem barra andando
 *
 * Lição do case anterior, e ela vale para qualquer cartão que segure tempo:
 * elemento parado lê como render travado. A barra do vídeo escoa a cada frame,
 * então o cartão lê como mídia e não como imagem que não carregou.
 */

export const CENA06_FRAMES = s(18.4);
const AUDIO_A_EM = s(0.4);
const AUDIO_B_EM = s(6.84);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.5);
const FOTO_EM = s(2.7);
const RECEITA_EM = s(5.3);
const VIDEO_EM = s(7.6);
const PASSOS_EM = s(11.3);
const AUDIO_SAI_EM = s(14.0);
const AUDIO_VOLTA_EM = s(16.0);

export const Cena06: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, TELA_EM, CENA06_FRAMES, 12, 0);
  const v = (em: number) => janela(f, em, CENA06_FRAMES, 9, 0);
  const dig = (em: number) =>
    f >= em - s(0.5) && f < em ? passo(f, em - s(0.5), em - s(0.5) + 5) : 0;

  const progAudio = interpolate(
    f,
    [AUDIO_VOLTA_EM, AUDIO_VOLTA_EM + s(1.6)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const { vertical, M, seguro } = useFormato();

  // A conversa e a mesma nos dois quadros: so o painel em volta dela muda.
  const conversa = (
    <>
      {v(FOTO_EM) > 0.001 ? (
        <BalaoFoto
          o={v(FOTO_EM)}
          arquivo="ingredientes.jpg"
          saida
          legenda="sobrou isso aqui, dá pra fazer o quê?"
        />
      ) : null}
      {dig(RECEITA_EM) > 0.001 ? <Digitando o={dig(RECEITA_EM)} /> : null}
      {v(RECEITA_EM) > 0.001 ? (
        <Balao o={v(RECEITA_EM)}>
          Com isso dá frango assado com legumes na air fryer. 25 minutos,
          200 graus, virando na metade.
        </Balao>
      ) : null}

      {dig(VIDEO_EM) > 0.001 ? <Digitando o={dig(VIDEO_EM)} /> : null}
      {v(VIDEO_EM) > 0.001 ? (
        <BalaoVideo o={v(VIDEO_EM)} titulo="Frango na air fryer" dura="1:12" em={VIDEO_EM} />
      ) : null}
      {v(PASSOS_EM) > 0.001 ? (
        <Balao o={v(PASSOS_EM)}>
          1. Tempere e deixe 10 min<br />
          2. Cesta a 200 graus<br />
          3. Vire aos 12 min<br />
          4. Legumes nos últimos 8
        </Balao>
      ) : null}

      {v(AUDIO_SAI_EM) > 0.001 ? (
        <BalaoAudio o={v(AUDIO_SAI_EM)} progresso={1} saida />
      ) : null}
      {dig(AUDIO_VOLTA_EM) > 0.001 ? <Digitando o={dig(AUDIO_VOLTA_EM)} /> : null}
      {v(AUDIO_VOLTA_EM) > 0.001 ? (
        <BalaoAudio o={v(AUDIO_VOLTA_EM)} progresso={progAudio} />
      ) : null}
    </>
  );

  const rotulos = [
    { texto: "foto vira receita", em: FOTO_EM },
    { texto: "vídeo da própria casa", em: VIDEO_EM },
    { texto: "áudio responde áudio", em: AUDIO_SAI_EM },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_A_EM}>
        <Audio src={staticFile("locucao-polishop/cena-06a.mp3")} />
      </Sequence>
      <Sequence from={AUDIO_B_EM}>
        <Audio src={staticFile("locucao-polishop/cena-06b.mp3")} />
      </Sequence>

      {vertical ? (
        <>
          {/* No 9:16 a conversa vira o celular do quadro e os tres recursos
              ficam em cima dela, em posicao fixa: cada rotulo entra embaixo
              do anterior sem empurrar nada, e o painel termina na borda da
              faixa segura, que e onde a mensagem mais nova aparece. */}
          <div style={{ position: "absolute", left: M, top: 236 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: marca.azul,
                opacity: janela(f, s(0.6), CENA06_FRAMES, 10, 0),
              }}
            >
              O WhatsApp inteiro
            </div>
            {rotulos.map((r, i) => {
              const o = janela(f, r.em, CENA06_FRAMES, 11, 0);
              if (o <= 0.001) return null;
              return (
                <div
                  key={r.texto}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 58 + i * 76,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    whiteSpace: "nowrap",
                    ...entra(o, 14),
                  }}
                >
                  <div
                    style={{ width: 3, height: 44, borderRadius: 2, background: marca.azul }}
                  />
                  <div style={{ fontSize: 54, fontWeight: 500, letterSpacing: "-1.89px" }}>
                    {r.texto}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: M, top: 590 }}>
            <Painel largura={1080 - M - seguro.direita} altura={742} o={tela}>
              {conversa}
            </Painel>
          </div>
        </>
      ) : null}

      {!vertical ? (
      <AbsoluteFill
        style={{ padding: MARGEM, flexDirection: "row", alignItems: "center", gap: 76 }}
      >
        <Painel largura={700} altura={600} o={tela}>
          {conversa}
        </Painel>

        <div style={{ display: "flex", flexDirection: "column", gap: 34, flex: 1 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: janela(f, s(0.6), CENA06_FRAMES, 10, 0),
            }}
          >
            O WhatsApp inteiro
          </div>

          {rotulos.map((r) => {
            const o = janela(f, r.em, CENA06_FRAMES, 11, 0);
            if (o <= 0.001) return null;
            return (
              <div
                key={r.texto}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  ...entra(o, 14),
                }}
              >
                <div
                  style={{ width: 3, height: 32, borderRadius: 2, background: marca.azul }}
                />
                <div style={{ fontSize: 44, fontWeight: 500, letterSpacing: "-1.54px" }}>
                  {r.texto}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      ) : null}

      <Sfx som="pop" em={FOTO_EM} volume={0.16} />
      <Sfx som="recebido" em={RECEITA_EM} volume={0.18} />
      <Sfx som="recebido" em={VIDEO_EM} volume={0.18} />
      <Sfx som="recebido" em={PASSOS_EM} volume={0.16} />
      <Sfx som="pop" em={AUDIO_SAI_EM} volume={0.16} />
      <Sfx som="recebido" em={AUDIO_VOLTA_EM} volume={0.18} />
    </AbsoluteFill>
  );
};
