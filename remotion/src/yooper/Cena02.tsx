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
import { wa, UI } from "../whatsapp";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 02 do case Yooper: o caminho que a pergunta tomava antes.
 *
 * 10,8 s. Locucao de 9,71 s entrando em 0,4 s.
 *
 * Marcas de palavra, ja com o atraso: "especifica" 1,40 · "o caminho era o de
 * sempre" 2,56 · "mandar mensagem para o analista" 4,34 · "esperar" 5,96 ·
 * "Funciona" 6,96 · "depende de alguem estar disponivel" 8,04.
 *
 * ## Sem vilao, e isso e deliberado
 *
 * A narracao diz "funciona", e a cena precisa concordar: o analista nao e
 * lento, ele e uma pessoa com horario. Nada aqui fica vermelho e ninguem e
 * nomeado. O contato na barra e **o cargo, nao um nome**, porque inventar uma
 * pessoa para ela ser o gargalo seria mesquinho e desnecessario.
 *
 * ## O que a tela conta e a narracao nao
 *
 * **Dois checks cinza, nao azuis**: entregue e nao lido. E um estado real do
 * app, e ele diz sozinho que a mensagem chegou e ninguem abriu, que e mais
 * preciso que "esperar". A anotacao aponta para os checks porque a contagem de
 * check ja carregou significado no case 03 e o espectador lê isso rapido.
 *
 * **Nenhum numero de espera aparece.** Um contador de minutos seria dado
 * inventado numa peca que vai a juri, e a barra de espera diz a mesma coisa
 * sem afirmar duracao.
 */

export const CENA02_FRAMES = s(10.8);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.5);
const PERGUNTA_EM = s(1.4);
const ROTULO_EM = s(2.56);
const CHECKS_EM = s(4.34);
const ESPERA_EM = s(5.96);
const TESE_EM = s(8.04);

/** Os dois checks, em SVG. Cinza e entregue; azul seria lido, e nao foi. */
const Checks: React.FC<{ cor: string }> = ({ cor }) => (
  <svg width="22" height="13" viewBox="0 0 22 13">
    <path
      d="M1 7.2l3.4 3.4L11.2 2"
      stroke={cor}
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.6 7.2L13 10.6 20.8 2"
      stroke={cor}
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cena02: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, TELA_EM, CENA02_FRAMES, 12, 0);
  const pergunta = janela(f, PERGUNTA_EM, CENA02_FRAMES, 9, 0);
  const rotulo = janela(f, ROTULO_EM, CENA02_FRAMES, 10, 0);
  const checks = passo(f, CHECKS_EM, CHECKS_EM + 8);
  const anota = janela(f, CHECKS_EM + 4, CENA02_FRAMES, 10, 0);
  const espera = janela(f, ESPERA_EM, CENA02_FRAMES, 10, 0);
  const tese = janela(f, TESE_EM, CENA02_FRAMES, 12, 0);
  // a barra escoa a cada frame ate o fim da cena: e o tempo passando
  const escoa = interpolate(f, [ESPERA_EM, CENA02_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pisca = f % 32 < 17 ? 1 : 0;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-02.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          flexDirection: "row",
          alignItems: "center",
          gap: 84,
        }}
      >
        <div
          style={{
            width: 660,
            flexShrink: 0,
            background: wa.fundoChat,
            borderRadius: marca.raio.arte,
            overflow: "hidden",
            boxShadow: marca.sombra.painel,
            ...entra(tela, 22),
          }}
        >
          {/* o cargo, nao um nome: a cena nao precisa de culpado */}
          <div
            style={{
              background: wa.barra,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                background: "#38464E",
              }}
            />
            <div style={{ fontFamily: UI, fontSize: 23, color: wa.texto }}>
              Analista de mídia
            </div>
          </div>

          <div
            style={{
              padding: 24,
              // 400 px de coluna com um balao so abria um retangulo preto
              // enorme. A altura acompanha o conteudo real da cena.
              height: 210,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 14,
            }}
          >
            {pergunta > 0.001 ? (
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: 480,
                  background: wa.balaoSaida,
                  borderRadius: 18,
                  borderTopRightRadius: 5,
                  padding: "14px 18px",
                  fontFamily: UI,
                  fontSize: 22,
                  color: wa.texto,
                  lineHeight: 1.35,
                  ...entra(pergunta, 12),
                }}
              >
                consegue me mandar o ROAS por campanha de setembro até hoje?
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 15, color: wa.apoio }}>14:32</span>
                  <div style={{ opacity: checks }}>
                    <Checks cor={wa.apoio} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* o campo vazio: ninguem esta digitando do outro lado */}
          <div
            style={{
              background: wa.teclado,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                flex: 1,
                background: wa.tecla,
                borderRadius: 22,
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ width: 2, height: 22, background: wa.apoio, opacity: pisca }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30, flex: 1 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: rotulo,
            }}
          >
            O caminho de sempre
          </div>

          {/* o que a narracao nao diz: entregue, e ninguem abriu */}
          {anota > 0.001 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                ...entra(anota, 14),
              }}
            >
              <div
                style={{
                  border: `1px solid ${marca.linha}`,
                  background: marca.branco,
                  borderRadius: 10,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checks cor={m.apoio} />
              </div>
              <div style={{ fontSize: 30, letterSpacing: "-1.05px", color: m.apoio }}>
                entregue, não lido
              </div>
            </div>
          ) : null}

          {espera > 0.001 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: espera }}>
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: marca.linha,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${escoa * 100}%`,
                    background: m.apoio,
                    opacity: 0.6,
                  }}
                />
              </div>
              <div style={{ fontSize: 26, letterSpacing: "-0.91px", color: m.apoio }}>
                esperando
              </div>
            </div>
          ) : null}

          {tese > 0.001 ? (
            <div
              style={{
                fontSize: 52,
                fontWeight: 500,
                letterSpacing: "-1.82px",
                lineHeight: 1.2,
                ...entra(tese, 18),
              }}
            >
              Funciona.
              <br />
              <span style={{ color: marca.azul }}>
                Depende de alguém
                <br />
                estar disponível.
              </span>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      <Sfx som="pop" em={PERGUNTA_EM} volume={0.18} />
      <Sfx som="tique" em={CHECKS_EM} volume={0.08} />
    </AbsoluteFill>
  );
};
