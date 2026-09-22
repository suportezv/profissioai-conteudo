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
import { wa, UI } from "../whatsapp";
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { dash } from "./Painel";

/**
 * Cena 06 do case Yooper: ele aparece sem ser chamado. **E a cena da
 * categoria.**
 *
 * 16,8 s. Locucao de 15,56 s entrando em 0,5 s.
 *
 * Marcas de palavra com o atraso: "E antecipa" 0,56 · "Avisa" 2,06 ·
 * "quando um produto entra em risco de ruptura" 3,06 · "manda o relatorio da
 * semana" 5,86 · "projeta faturamento" 8,78 · "sem ninguem pedir" 10,62 ·
 * "se a pergunta vem em audio" 12,30 · "a resposta volta em audio" 14,20.
 *
 * ## Nenhuma mensagem do cliente antes das tres primeiras, e isso e o ponto
 *
 * Tres mensagens do agente **seguidas**, sem nada do outro lado, e o desenho
 * que prova "sem ninguem pedir". Se houvesse uma pergunta antes de qualquer
 * uma delas, a cena viraria atendimento e o argumento sumiria. O cliente so
 * aparece no fim, e quando aparece e para mandar audio, que e o quarto
 * assunto da narracao e nao uma resposta aos tres primeiros.
 *
 * A conversa **empilha** e o conteudo antigo sai por cima, como no case
 * Soldiers: coluna de altura fixa com `justify-content: flex-end` e
 * `overflow: hidden`. Rastro na tela e o que separa "aconteceu tres vezes" de
 * "o mesmo cartao piscou tres vezes".
 *
 * ## Os 42 relatorios estao aqui, e nao na cena de numeros
 *
 * O dado e a prova desta afirmacao, nao mais um numero de volume. Colado na
 * frase que ele sustenta, ele e evidencia; solto entre outros quatro numeros
 * na cena 07, seria enchimento.
 *
 * ## Audio responde audio
 *
 * A onda do balao do agente **corre de verdade**, derivada do frame, porque
 * uma onda parada lê como icone e a afirmacao da narracao e sobre a resposta
 * ser falada. Nenhum arquivo de audio real do cliente entra na peca.
 */

export const CENA06_FRAMES = s(16.8);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.9);
const ALERTA_EM = s(3.06);
const RELATORIO_EM = s(5.86);
const PROJECAO_EM = s(8.78);
const TESE_EM = s(10.62);
const PERGUNTA_AUDIO_EM = s(12.3);
const RESPOSTA_AUDIO_EM = s(14.2);
const FECHO_EM = s(15.2);

const ONDA = [
  0.3, 0.55, 0.38, 0.72, 0.5, 0.88, 0.6, 0.42, 0.8, 0.55, 0.32, 0.68, 0.46,
  0.9, 0.58, 0.36, 0.74, 0.5, 0.82, 0.6, 0.4, 0.66, 0.48, 0.86, 0.54, 0.34,
];

const Digitando: React.FC<{ o: number }> = ({ o }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        background: wa.balaoEntrada,
        borderRadius: 18,
        borderTopLeftRadius: 5,
        padding: "16px 20px",
        alignSelf: "flex-start",
        display: "flex",
        gap: 7,
        ...entra(o, 8),
      }}
    >
      {[0, 1, 2].map((i) => {
        const fase = ((f - i * 4) % 30) / 30;
        const sobe = Math.sin(fase * Math.PI * 2) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: 5,
              background: wa.apoio,
              opacity: 0.45 + sobe * 0.55,
              transform: `translateY(${-sobe * 4}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

const BalaoAgente: React.FC<{ o: number; children: React.ReactNode; hora: string }> = ({
  o,
  children,
  hora,
}) => (
  <div
    style={{
      alignSelf: "flex-start",
      maxWidth: 470,
      background: wa.balaoEntrada,
      borderRadius: 18,
      borderTopLeftRadius: 5,
      padding: "14px 17px 9px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      ...entra(o, 12),
    }}
  >
    {children}
    <div style={{ fontFamily: UI, fontSize: 15, color: wa.apoio, alignSelf: "flex-end" }}>
      {hora}
    </div>
  </div>
);

/**
 * Balao de audio no tamanho que um audio de WhatsApp realmente tem.
 *
 * A primeira versao usava um balao compacto, e ao lado das mensagens de texto
 * ele lia como um chip, nao como um audio: o usuario reportou "muito pequenas
 * em relacao as outras e a como e uma mensagem de audio no WhatsApp". No app o
 * audio **ocupa quase a largura util da conversa**, porque a barra de
 * progresso precisa de curso. Aqui ele tem largura fixa de 440 px, avatar do
 * remetente, botao de 52 px e onda de 46 px de altura.
 */
const BalaoAudioWa: React.FC<{
  o: number;
  progresso: number;
  hora: string;
  saida?: boolean;
}> = ({ o, progresso, hora, saida }) => (
  <div
    style={{
      alignSelf: saida ? "flex-end" : "flex-start",
      width: 440,
      background: saida ? wa.balaoSaida : wa.balaoEntrada,
      borderRadius: 18,
      borderTopLeftRadius: saida ? 18 : 5,
      borderTopRightRadius: saida ? 5 : 18,
      padding: "14px 18px 8px",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      ...entra(o, 12),
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: wa.verde,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="17" height="20" viewBox="0 0 12 14">
          <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
          <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
        </svg>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 3,
          height: 46,
        }}
      >
        {ONDA.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6 + v * 38,
              borderRadius: 2,
              background: i / ONDA.length <= progresso ? wa.lido : wa.apoio,
              opacity: i / ONDA.length <= progresso ? 0.95 : 0.4,
            }}
          />
        ))}
      </div>
      {/* o avatar so aparece no audio que chega, que e o da Yoodash. No que
          sai o app mostraria a foto do proprio cliente, e foto de cliente nao
          se inventa: um disco cinza no lugar lê como imagem quebrada, entao a
          onda ocupa o espaco inteiro. */}
      {saida ? null : (
        <Img
          src={staticFile("marca-yooper/yoodash-avatar.png")}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            flexShrink: 0,
            display: "block",
            objectFit: "cover",
          }}
        />
      )}
    </div>
    <div
      style={{
        fontFamily: UI,
        fontSize: 15,
        color: wa.apoio,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>0:09</span>
      <span>{hora}</span>
    </div>
  </div>
);

export const Cena06: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, TELA_EM, CENA06_FRAMES, 12, 0);
  const tese = janela(f, TESE_EM, CENA06_FRAMES, 11, 0);
  const fecho = janela(f, FECHO_EM, CENA06_FRAMES, 10, 0);

  const msg = (em: number) => janela(f, em, CENA06_FRAMES, 9, 0);
  const dig = (em: number) =>
    f >= em - s(0.5) && f < em ? passo(f, em - s(0.5), em - s(0.5) + 5) : 0;

  const audioPergunta = janela(f, PERGUNTA_AUDIO_EM, CENA06_FRAMES, 9, 0);
  const audioResposta = janela(f, RESPOSTA_AUDIO_EM, CENA06_FRAMES, 9, 0);
  const progRe = interpolate(
    f,
    [RESPOSTA_AUDIO_EM, RESPOSTA_AUDIO_EM + s(1.4)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-06.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          flexDirection: "row",
          alignItems: "center",
          gap: 76,
        }}
      >
        <div style={{ flexShrink: 0, ...entra(tela, 22) }}>
        <div
          style={{
            width: 640,
            background: wa.fundoChat,
            borderRadius: marca.raio.arte,
            overflow: "hidden",
            boxShadow: marca.sombra.painel,
          }}
        >
          <div
            style={{
              background: wa.barra,
              padding: "15px 22px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Img
              src={staticFile("marca-yooper/yoodash-avatar.png")}
              style={{ width: 44, height: 44, borderRadius: 22, display: "block", objectFit: "cover" }}
            />
            <div style={{ fontFamily: UI, fontSize: 21, color: wa.texto }}>Yoodash</div>
          </div>

          <div
            style={{
              padding: 22,
              height: 560,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 12,
              overflow: "hidden",
            }}
          >
            {dig(ALERTA_EM) > 0.001 ? <Digitando o={dig(ALERTA_EM)} /> : null}
            {msg(ALERTA_EM) > 0.001 ? (
              <BalaoAgente o={msg(ALERTA_EM)} hora="8:12">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M12 3l10 18H2L12 3z" fill="none" stroke="#F2B441" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="11" y="9" width="2" height="6" rx="1" fill="#F2B441" />
                    <rect x="11" y="17" width="2" height="2" rx="1" fill="#F2B441" />
                  </svg>
                  <div style={{ fontFamily: UI, fontSize: 21, color: wa.texto, lineHeight: 1.4 }}>
                    Três produtos entram em risco de ruptura nos próximos seis dias.
                  </div>
                </div>
              </BalaoAgente>
            ) : null}

            {dig(RELATORIO_EM) > 0.001 ? <Digitando o={dig(RELATORIO_EM)} /> : null}
            {msg(RELATORIO_EM) > 0.001 ? (
              <BalaoAgente o={msg(RELATORIO_EM)} hora="9:00">
                <div
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 50,
                      borderRadius: 6,
                      background: "#C0392B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: UI,
                      fontSize: 14,
                      color: "#FFFFFF",
                      flexShrink: 0,
                    }}
                  >
                    PDF
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontFamily: UI, fontSize: 20, color: wa.texto }}>
                      Relatório da semana
                    </div>
                    <div style={{ fontFamily: UI, fontSize: 15, color: wa.apoio }}>
                      8 a 14 de setembro
                    </div>
                  </div>
                </div>
              </BalaoAgente>
            ) : null}

            {dig(PROJECAO_EM) > 0.001 ? <Digitando o={dig(PROJECAO_EM)} /> : null}
            {msg(PROJECAO_EM) > 0.001 ? (
              <BalaoAgente o={msg(PROJECAO_EM)} hora="9:41">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontFamily: UI, fontSize: 21, color: wa.texto, lineHeight: 1.4 }}>
                    No ritmo atual, setembro fecha acima da meta.
                  </div>
                  {/* as barras ocupam a largura inteira do balao: paradas na
                      metade esquerda elas liam como grafico cortado */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 6,
                      height: 78,
                      width: "100%",
                    }}
                  >
                    {[0.26, 0.34, 0.3, 0.45, 0.4, 0.52, 0.47, 0.6, 0.55, 0.68,
                      0.63, 0.76, 0.82, 0.9, 1].map((v, i) => {
                      const p = passo(
                        f,
                        PROJECAO_EM + 4 + i * 1.6,
                        PROJECAO_EM + 11 + i * 1.6,
                      );
                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 76 * v * p,
                            borderRadius: 3,
                            background: i >= 12 ? wa.verde : wa.apoio,
                            opacity: i >= 12 ? 0.95 : 0.55,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </BalaoAgente>
            ) : null}

            {audioPergunta > 0.001 ? (
              <BalaoAudioWa o={audioPergunta} progresso={1} hora="10:04" saida />
            ) : null}
            {dig(RESPOSTA_AUDIO_EM) > 0.001 ? <Digitando o={dig(RESPOSTA_AUDIO_EM)} /> : null}
            {audioResposta > 0.001 ? (
              <BalaoAudioWa o={audioResposta} progresso={progRe} hora="10:05" />
            ) : null}
          </div>
        </div>
        {/* a legenda pertence ao painel: colada no lettering ela lia como
            parte da afirmacao da marca */}
        <div style={{ marginTop: 14, fontFamily: UI, fontSize: 16, color: dash.apoio }}>
          tela recriada · exemplo ilustrativo
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
              opacity: janela(f, s(0.56), CENA06_FRAMES, 10, 0),
            }}
          >
            E antecipa
          </div>

          {tese > 0.001 ? (
            <div
              style={{
                fontSize: 62,
                fontWeight: 500,
                letterSpacing: "-2.17px",
                lineHeight: 1.16,
                ...entra(tese, 20),
              }}
            >
              Sem ninguém
              <br />
              <span style={{ color: marca.azul }}>pedir.</span>
            </div>
          ) : null}

          {/* o dado colado na frase que ele sustenta */}
          {fecho > 0.001 ? (
            <div
              style={{
                fontSize: 30,
                letterSpacing: "-1.05px",
                color: m.apoio,
                borderTop: "1px solid rgba(16,18,24,0.22)",
                paddingTop: 20,
                ...entra(fecho, 16),
              }}
            >
              42 relatórios enviados sem pedido
              <br />
              <span style={{ fontSize: 24 }}>maio a 18/set/2026</span>
            </div>
          ) : null}

        </div>
      </AbsoluteFill>

      <Sfx som="recebido" em={ALERTA_EM} volume={0.18} />
      <Sfx som="recebido" em={RELATORIO_EM} volume={0.18} />
      <Sfx som="recebido" em={PROJECAO_EM} volume={0.18} />
      <Sfx som="pop" em={PERGUNTA_AUDIO_EM} volume={0.16} />
      <Sfx som="recebido" em={RESPOSTA_AUDIO_EM} volume={0.18} />
    </AbsoluteFill>
  );
};
