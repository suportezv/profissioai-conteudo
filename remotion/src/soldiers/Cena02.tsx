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
import { janela, entra, passo, s } from "../anim";
import { Sfx } from "../Sfx";
import { useFormato } from "../formato";

/**
 * Cena 02 do case Soldiers: o pos-venda e terra de ninguem.
 *
 * 7,5 s, narracao de 5,76 s que comeca em 0,6 s. Pausas do arquivo em 2,87 e
 * 5,38 s, somado o atraso: a frase da vantagem fecha em 3,47 e a do pos-venda
 * em 5,98.
 *
 * ## A cena e uma comparacao, e por isso tem dois titulos
 *
 * A esquerda, sobre a regua que existe, **"A jornada que o mercado olhava"**.
 * A direita, sobre o vazio, **"Onde resolveu inovar"**. Antes havia um titulo
 * so e o vazio ficava sem nome, o que obrigava a narracao a carregar sozinha a
 * comparacao que a imagem deveria estar fazendo.
 *
 * A regua de 1px tem quatro marcas e **acaba na entrega**. O que vem depois
 * fica vazio de proposito: territorio negligenciado precisa ser visto, nao
 * dito. Preencher aquele espaco destruiria o argumento.
 *
 * ## A seta e quem diz de quem e a decisao
 *
 * Ela sai da marca da Soldiers e aponta para o pos-venda. Sem ela, os dois
 * elementos dividem a tela sem se relacionar, e o espectador tem que inferir
 * que foi a Soldiers que foi para la. **Com a seta, a cena afirma a autoria da
 * escolha**, que e justamente o que o filme precisa estabelecer aqui.
 *
 * A regua usa tinta a 22%, nao o token `linha`: sobre a lavagem do fundo o
 * `#DFE3EB` desaparece, e foi assim que a linha do tempo do case anterior ficou
 * ilegivel.
 */

export const CENA02_FRAMES = s(7.3);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

/** As quatro etapas que existem hoje. A regua para depois da ultima. */
const ETAPAS = [
  { nome: "anúncio", em: s(0.7) },
  { nome: "site", em: s(1.1) },
  { nome: "checkout", em: s(1.5) },
  { nome: "entrega", em: s(1.9) },
];

const ROTULO_ESQ = s(0.3);
const MARCA_EM = s(0.9);
const ROTULO_DIR = s(2.7);
const VAZIO_EM = s(3.5);
const SETA_EM = s(4.1);

/** Geometria do quadro, em px de 1920x1080. A seta depende dela. */
const REGUA_Y = 600;
const REGUA_FIM = MARGEM + 840; // onde a entrega fica
const POS_X = 1060;
const POS_Y = 700;
/**
 * A marca fica **em cima** do pos-venda, nao ao lado.
 *
 * Com ela na diagonal a seta precisava de uma curva, e curva com ponta
 * desenhada a mao sai torta: a ponta nao acompanha a tangente e a leitura vira
 * "risco", nao "seta". Alinhada verticalmente, a seta e um segmento reto com a
 * ponta apontando para baixo, que nao tem como sair torto.
 */
const MARCA_CENTRO = 1300;
const MARCA_LARG = 182;
const MARCA_Y = 480;
const MARCA_BASE = 604;

/**
 * Geometria do 9:16. A comparacao deixa de ser lado a lado e vira **em cima e
 * embaixo**: a jornada que o mercado olhava ocupa a metade de cima, com a
 * regua acabando na entrega antes da borda direita (o vazio continua sendo o
 * argumento), e a decisao da Soldiers ocupa a de baixo, com a marca, a seta e
 * o pos-venda no mesmo eixo vertical do 16:9.
 */
const V = {
  rotuloEsqY: 300,
  reguaY: 560,
  /** A regua para em 3/4 da largura util: o que sobra a direita e o vazio. */
  reguaFim: 72 + 700,
  rotuloDirY: 860,
  /** O logo cresce para 96 px: a caixa mede 139 + 72 de padding = 211. */
  logo: 96,
  marcaLarg: 211,
  marcaCentro: 72 + 211 / 2,
  marcaY: 1000,
  /** Base da marca: 1000 + 96 de logo + 48 de padding. */
  marcaBase: 1144,
  posX: 72,
  posY: 1290,
};

export const Cena02: React.FC = () => {
  const f = useCurrentFrame();
  const { vertical, M, W, H } = useFormato();
  // mesmas contas do 16:9, com a geometria do quadro em que esta
  const G = vertical
    ? {
        margem: M,
        rotuloEsqY: V.rotuloEsqY,
        rotuloDirY: V.rotuloDirY,
        reguaY: V.reguaY,
        reguaFim: V.reguaFim,
        posX: V.posX,
        posY: V.posY,
        marcaCentro: V.marcaCentro,
        marcaY: V.marcaY,
        marcaBase: V.marcaBase,
      }
    : {
        margem: MARGEM,
        rotuloEsqY: 360,
        rotuloDirY: 360,
        reguaY: REGUA_Y,
        reguaFim: REGUA_FIM,
        posX: POS_X,
        posY: POS_Y,
        marcaCentro: MARCA_CENTRO,
        marcaY: MARCA_Y,
        marcaBase: MARCA_BASE,
      };
  const marcaX = G.marcaCentro - (vertical ? V.marcaLarg : MARCA_LARG) / 2;
  const regua = passo(f, s(0.5), s(2.2));
  const rotuloEsq = janela(f, ROTULO_ESQ, CENA02_FRAMES, 10, 0);
  const rotuloDir = janela(f, ROTULO_DIR, CENA02_FRAMES, 10, 0);
  const vazio = janela(f, VAZIO_EM, CENA02_FRAMES, 11, 0);
  const marcaSoldiers = janela(f, MARCA_EM, CENA02_FRAMES, 11, 0);
  const seta = passo(f, SETA_EM, SETA_EM + s(0.7));

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-02.mp3")} />
      </Sequence>

      {/* ---------- os dois titulos da comparacao ---------- */}
      <div
        style={{
          position: "absolute",
          left: G.margem,
          top: G.rotuloEsqY,
          width: 760,
          fontSize: vertical ? 36 : 34,
          fontWeight: 500,
          letterSpacing: "2px",
          textTransform: "uppercase",
          lineHeight: 1.3,
          color: m.apoio,
          ...entra(rotuloEsq, 14),
        }}
      >
        A jornada que o
        <br />
        mercado olhava
      </div>

      <div
        style={{
          position: "absolute",
          left: G.posX,
          top: G.rotuloDirY,
          width: 700,
          fontSize: vertical ? 36 : 34,
          fontWeight: 500,
          letterSpacing: "2px",
          textTransform: "uppercase",
          lineHeight: 1.3,
          color: marca.azul,
          ...entra(rotuloDir, 14),
        }}
      >
        Onde resolveu
        <br />
        inovar
      </div>

      {/* ---------- a regua, que acaba na entrega ---------- */}
      <div
        style={{
          position: "absolute",
          left: G.margem,
          top: G.reguaY,
          width: G.reguaFim - G.margem,
          height: 1,
          background: "rgba(16,18,24,0.22)",
          transformOrigin: "left",
          transform: `scaleX(${regua})`,
        }}
      />
      {ETAPAS.map((e, i) => {
        const o = janela(f, e.em, CENA02_FRAMES, 8, 0);
        const x =
          G.margem + ((G.reguaFim - G.margem) / ETAPAS.length) * (i + 0.5);
        return (
          <div
            key={e.nome}
            style={{
              position: "absolute",
              left: x,
              top: G.reguaY,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              opacity: o,
            }}
          >
            <div
              style={{
                width: 2,
                height: 34,
                background: m.tinta,
                opacity: 0.35,
                transformOrigin: "top",
                transform: `scaleY(${o})`,
              }}
            />
            <div
              style={{
                fontSize: vertical ? 34 : 32,
                fontWeight: 500,
                letterSpacing: vertical ? "-1.19px" : "-1.12px",
                whiteSpace: "nowrap",
              }}
            >
              {e.nome}
            </div>
          </div>
        );
      })}

      {/* ---------- o pos-venda, no espaco que a regua deixou ---------- */}
      <div
        style={{
          position: "absolute",
          left: G.posX,
          top: G.posY,
          fontSize: vertical ? 84 : 62,
          fontWeight: 500,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: marca.azul,
          whiteSpace: "nowrap",
          ...entra(vazio, 18),
        }}
      >
        o pós-venda
      </div>

      {/* ---------- a marca, e a seta que liga a decisao a ela ---------- */}
      <div
        style={{
          position: "absolute",
          left: marcaX,
          top: G.marcaY,
          background: marca.tinta,
          borderRadius: marca.raio.painel,
          padding: "24px 36px",
          display: "flex",
          alignItems: "center",
          boxShadow: marca.sombra.painel,
          ...entra(marcaSoldiers, 14),
        }}
      >
        <Img
          src={staticFile("marca-soldiers/soldiers-branco.png")}
          style={{ height: vertical ? V.logo : 76, width: "auto", display: "block" }}
        />
      </div>

      {seta > 0.001 ? (
        <svg
          style={{ position: "absolute", left: 0, top: 0 }}
          width={vertical ? W : 1920}
          height={vertical ? H : 1080}
        >
          {/* reta, da base da marca ate a palavra: nao tem como sair torta */}
          <line
            x1={G.marcaCentro}
            y1={G.marcaBase + 14}
            x2={G.marcaCentro}
            y2={G.posY - 26}
            stroke={marca.azul}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={G.posY - 26 - (G.marcaBase + 14)}
            strokeDashoffset={(1 - seta) * (G.posY - 26 - (G.marcaBase + 14))}
          />
          <path
            d={`M ${G.marcaCentro - 13} ${G.posY - 40} L ${G.marcaCentro} ${G.posY - 24} L ${G.marcaCentro + 13} ${G.posY - 40}`}
            fill="none"
            stroke={marca.azul}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={passo(f, SETA_EM + s(0.45), SETA_EM + s(0.65))}
          />
        </svg>
      ) : null}

      <Sfx som="marca" em={MARCA_EM} volume={0.2} />
      {ETAPAS.map((e) => (
        <Sfx key={e.nome} som="tique" em={e.em} volume={0.1} />
      ))}
      <Sfx som="surge" em={VAZIO_EM} volume={0.22} />
      <Sfx som="pop" em={SETA_EM} volume={0.16} />
    </AbsoluteFill>
  );
};
