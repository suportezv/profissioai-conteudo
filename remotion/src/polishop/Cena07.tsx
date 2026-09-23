import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { Painel, Balao, BalaoFoto, Digitando } from "./Conversa";

/**
 * Cena 07 do case Polishop: a personalidade.
 *
 * 10,4 s. Locução de 9,20 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "como um chef, não como um catálogo" 1,58 ·
 * "Dá opinião" 4,06 · "o ponto certo da carne" 4,70 · "comemora quando chega a
 * foto do prato pronto" 6,88.
 *
 * ## Personalidade não se afirma, se mostra numa frase que um catálogo não diria
 *
 * Dizer "ele tem personalidade de chef" é lettering vazio. O que prova é o
 * **conteúdo da mensagem**: um catálogo devolve tempo e temperatura, um chef
 * avisa que a casquinha queima antes do meio cozinhar. A diferença está na
 * opinião não solicitada, e ela cabe em duas linhas.
 *
 * ## A foto do prato pronto é o fim do arco do filme
 *
 * A cena 01 abriu com uma avaliação de duas estrelas de quem só fazia batata.
 * Aqui chega a foto de um prato que a pessoa fez e quis mostrar. **É a mesma
 * pessoa da abertura, seis cenas depois**, e é por isso que a foto vale mais
 * que qualquer número nesta posição do filme.
 */

export const CENA07_FRAMES = s(10.4);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.5);
const PERGUNTA_EM = s(1.6);
const OPINIAO_EM = s(3.9);
const FOTO_EM = s(6.7);
const FESTA_EM = s(8.2);

export const Cena07: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, TELA_EM, CENA07_FRAMES, 11, 0);
  const v = (em: number) => janela(f, em, CENA07_FRAMES, 9, 0);
  const dig = (em: number) =>
    f >= em - s(0.45) && f < em ? passo(f, em - s(0.45), em - s(0.45) + 5) : 0;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-07.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{ padding: MARGEM, flexDirection: "row", alignItems: "center", gap: 76 }}
      >
        <Painel largura={720} altura={620} o={tela}>
          {v(PERGUNTA_EM) > 0.001 ? (
            <Balao o={v(PERGUNTA_EM)} saida>
              posso botar a picanha a 200 graus?
            </Balao>
          ) : null}
          {dig(OPINIAO_EM) > 0.001 ? <Digitando o={dig(OPINIAO_EM)} /> : null}
          {v(OPINIAO_EM) > 0.001 ? (
            <Balao o={v(OPINIAO_EM)}>
              Pode, mas eu não faria. A 200 a capa de gordura queima antes do
              miolo chegar no ponto. Começa a 180 com a gordura pra cima, e
              sobe só nos últimos 4 minutos pra dourar.
            </Balao>
          ) : null}
          {v(FOTO_EM) > 0.001 ? (
            <BalaoFoto o={v(FOTO_EM)} arquivo="prato.jpg" saida legenda="olha só" />
          ) : null}
          {v(FESTA_EM) > 0.001 ? (
            <Balao o={v(FESTA_EM)}>
              Ficou linda! Essa crosta é exatamente o ponto. Da próxima deixa
              descansar 5 minutos antes de cortar.
            </Balao>
          ) : null}
        </Painel>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: janela(f, s(0.5), CENA07_FRAMES, 10, 0),
            }}
          >
            Conversa de chef
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 500,
              letterSpacing: "-2.03px",
              lineHeight: 1.18,
              opacity: janela(f, s(1.58), CENA07_FRAMES, 11, 0),
            }}
          >
            Não é um
            <br />
            <span style={{ color: marca.azul }}>catálogo de receitas.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "-0.98px",
              color: m.apoio,
              borderTop: "1px solid rgba(16,18,24,0.22)",
              paddingTop: 18,
              ...entra(janela(f, s(4.0), CENA07_FRAMES, 12, 0), 14),
            }}
          >
            ele dá opinião que ninguém pediu, e é isso que um chef faz
          </div>
        </div>
      </AbsoluteFill>

      <Sfx som="pop" em={PERGUNTA_EM} volume={0.16} />
      <Sfx som="recebido" em={OPINIAO_EM} volume={0.18} />
      <Sfx som="pop" em={FOTO_EM} volume={0.16} />
      <Sfx som="recebido" em={FESTA_EM} volume={0.2} />
    </AbsoluteFill>
  );
};
