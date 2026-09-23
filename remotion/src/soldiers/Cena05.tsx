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
import { janela, entra, conta, br, s, SUAVE, tiquesDaContagem } from "../anim";
import { Sfx } from "../Sfx";
import { useFormato } from "../formato";

/**
 * Cena 05 do case Soldiers: o cupom vira chave.
 *
 * 13 s, narracao de 9,75 s que comeca em 0,6 s. Pausas em 3,13 / 7,42 / 9,41 s,
 * somado o atraso: a frase do cupom fecha em 3,73, a dos noventa dias em 8,02
 * e a da soma em 10,01.
 *
 * ## A virada e de funcao, nao de objeto
 *
 * O mesmo retangulo gira em 3D e, no meio do giro, troca o **icone** que esta
 * dentro: de um cupom picotado para uma chave. Nao entra um objeto novo,
 * porque a frase nao e "ganhou uma chave", e "o cupom deixou de ser desconto e
 * virou chave". Objeto novo contaria outra coisa.
 *
 * A troca acontece em 90 graus, de perfil, quando nao da para ler nenhum dos
 * dois. Trocar antes ou depois mostra a emenda.
 *
 * O cupom e desenhado como cupom de verdade, com os dois entalhes laterais e o
 * picote do canhoto, porque um retangulo com texto dentro nao lia como cupom.
 *
 * ## Quatro compras, um ano
 *
 * O contador nao aparece pronto nem soma uma vez so: ele **conta em quatro
 * degraus**, um por compra, 90 / 180 / 270 / 360. Somar e o mecanismo de LTV do
 * case e precisa ser visto acontecendo quatro vezes para ler como habito de
 * reposicao, nao como promocao de lancamento.
 *
 * Os 360 fecham em "um ano de acompanhamento", que e o que quatro compras
 * entregam. O filme **nao afirma recompra** com isso: afirma o que a mecanica
 * concede, que e coisa diferente, e a cena 09 cuida da distincao.
 */

export const CENA05_FRAMES = s(12.2);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

const ENTRA_CUPOM = s(0.9);
const GIRA = s(2.0);

/** Uma compra por degrau. A primeira abre os 90, as outras somam. */
const COMPRAS = [s(4.6), s(7.4), s(8.5), s(9.6)];
const PASSO_CONTA = s(0.7);
const ANO_EM = s(10.6);

/** O cupom: entalhes nas laterais e picote do canhoto. */
const IconeCupom: React.FC<{ cor: string; fundo: string; largura?: number }> = ({
  cor,
  fundo,
  largura = 240,
}) => (
  <svg viewBox="0 0 168 100" style={{ width: largura, height: "auto" }}>
    <rect x="10" y="10" width="148" height="80" rx="10" fill={cor} />
    {/* os entalhes sao furos na cor do cartao, nao formas proprias */}
    <circle cx="10" cy="50" r="12" fill={fundo} />
    <circle cx="158" cy="50" r="12" fill={fundo} />
    <line
      x1="116"
      y1="22"
      x2="116"
      y2="78"
      stroke={fundo}
      strokeWidth="3"
      strokeDasharray="7 7"
      strokeLinecap="round"
    />
    <rect x="30" y="40" width="60" height="7" rx="3.5" fill={fundo} opacity="0.5" />
    <rect x="30" y="55" width="40" height="7" rx="3.5" fill={fundo} opacity="0.5" />
  </svg>
);

/** A chave: anel, haste e dois dentes. */
const IconeChave: React.FC<{ cor: string; largura?: number }> = ({
  cor,
  largura = 240,
}) => (
  <svg viewBox="0 0 168 100" style={{ width: largura, height: "auto" }}>
    <circle
      cx="44"
      cy="50"
      r="25"
      fill="none"
      stroke={cor}
      strokeWidth="13"
    />
    <rect x="66" y="43" width="92" height="13" rx="5" fill={cor} />
    <rect x="122" y="56" width="13" height="22" rx="5" fill={cor} />
    <rect x="145" y="56" width="13" height="16" rx="5" fill={cor} />
  </svg>
);

export const Cena05: React.FC = () => {
  const f = useCurrentFrame();
  /**
   * No 9:16 a cena empilha na ordem da narracao: o cupom que vira chave, na
   * largura util, a frase embaixo dele, e a contagem dos dias com o "1 ano" ao
   * lado do numero e a legenda na linha de baixo. O cupom cresce, porque o giro
   * e o momento da cena e a coluna tem altura.
   */
  const { vertical, M, H, seguro } = useFormato();

  const cupom = janela(f, ENTRA_CUPOM, CENA05_FRAMES, 11, 0);
  const giro = interpolate(f, [GIRA, GIRA + s(1.0)], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  // a troca acontece de perfil, em 90 graus, quando nenhum dos dois se le
  const virou = giro >= 90;

  // quatro degraus somando 90 cada: 90, 180, 270, 360
  const dias = COMPRAS.reduce(
    (soma, t) => soma + conta(f, t, t + PASSO_CONTA, 90),
    0,
  );
  const mostraDias = janela(f, COMPRAS[0], CENA05_FRAMES, 10, 0);
  const ano = janela(f, ANO_EM, CENA05_FRAMES, 9, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-05.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: vertical
            ? `${seguro.topo}px ${M}px ${H - seguro.base}px`
            : MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: vertical ? 40 : 64,
        }}
      >
        <div
          style={{
            fontSize: vertical ? 30 : 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: janela(f, s(0.6), CENA05_FRAMES, 9, 0),
          }}
        >
          A decisão que liga tudo à compra
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            alignItems: vertical ? "flex-start" : "center",
            gap: vertical ? 40 : 64,
          }}
        >
          {/* o retangulo que gira: um so objeto, duas funcoes */}
          <div style={{ perspective: 1400, ...entra(cupom, 20) }}>
            <div
              style={{
                // no 9:16 o cartao toma a largura util
                width: vertical ? 936 : 420,
                height: vertical ? 400 : 240,
                borderRadius: marca.raio.painel,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                transform: `rotateY(${giro}deg)`,
                transformStyle: "preserve-3d",
                background: virou ? marca.azul : marca.branco,
                border: `${virou ? 0 : 2}px dashed ${marca.linha}`,
                boxShadow: virou ? marca.sombra.azul : marca.sombra.painel,
              }}
            >
              <div
                style={{
                  // o verso volta espelhado; desespelha so o conteudo
                  transform: virou ? "rotateY(180deg)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                {virou ? (
                  <IconeChave cor={marca.branco} largura={vertical ? 380 : 240} />
                ) : (
                  <IconeCupom
                    cor="#C7CEDA"
                    fundo={marca.branco}
                    largura={vertical ? 380 : 240}
                  />
                )}
                <div
                  style={{
                    fontSize: virou ? (vertical ? 60 : 40) : vertical ? 44 : 30,
                    fontWeight: 500,
                    letterSpacing: virou ? (vertical ? "-2.1px" : "-1.4px") : "2px",
                    color: virou ? marca.branco : m.apoio,
                    textTransform: virou ? "none" : "uppercase",
                  }}
                >
                  {virou ? "acesso" : "CUPOM10"}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: vertical ? 72 : 44,
              fontWeight: 500,
              letterSpacing: vertical ? "-2.52px" : "-1.54px",
              lineHeight: vertical ? 1.18 : 1.25,
              opacity: janela(f, GIRA + s(0.8), CENA05_FRAMES, 10, 0),
            }}
          >
            Qualquer compra,
            <br />
            de qualquer valor.
          </div>
        </div>

        {/* os dias, contando um degrau por compra */}
        <div
          style={{
            display: "flex",
            // no 9:16 o numero e o "1 ano" dividem a primeira linha e a
            // legenda quebra para a de baixo (`order` + `flexWrap`): lado a
            // lado com o numero ela entrava na coluna de botoes do app
            flexWrap: vertical ? "wrap" : "nowrap",
            alignItems: "flex-end",
            columnGap: vertical ? 40 : 28,
            rowGap: vertical ? 16 : 28,
            opacity: mostraDias,
          }}
        >
          <div
            style={{
              fontSize: vertical ? 280 : 140,
              fontWeight: 500,
              letterSpacing: vertical ? "-9.8px" : "-4.9px",
              lineHeight: 0.95,
              color: marca.azul,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 18px 50px rgba(36,88,245,0.22)",
            }}
          >
            {br(dias, 0)}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: vertical ? 8 : 6,
              paddingBottom: vertical ? 0 : 22,
              order: vertical ? 2 : 0,
              flexBasis: vertical ? "100%" : undefined,
            }}
          >
            <div
              style={{
                fontSize: vertical ? 48 : 36,
                fontWeight: 500,
                letterSpacing: vertical ? "-1.68px" : "-1.26px",
                lineHeight: vertical ? 1.15 : undefined,
              }}
            >
              dias de acompanhamento
            </div>
            <div
              style={{
                fontSize: vertical ? 32 : 24,
                letterSpacing: vertical ? "-1.12px" : "-0.84px",
                color: m.apoio,
              }}
            >
              cada nova compra soma mais 90, cumulativos
            </div>
          </div>

          {/* o que quatro compras entregam, colado no numero que o produz:
              jogado na borda oposta ele lia como um dado solto de outra cena */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingBottom: vertical ? 24 : 22,
              marginLeft: vertical ? 0 : 48,
              order: vertical ? 1 : 0,
              ...entra(ano, 16),
            }}
          >
            <div
              style={{
                width: 4,
                height: vertical ? 128 : 92,
                background: marca.azul,
                borderRadius: 2,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: vertical ? 100 : 72,
                  fontWeight: 500,
                  letterSpacing: vertical ? "-3.5px" : "-2.52px",
                  lineHeight: 1.05,
                }}
              >
                1 ano
              </div>
              <div
                style={{
                  fontSize: vertical ? 32 : 26,
                  letterSpacing: vertical ? "-1.12px" : "-0.91px",
                  color: m.apoio,
                }}
              >
                com 4 compras
              </div>
            </div>
          </div>
        </div>

        {/* as quatro compras, marcadas conforme entram */}
        <div style={{ display: "flex", gap: 14, opacity: mostraDias }}>
          {COMPRAS.map((t, i) => {
            const aceso = janela(f, t, CENA05_FRAMES, 8, 0);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: vertical ? "14px 22px" : "10px 18px",
                  borderRadius: marca.raio.controle,
                  border: `1px solid ${marca.linha}`,
                  background: marca.branco,
                  opacity: 0.35 + aceso * 0.65,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: aceso > 0.5 ? marca.azul : marca.linha,
                  }}
                />
                <div
                  style={{
                    fontSize: vertical ? 30 : 22,
                    letterSpacing: vertical ? "-1.05px" : "-0.77px",
                    color: m.apoio,
                  }}
                >
                  {i + 1}ª compra
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sfx som="pop" em={ENTRA_CUPOM} volume={0.18} />
      <Sfx som="surge" em={GIRA} volume={0.22} />
      <Sfx som="marca" em={GIRA + s(0.5)} volume={0.26} />
      {COMPRAS.map((t, i) => (
        <React.Fragment key={i}>
          {tiquesDaContagem(t, t + PASSO_CONTA).map((fr, j) => (
            <Sfx key={j} som="tique" em={fr} volume={0.06} />
          ))}
          <Sfx som="assenta" em={t + PASSO_CONTA} volume={0.3} />
        </React.Fragment>
      ))}
      <Sfx som="marca" em={ANO_EM} volume={0.28} />
    </AbsoluteFill>
  );
};
