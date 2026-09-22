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
import { janela, entra, passo, br, s } from "../anim";
import { Sfx } from "../Sfx";
import { Cursor, dash } from "./Painel";

/**
 * Cena 05 do case Yooper: a conversa vira acao.
 *
 * 14,4 s. Locucao de 13,28 s entrando em 0,4 s.
 *
 * Marcas de palavra com o atraso: "nao so responde" 1,54 · "governanca" 3,16 ·
 * "atualiza uma meta" 5,08 · "ajusta um orcamento" 6,46 · "cadastra uma
 * demanda" 7,76 · "sempre com confirmacao explicita" 9,74 · "antes de mudar
 * qualquer coisa" 11,80.
 *
 * ## Esta e a cena mais arriscada do filme, e o desenho sabe disso
 *
 * Um agente que **escreve** na base do cliente e a afirmacao que um juri
 * questiona primeiro. Por isso a confirmacao nao e um detalhe de UI: ela e o
 * centro da cena. O botao existe em tela desde o momento em que a acao e
 * proposta, o ponteiro **vai ate ele e pressiona**, e so depois disso o valor
 * do outro lado muda. A ordem importa mais que a animacao: proposta, decisao
 * humana, efeito.
 *
 * E e por isso que a sonora do Clesio vem logo depois desta cena, e nao de
 * outra: a testemunha existe para cobrir o buraco que o juri vai procurar.
 *
 * ## Uma acao acontece, tres sao nomeadas
 *
 * A narracao lista meta, orcamento e demanda. Encenar as tres com cartao e
 * botao encheria a tela de repeticao e tiraria o peso do unico gesto que
 * importa. Entao a coluna da direita **nomeia as tres** conforme a locucao as
 * diz, e o WhatsApp encena **uma**, ate o fim.
 *
 * A linha discreta do rodape diz o que a categoria vai perguntar depois: a
 * conta e trocada dentro do proprio WhatsApp e nenhum dado se mistura entre
 * clientes.
 */

export const CENA05_FRAMES = s(14.4);
const AUDIO_EM = s(0.4);
const MARGEM = 120;
const m = modos.claro;

const TELA_EM = s(0.6);
const GOV_EM = s(3.16);
const CARTAO_EM = s(5.08);
const PRESSIONA_EM = s(10.34);
const CONFIRMA_EM = s(10.9);
const MUDA_EM = s(11.8);
const RODAPE_EM = s(12.7);

const ACOES = [
  { texto: "atualizar uma meta", em: s(5.08) },
  { texto: "ajustar um orçamento", em: s(6.46) },
  { texto: "cadastrar uma demanda", em: s(7.76) },
];

/** O ponteiro sai da direita do cartao e assenta no botao. */
const BOTAO_X = 372;
const BOTAO_Y = 706;

export const Cena05: React.FC = () => {
  const f = useCurrentFrame();

  const tela = janela(f, TELA_EM, CENA05_FRAMES, 12, 0);
  const gov = janela(f, GOV_EM, CENA05_FRAMES, 10, 0);
  const cartao = janela(f, CARTAO_EM, CENA05_FRAMES, 10, 0);
  const confirma = janela(f, CONFIRMA_EM, CENA05_FRAMES, 9, 0);
  const rodape = janela(f, RODAPE_EM, CENA05_FRAMES, 12, 0);

  // o ponteiro entra, caminha ate o botao e assenta nele
  const vaiAoBotao = passo(f, PRESSIONA_EM - s(1.1), PRESSIONA_EM);
  const cursorO = janela(f, PRESSIONA_EM - s(1.2), CONFIRMA_EM + s(0.6), 8, 8);
  const cx = interpolate(vaiAoBotao, [0, 1], [700, BOTAO_X]);
  const cy = interpolate(vaiAoBotao, [0, 1], [860, BOTAO_Y]);
  // o clique: o botao afunda por 5 quadros
  const clique =
    f >= PRESSIONA_EM && f < PRESSIONA_EM + 5
      ? 1 - (f - PRESSIONA_EM) / 5
      : 0;
  const aceso = passo(f, PRESSIONA_EM - s(0.5), PRESSIONA_EM);

  // o valor do outro lado, que so muda depois da confirmacao
  const mudou = passo(f, MUDA_EM, MUDA_EM + s(0.9));
  const meta = interpolate(mudou, [0, 1], [480, 540]);
  const realce = janela(f, MUDA_EM, MUDA_EM + s(1.6), 6, 16);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-yooper/cena-05.mp3")} />
      </Sequence>

      {/* a conversa, com a acao proposta e o botao */}
      <div style={{ position: "absolute", left: MARGEM, top: 206, ...entra(tela, 20) }}>
        <div
          style={{
            width: 620,
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
              style={{ width: 42, height: 42, borderRadius: 21, display: "block", objectFit: "cover" }}
            />
            <div style={{ fontFamily: UI, fontSize: 21, color: wa.texto, flex: 1 }}>
              Yoodash
            </div>
            {/* a marca de governanca vive na barra: e condicao, nao mensagem */}
            {gov > 0.001 ? (
              <div
                style={{
                  fontFamily: UI,
                  fontSize: 15,
                  color: wa.texto,
                  border: `1px solid ${wa.apoio}`,
                  borderRadius: 999,
                  padding: "5px 12px",
                  opacity: gov,
                }}
              >
                regras de governança
              </div>
            ) : null}
          </div>

          <div
            style={{
              padding: 22,
              // a coluna acompanha o conteudo: 470 px abriam um retangulo
              // preto vazio por cima do cartao de acao
              height: 330,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            {cartao > 0.001 ? (
              <div
                style={{
                  alignSelf: "flex-start",
                  width: 470,
                  background: wa.balaoEntrada,
                  borderRadius: 18,
                  borderTopLeftRadius: 5,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  ...entra(cartao, 12),
                }}
              >
                <div
                  style={{
                    fontFamily: UI,
                    fontSize: 21,
                    color: wa.texto,
                    lineHeight: 1.4,
                  }}
                >
                  Posso atualizar a meta de setembro de R$ 480 mil para R$ 540 mil?
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily: UI,
                      fontSize: 20,
                      padding: "13px 0",
                      borderRadius: 10,
                      background: aceso > 0.5 ? wa.verde : "rgba(255,255,255,0.10)",
                      color: aceso > 0.5 ? "#06231C" : wa.texto,
                      transform: `scale(${1 - clique * 0.05})`,
                    }}
                  >
                    Confirmar
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily: UI,
                      fontSize: 20,
                      padding: "13px 0",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.10)",
                      color: wa.apoio,
                    }}
                  >
                    Cancelar
                  </div>
                </div>
              </div>
            ) : null}

            {confirma > 0.001 ? (
              <div
                style={{
                  alignSelf: "flex-end",
                  background: wa.balaoSaida,
                  borderRadius: 18,
                  borderTopRightRadius: 5,
                  padding: "12px 16px",
                  fontFamily: UI,
                  fontSize: 21,
                  color: wa.texto,
                  ...entra(confirma, 10),
                }}
              >
                confirmar
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {cursorO > 0.01 ? <Cursor x={cx} y={cy} o={cursorO} /> : null}

      {/* a coluna da direita: as tres acoes nomeadas e o efeito da confirmada */}
      <div
        style={{
          position: "absolute",
          left: 840,
          top: 172,
          width: 960,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: janela(f, s(1.54), CENA05_FRAMES, 10, 0),
          }}
        >
          Não só responde
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {ACOES.map((a) => {
            const o = janela(f, a.em, CENA05_FRAMES, 10, 0);
            if (o <= 0.001) return null;
            return (
              <div
                key={a.texto}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  ...entra(o, 14),
                }}
              >
                <div
                  style={{ width: 3, height: 30, borderRadius: 2, background: marca.azul }}
                />
                <div style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-1.47px" }}>
                  {a.texto}
                </div>
              </div>
            );
          })}
        </div>

        {/* o efeito: o valor do outro lado, que so muda depois do botao */}
        {cartao > 0.001 ? (
          <div
            style={{
              width: 620,
              background: marca.branco,
              border: `1px solid ${realce > 0.01 ? marca.azul : marca.linha}`,
              borderRadius: marca.raio.painel,
              boxShadow: marca.sombra.painel,
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              ...entra(cartao, 16),
            }}
          >
            <div style={{ fontFamily: UI, fontSize: 18, color: dash.apoio }}>
              Meta de receita · setembro
            </div>
            <div
              style={{
                fontFamily: UI,
                fontSize: 46,
                color: mudou > 0.02 ? marca.azul : dash.tinta,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              R$ {br(meta, 0)} mil
            </div>
            <div style={{ height: 6, borderRadius: 3, background: dash.linha, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${interpolate(mudou, [0, 1], [72, 64])}%`,
                  background: mudou > 0.02 ? marca.azul : dash.barraViva,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* o que a categoria pergunta depois, escrito antes de perguntarem */}
      {rodape > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: 840,
            right: MARGEM,
            top: 840,
            borderTop: "1px solid rgba(16,18,24,0.22)",
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            ...entra(rodape, 14),
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-1.26px" }}>
            Nada muda sem confirmação explícita.
          </div>
          <div style={{ fontSize: 24, letterSpacing: "-0.84px", color: m.apoio }}>
            troca de conta dentro do WhatsApp · nenhum dado se mistura entre clientes
          </div>
        </div>
      ) : null}

      <Sfx som="recebido" em={CARTAO_EM} volume={0.18} />
      {ACOES.slice(1).map((a) => (
        <Sfx key={a.texto} som="tique" em={a.em} volume={0.07} />
      ))}
      <Sfx som="pop" em={PRESSIONA_EM} volume={0.22} />
      <Sfx som="assenta" em={MUDA_EM} volume={0.3} />
    </AbsoluteFill>
  );
};
