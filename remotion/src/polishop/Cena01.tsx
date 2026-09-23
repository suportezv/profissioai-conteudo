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

/**
 * Cena 01 do case Polishop: o produto subutilizado.
 *
 * 9,0 s. Toca a **segunda metade** da locução da cena 01; a primeira frase
 * ficou na abertura, onde a imagem mostra a caixa sendo aberta.
 *
 * Marcas de palavra, já descontados os 3,23 s que ficaram na abertura e somado
 * o atraso de 0,3 s: "manual" 0,87 · "gaveta" 1,65 · "a maioria repete" 2,71 ·
 * "duas" 4,17 · "Cliente que não aproveita" 5,67 · "não volta" 7,55.
 *
 * ## A grade de funções é o argumento, e ela carrega informação que a fala não
 *
 * A narração diz "repete as mesmas duas receitas". A tela mostra **as dezesseis
 * funções que o aparelho tem**, com duas acesas e catorze apagadas. O
 * espectador não precisa acreditar na frase: ele conta.
 *
 * As duas acesas são batata e frango, que é o que de fato todo mundo faz, e
 * elas acendem **no frame em que a voz diz "duas"**.
 *
 * ## A avaliação de duas estrelas saiu em 23/set/2026, com a frase dela
 *
 * O filme precisava fechar em dois minutos e a quarta frase da narração, "e às
 * vezes deixa escrito, onde o próximo vai ler", era o corte mais barato: 4,2 s
 * por um beat ilustrativo. **A cena não perde o argumento**, porque quem o
 * carrega é a grade de dezesseis funções com duas acesas, que é onde o
 * espectador conta em vez de acreditar.
 *
 * O cartão de avaliação está no histórico do repositório se a montagem mudar:
 * era uma avaliação de loja recriada, com estrelas, data e o texto de alguém
 * que desistiu do aparelho.
 */

export const CENA01_FRAMES = s(9.0);
const AUDIO_EM = s(0.3);
const MARGEM = 120;
const m = modos.claro;

const MANUAL_EM = s(0.87);
const GAVETA_EM = s(1.65);
const GRADE_EM = s(2.7);
const DUAS_EM = s(4.17);
const CUSTO_EM = s(5.67);

/**
 * As dezesseis funções. As duas primeiras são as que ficam acesas, e são as
 * que todo mundo realmente faz.
 */
const FUNCOES = [
  "batata frita",
  "frango",
  "legumes assados",
  "peixe",
  "pão de queijo",
  "bolo",
  "pizza",
  "carne selada",
  "ovo cozido",
  "castanhas",
  "iogurte",
  "desidratar",
  "reaquecer",
  "fermentar",
  "grelhar",
  "gratinar",
];

const Estrela: React.FC<{ cheia: boolean }> = ({ cheia }) => (
  <svg width="26" height="26" viewBox="0 0 24 24">
    <path
      d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9z"
      fill={cheia ? "#F2B441" : "none"}
      stroke={cheia ? "#F2B441" : marca.linha}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cena01: React.FC = () => {
  const f = useCurrentFrame();

  const manual = janela(f, MANUAL_EM, GRADE_EM + 8, 10, 10);
  // o manual desce e some: e o gesto de guardar, nao um fade
  const guarda = passo(f, GAVETA_EM, GAVETA_EM + s(0.7));
  const grade = janela(f, GRADE_EM, CENA01_FRAMES, 12, 0);
  const custo = janela(f, CUSTO_EM, CENA01_FRAMES, 10, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-polishop/cena-01b.mp3")} />
      </Sequence>

      {/* o manual indo para a gaveta */}
      {manual > 0.001 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 420,
              height: 540,
              background: marca.branco,
              border: `1px solid ${marca.linha}`,
              borderRadius: marca.raio.painel,
              boxShadow: marca.sombra.painel,
              padding: 44,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              opacity: manual * (1 - guarda),
              transform: `translateY(${guarda * 320}px) rotate(${guarda * -4}deg)`,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: m.apoio,
              }}
            >
              Manual do usuário
            </div>
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: marca.linha,
                  width: `${[100, 92, 96, 60, 100, 88, 94, 72, 100, 90, 48][i]}%`,
                }}
              />
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* a grade de funcoes: o espectador conta em vez de acreditar */}
      {grade > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center", gap: 48 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              opacity: grade,
            }}
          >
            O que o aparelho faz
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 18,
              opacity: grade,
            }}
          >
            {FUNCOES.map((nome, i) => {
              const usada = i < 2;
              const acende = usada ? passo(f, DUAS_EM, DUAS_EM + s(0.5)) : 0;
              // a entrada e o esmaecimento sao coisas diferentes: `entra` ja
              // devolve opacity, entao o apagado dos catorze e um produto, nao
              // uma segunda declaracao
              const ent = entra(passo(f, GRADE_EM + i, GRADE_EM + i + 10), 10);
              return (
                <div
                  key={nome}
                  style={{
                    border: `1px solid ${acende > 0.5 ? marca.azul : marca.linha}`,
                    background: acende > 0.5 ? marca.azul : marca.branco,
                    color: acende > 0.5 ? marca.branco : m.apoio,
                    borderRadius: 12,
                    padding: "18px 20px",
                    fontSize: 26,
                    letterSpacing: "-0.91px",
                    ...ent,
                    opacity: ent.opacity * (usada ? 1 : 0.42),
                  }}
                >
                  {nome}
                </div>
              );
            })}
          </div>

          {custo > 0.001 ? (
            <div
              style={{
                fontSize: 46,
                fontWeight: 500,
                letterSpacing: "-1.61px",
                lineHeight: 1.2,
                ...entra(custo, 16),
              }}
            >
              Cliente que não aproveita o que comprou
              <br />
              <span style={{ color: marca.azul }}>não volta a comprar.</span>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      <Sfx som="apaga" em={GAVETA_EM} volume={0.2} />
      <Sfx som="assenta" em={DUAS_EM} volume={0.26} />
    </AbsoluteFill>
  );
};
