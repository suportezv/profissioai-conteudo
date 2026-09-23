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

/**
 * Cena 06 do case Polishop: o agente usando o WhatsApp inteiro.
 *
 * 17,8 s. Locução de 16,44 s entrando em 0,5 s.
 *
 * Marcas de palavra com o atraso: "usa o WhatsApp inteiro" 1,62 · "a foto dos
 * ingredientes" 2,78 · "vira receita" 5,34 · "vídeo gravado pela própria
 * equipe" 6,46 · "Polishop" 9,08 · "manda o vídeo junto do passo a passo"
 * 10,48 · "se a pergunta vem em áudio" 13,06 · "a resposta volta em áudio"
 * 16,28.
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

export const CENA06_FRAMES = s(17.8);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.8);
const FOTO_EM = s(2.78);
const RECEITA_EM = s(5.0);
const VIDEO_EM = s(7.6);
const PASSOS_EM = s(10.5);
const AUDIO_SAI_EM = s(13.1);
const AUDIO_VOLTA_EM = s(15.3);

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

  const rotulos = [
    { texto: "foto vira receita", em: FOTO_EM },
    { texto: "vídeo da própria casa", em: VIDEO_EM },
    { texto: "áudio responde áudio", em: AUDIO_SAI_EM },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-06.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{ padding: MARGEM, flexDirection: "row", alignItems: "center", gap: 76 }}
      >
        <Painel largura={700} altura={600} o={tela}>
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

      <Sfx som="pop" em={FOTO_EM} volume={0.16} />
      <Sfx som="recebido" em={RECEITA_EM} volume={0.18} />
      <Sfx som="recebido" em={VIDEO_EM} volume={0.18} />
      <Sfx som="recebido" em={PASSOS_EM} volume={0.16} />
      <Sfx som="pop" em={AUDIO_SAI_EM} volume={0.16} />
      <Sfx som="recebido" em={AUDIO_VOLTA_EM} volume={0.18} />
    </AbsoluteFill>
  );
};
