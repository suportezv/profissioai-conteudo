import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca, modos } from "../marca";
import { Superficie } from "../Superficie";
import { janela, entra, passo, conta, br, s } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 01 do case Soldiers: o produto nao diferencia.
 *
 * 12 s, narracao de 9,94 s que comeca em 1,0 s. Pausas medidas no arquivo
 * (1,86 / 5,83 / 9,65 s), somado o atraso: "Creatina e creatina" fecha em
 * 2,86, o dado de mercado em 6,83 e a frase do preco em 10,65.
 *
 * ## A cena tem duas metades, e a primeira e filmada
 *
 * Abre num plano gerado no Veo: a camera varre uma gondola de potes de
 * creatina quase identicos e um consumidor, de costas, coca a cabeca sem
 * conseguir escolher. **O gancho precisa da prateleira real**, porque
 * "creatina e creatina" e uma afirmacao sobre o mundo, nao sobre uma
 * interface: desenhada, ela vira opiniao; filmada, vira constatacao.
 *
 * Na metade seguinte a cena executa a decisao que aquela prateleira produz:
 * dois potes com o mesmo texto e o mesmo peso, **so o preco muda**, um deles
 * cai de preco e o cursor vai nele.
 *
 * Os potes sao genericos de proposito. **Nenhum rotulo de marca, nem da
 * Soldiers nem de concorrente**: a cena fala do mercado inteiro, e pintar um
 * concorrente aqui seria comparacao, que o `Comunicacao_Profissio.md` proibe.
 * Pelo mesmo motivo o clipe foi conferido quadro a quadro antes de entrar: os
 * rotulos dizem "CRE...", nunca uma marca legivel.
 */

export const CENA01_FRAMES = s(12);
const AUDIO_EM = s(1.0);
const MARGEM = 120;
const m = modos.claro;

/** Ate onde o plano filmado ocupa o quadro. Os potes entram por baixo dele. */
const GONDOLA_ATE = s(4.6);
const ENTRA_POTES = s(4.3);
const DADO_EM = s(2.9);
const CAI_PRECO = s(7.5);
const CURSOR_CHEGA = s(8.2);
const ESCOLHE = s(9.2);

/**
 * A silhueta do pote, desenhada e nao sugerida por um retangulo.
 *
 * O quadrado cinza que estava aqui antes nao lia como suplemento, e o pedido
 * foi exatamente esse: ilustrar em vez de deixar em branco. A forma e a de
 * qualquer pote do mercado, tampa larga e corpo cilindrico, **sem rotulo**,
 * porque o argumento da cena e que eles sao indistinguiveis.
 */
const PoteSilhueta: React.FC<{ cor: string; altura: number }> = ({
  cor,
  altura,
}) => (
  <svg
    viewBox="0 0 120 168"
    style={{ height: altura, width: "auto", display: "block" }}
  >
    {/* tampa */}
    <rect x="28" y="4" width="64" height="22" rx="7" fill={cor} />
    {/* corpo */}
    <path
      d="M24 28 h72 a8 8 0 0 1 8 8 v116 a10 10 0 0 1 -10 10 h-68 a10 10 0 0 1 -10 -10 v-116 a8 8 0 0 1 8 -8 z"
      fill={cor}
    />
    {/* a janela do rotulo, vazia: nao ha marca nenhuma nesta cena */}
    <rect
      x="34"
      y="64"
      width="52"
      height="58"
      rx="5"
      fill={marca.branco}
      opacity="0.9"
    />
  </svg>
);

/** Um pote: silhueta neutra, peso igual, so o preco distingue. */
const Pote: React.FC<{
  preco: number;
  o: number;
  escolhido: boolean;
  destaque: boolean;
}> = ({ preco, o, escolhido, destaque }) => (
  <div
    style={{
      flexGrow: 1,
      background: marca.branco,
      border: `1px solid ${escolhido ? marca.azul : marca.linha}`,
      borderRadius: marca.raio.painel,
      boxShadow: escolhido ? marca.sombra.azul : marca.sombra.painel,
      padding: 40,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 22,
      ...entra(o, 22),
    }}
  >
    <PoteSilhueta cor={escolhido ? marca.azul : "#C7CEDA"} altura={230} />
    <div
      style={{
        fontSize: 28,
        letterSpacing: "-0.98px",
        color: m.apoio,
        textAlign: "center",
      }}
    >
      creatina monoidratada · 300 g
    </div>
    <div
      style={{
        fontSize: 68,
        fontWeight: 500,
        letterSpacing: "-2.38px",
        lineHeight: 1,
        color: destaque ? marca.azul : m.tinta,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      R$ {br(preco, 0)}
    </div>
  </div>
);

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();

  // o plano filmado sai por opacidade, e os potes ja estao entrando por baixo
  const gondola = interpolate(
    f,
    [GONDOLA_ATE - s(0.4), GONDOLA_ATE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const potes = janela(f, ENTRA_POTES, CENA01_FRAMES, 18, 0);
  const dado = janela(f, DADO_EM, GONDOLA_ATE, 14, 12);
  const precoB = conta(f, CAI_PRECO, CAI_PRECO + s(0.9), 22);
  const cursor = passo(f, CURSOR_CHEGA, CURSOR_CHEGA + s(0.7));
  const escolheu = f >= ESCOLHE;

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-01.mp3")} />
      </Sequence>

      {/* ---------- a metade filmada ---------- */}
      {gondola > 0.001 ? (
        <AbsoluteFill style={{ opacity: gondola, zIndex: 2 }}>
          <OffthreadVideo
            src={staticFile("soldiers-broll/c01-gondola.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* escurecimento so do lado do lettering, para o texto ler */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(90deg, rgba(16,18,24,0.72) 0%, rgba(16,18,24,0.42) 34%, rgba(16,18,24,0) 62%)",
            }}
          />
          <AbsoluteFill
            style={{
              padding: MARGEM,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: marca.apoioEscuro,
                opacity: janela(f, s(0.5), GONDOLA_ATE, 14, 12),
              }}
            >
              O mercado de suplementação
            </div>

            {/* o dado de mercado vive sobre a prateleira, que e o assunto dele */}
            <div
              style={{
                display: "flex",
                gap: 40,
                alignItems: "baseline",
                flexWrap: "wrap",
                ...entra(dado, 16),
              }}
            >
              <div
                style={{
                  fontSize: 76,
                  fontWeight: 500,
                  letterSpacing: "-2.66px",
                  color: marca.branco,
                }}
              >
                R$ 7,6 bi por ano
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 500,
                  letterSpacing: "-1.54px",
                  color: marca.ciano,
                }}
              >
                +15% em 2025
              </div>
              <div
                style={{
                  fontSize: 24,
                  letterSpacing: "-0.84px",
                  color: marca.apoioEscuro,
                }}
              >
                fonte: BRASNUTRI
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* ---------- a metade desenhada: a decisao ---------- */}
      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: m.apoio,
            opacity: janela(f, ENTRA_POTES, CENA01_FRAMES, 14, 0),
          }}
        >
          Mesmo produto, mesma dose
        </div>

        <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
          <Pote preco={119} o={potes} escolhido={false} destaque={false} />
          <Pote
            preco={119 - precoB}
            o={potes}
            escolhido={escolheu}
            destaque={precoB > 0.5}
          />
        </div>
      </AbsoluteFill>

      {/* o cursor: entra pela direita e para em cima do pote mais barato */}
      {cursor > 0.001 ? (
        <div
          style={{
            position: "absolute",
            // pousa em cima do preco do pote mais barato, nao na descricao:
            // o que a narracao diz que decide e o numero
            left: 1420 + (1 - cursor) * 420,
            top: 706 + (1 - cursor) * 160,
            opacity: cursor,
            zIndex: 3,
          }}
        >
          <svg width="46" height="52" viewBox="0 0 24 28">
            <path
              d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.5 L18 15.5 Z"
              fill={marca.tinta}
              stroke={marca.branco}
              strokeWidth="1.4"
            />
          </svg>
        </div>
      ) : null}

      <Sfx som="surge" em={DADO_EM} volume={0.18} />
      <Sfx som="pop" em={ENTRA_POTES} volume={0.18} />
      <Sfx som="tique" em={CAI_PRECO} volume={0.12} />
      <Sfx som="assenta" em={CAI_PRECO + s(0.9)} volume={0.3} />
      <Sfx som="marca" em={ESCOLHE} volume={0.28} />
    </AbsoluteFill>
  );
};
