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
import { janela, entra, passo, conta, br, s, tiquesDaContagem } from "../anim";
import { Sfx } from "../Sfx";

/**
 * Cena 08B do case Soldiers: o resultado que chegou em 22/set/2026.
 *
 * 12,2 s, narracao de 11,10 s que comeca em 0,5 s. Duas afirmacoes, uma por
 * beat, separadas pelas pausas do proprio arquivo (0,52 s e 0,56 s):
 * conversao fecha em 3,96 e reativacao abre em 4,48.
 *
 * ## A base nao e a mesma da cena 08, e a tela precisa dizer
 *
 * A cena 08 declara em cada cartao que o numero e **so do MODO base**. Estes
 * sao do **conjunto todo de agentes, com as personas dos influenciadores**,
 * confirmado pelo cliente. Duas bases diferentes em cenas vizinhas, sem a tela
 * separar, e exatamente o que faz um juri desconfiar do numero inteiro quando
 * compara video e formulario.
 *
 * ## O que esta cena NAO pode fazer virar fatia
 *
 * **50%, 32% e 21% sao limiares acumulados, nao pedacos de um bolo.** Quem
 * esta ha 95 dias sem comprar conta nos tres. Pizza, ou tres barras lado a
 * lado somando 103%, seria erro de fato no material do premio.
 *
 * Por isso as tres barras **saem da mesma origem e vao encurtando**, empilhadas
 * na vertical: o desenho afirma "cada vez mais fundo, sempre o mesmo grupo",
 * que e o que o dado diz. A linha de apoio soletra a regra em texto, porque
 * desenho nenhum garante que quem esta conferindo leia acumulado.
 *
 * ## O 8x entra escrito por decisao do usuario, e por isso a base entra junto
 *
 * Eu recomendei as duas taxas sem o multiplicador: 13,5% e 1,7% sao populacoes
 * que se escolheram sozinhas (quem conversou com um agente ja tinha levantado
 * a mao), entao a diferenca mede os dois grupos e nao o efeito do agente. O
 * usuario pediu o 8x escrito e essa e a decisao dele.
 *
 * O que **nao** e preferencia e a regra do `Comunicacao_Profissio.md`: nao se
 * publica porcentagem de resultado sem contexto, base e metodo. Por isso as
 * duas taxas aparecem com os dois rotulos, e a linha de base fica colada no
 * numero, nunca num rodape solto.
 *
 * > **PENDENTE, e nao pode ir ao juri assim**: falta o N das recompras
 * > atribuidas, o periodo das duas medidas e o que "atribuida" significa (a
 * > janela de 30 dias do produto?). Os campos abaixo trazem `A CONFIRMAR` no
 * > lugar, para o buraco ser visivel em tela em vez de silencioso.
 */

export const CENA08B_FRAMES = s(12.2);
const AUDIO_EM = s(0.5);
const MARGEM = 120;
const m = modos.claro;

/** Os dois beats, tirados das pausas do arquivo de locucao mais o atraso. */
const CONV_EM = s(0.6);
const CONV_SAI = s(4.9);
const REAT_EM = s(4.9);

/**
 * O beat 1, tempo a tempo.
 *
 * A unidade entra primeiro de proposito: e contra a barra pequena que os oito
 * blocos contam. Mostrar o numero grande antes deixaria a barra menor parecendo
 * detalhe, e a conta some.
 *
 * Os blocos correm entre 2,2 e 3,4 s, que e onde a locucao diz "oito vezes
 * mais" (1,90 a 2,84 no arquivo, mais os 0,5 s de atraso da faixa e os 0,1 do
 * ataque). O olho conta junto com a voz.
 */
const UNIDADE_EM = s(0.9);
const AGENTE_EM = s(1.6);
const BLOCOS_EM = s(2.2);
const BLOCOS_ATE = s(3.4);

/**
 * Oito blocos, porque 13,5 dividido por 1,7 da **7,94**.
 *
 * O bloco e a barra de 1,7% repetida: a barra azul nao e uma barra grande, e
 * a barra pequena oito vezes. Assim o multiplicador fica **contado em tela**
 * em vez de afirmado por escrito, que era a reclamacao: tres numeros soltos
 * lado a lado nao constroem a imagem de "um e oito vezes o outro".
 *
 * A proporcao e a real: os oito blocos medem 13,6% da regua, nao 13,5%, e a
 * diferenca de 0,1 ponto e menor que a borda entre eles.
 */
const BLOCOS = 8;
/** Largura de um bloco, em px de 1920. Oito deles mais os vaos cabem na faixa. */
const BLOCO = 118;
const VAO_BLOCO = 8;

/** A base que vale para os dois numeros, e que difere da cena 08. */
const BASE = "todos os agentes da Soldiers, com as personas · período e N a confirmar";

type Limiar = { pct: number; rotulo: string; em: number };

/**
 * Os tres limiares, do mais raso para o mais fundo. A ordem importa: entrando
 * nesta sequencia, cada barra nova e visivelmente menor que a anterior e sai
 * da mesma origem, que e como se le "subconjunto" em vez de "fatia".
 *
 * **A primeira barra entra junto com o titulo**, 0,3 s depois dele. Antes ela
 * esperava 1,2 s, e nesse intervalo a frase "quem ja tinha esfriado voltou a
 * comprar" ficava sozinha num quadro vazio, para reaparecer em seguida com o
 * grafico: o usuario leu isso como "largado, sem leitura", e ele esta certo.
 * **Titulo que anuncia um grafico nao segura tela sozinho**; ou o grafico vem
 * junto, ou o titulo nao devia ter entrado ainda.
 *
 * As duas ultimas entram coladas, em 4,0 e 4,8 s, porque e ali que a locucao
 * diz "um quinto, ha mais de noventa" (8,98 no arquivo, 9,48 de cena). Vindo
 * juntas elas leem como "e mais fundo, e mais fundo ainda", que e o que o dado
 * afirma.
 */
const LIMIARES: Limiar[] = [
  { pct: 50, rotulo: "há mais de 30 dias sem comprar", em: REAT_EM + s(0.3) },
  { pct: 32, rotulo: "há mais de 60 dias", em: REAT_EM + s(4.0) },
  { pct: 21, rotulo: "há mais de 90 dias", em: REAT_EM + s(4.8) },
];

/** Largura util da faixa de barras, em px de 1920. 100% ocupa isso. */
const FAIXA = 1080;

export const Cena08B: React.FC = () => {
  const f = useCurrentFrame();
  const conv = janela(f, CONV_EM, CONV_SAI, 11, 10);

  /**
   * A contagem dos blocos e **linear**, nao `passo`.
   *
   * O `passo` usa a curva SUAVE, que chega perto de 1 na primeira metade do
   * intervalo: com ela os oito blocos apareciam quase juntos e a contagem, que
   * e o argumento inteiro da cena, deixava de existir. Aqui o que importa e o
   * olho acompanhar um a um junto com a voz.
   */
  const contados = interpolate(f, [BLOCOS_EM, BLOCOS_ATE], [0, BLOCOS], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const unidade = interpolate(f, [UNIDADE_EM, UNIDADE_EM + s(0.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reat = janela(f, REAT_EM, CENA08B_FRAMES, 11, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-08b.mp3")} />
      </Sequence>

      {/* ---------- beat 1: o 8x contado, nao afirmado ---------- */}
      {conv > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              marginBottom: 46,
              ...entra(conv, 14),
            }}
          >
            Conversão
          </div>

          {/* a unidade vem primeiro: e contra ela que os oito blocos contam */}
          <Linha
            rotulo="média de quem acessa só o e-commerce"
            valor={unidade * 1.7}
            blocos={1}
            cheios={unidade}
            cor={m.apoio}
            o={janela(f, UNIDADE_EM, CONV_SAI, 11, 10)}
          />

          <div style={{ height: 54 }} />

          <Linha
            rotulo="quem passou por um agente"
            valor={(contados / BLOCOS) * 13.5}
            blocos={BLOCOS}
            cheios={contados}
            cor={marca.azul}
            o={janela(f, AGENTE_EM, CONV_SAI, 11, 10)}
            multiplicador={contados}
          />

          <Base texto={BASE} o={passo(f, BLOCOS_ATE + s(0.2), BLOCOS_ATE + s(0.6))} />
        </AbsoluteFill>
      ) : null}

      {/* ---------- beat 2: a reativacao, em limiares acumulados ---------- */}
      {reat > 0.001 ? (
        <AbsoluteFill style={{ padding: MARGEM, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              marginBottom: 20,
              ...entra(reat, 14),
            }}
          >
            Das recompras atribuídas aos agentes
          </div>

          <div
            style={{
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "-1.4px",
              lineHeight: 1.2,
              maxWidth: 1180,
              marginBottom: 44,
              ...entra(reat, 18),
            }}
          >
            quem já tinha esfriado <span style={{ color: marca.azul }}>voltou a comprar</span>
          </div>

          {LIMIARES.map((l, i) => {
            const o = janela(f, l.em, CENA08B_FRAMES, 10, 0);
            if (o <= 0.001) return null;
            const cresce = passo(f, l.em, l.em + s(0.9));
            return (
              <div
                key={l.pct}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  marginBottom: 22,
                  opacity: o,
                }}
              >
                {/* mesma origem, sempre encurtando: cada barra e um
                    subconjunto da de cima, nao uma fatia ao lado dela */}
                <div
                  style={{
                    width: FAIXA * (l.pct / 100) * cresce,
                    height: 58,
                    background: i === 0 ? marca.azul : `rgba(36,88,245,${0.9 - i * 0.22})`,
                    borderRadius: marca.raio.controle,
                  }}
                />
                <div
                  style={{
                    fontSize: 58,
                    fontWeight: 500,
                    letterSpacing: "-2.03px",
                    fontVariantNumeric: "tabular-nums",
                    color: marca.azul,
                  }}
                >
                  {br(conta(f, l.em, l.em + s(0.9), l.pct), 0)}%
                </div>
                <div style={{ fontSize: 30, letterSpacing: "-1.05px", color: m.apoio }}>
                  {l.rotulo}
                </div>
              </div>
            );
          })}

          <Base
            texto={`limiares acumulados: quem está há 90 dias conta nos três · ${BASE}`}
            o={passo(f, REAT_EM + s(4.4), REAT_EM + s(4.8))}
          />
        </AbsoluteFill>
      ) : null}

      <Sfx som="surge" em={CONV_EM} volume={0.2} />
      {tiquesDaContagem(CONV_EM + s(0.3), CONV_EM + s(1.3)).map((fr, i) => (
        <Sfx key={`c${i}`} som="tique" em={fr} volume={0.08} />
      ))}
      <Sfx som="marca" em={CONV_EM + s(1.5)} volume={0.26} />
      <Sfx som="surge" em={REAT_EM} volume={0.18} />
      {LIMIARES.map((l) => (
        <Sfx key={l.pct} som="assenta" em={l.em + s(0.9)} volume={0.2} />
      ))}
    </AbsoluteFill>
  );
};

/**
 * Uma linha do beat 1: rotulo, a barra feita de blocos, e o valor no fim dela.
 *
 * O `cheios` e fracionario: o bloco que esta entrando cresce em largura em vez
 * de piscar, entao a contagem parece uma regua sendo estendida e nao uma
 * sequencia de cartoes.
 */
const Linha: React.FC<{
  rotulo: string;
  valor: number;
  blocos: number;
  cheios: number;
  cor: string;
  o: number;
  /** Quando presente, o "Nx" que acompanha a contagem dos blocos. */
  multiplicador?: number;
}> = ({ rotulo, valor, blocos, cheios, cor, o, multiplicador }) => (
  <div style={{ ...entra(o, 18) }}>
    <div
      style={{
        fontSize: 28,
        letterSpacing: "-0.98px",
        color: modos.claro.apoio,
        marginBottom: 16,
      }}
    >
      {rotulo}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ display: "flex", gap: VAO_BLOCO, height: 76 }}>
        {Array.from({ length: blocos }, (_, i) => {
          const parte = Math.max(0, Math.min(1, cheios - i));
          if (parte <= 0) return null;
          return (
            <div
              key={i}
              style={{
                width: BLOCO * parte,
                height: "100%",
                background: cor,
                borderRadius: marca.raio.controle,
              }}
            />
          );
        })}
      </div>
      {/* o valor so existe depois que a barra comeca: "0,0%" parado ao lado de
          uma faixa vazia lê como erro de render, nao como estado inicial */}
      {cheios > 0.02 ? (
        <div
          style={{
            fontSize: 76,
            fontWeight: 500,
            letterSpacing: "-2.66px",
            lineHeight: 1,
            color: cor,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {br(valor, 1)}%
        </div>
      ) : null}
      {multiplicador !== undefined && multiplicador > 0.8 ? (
        <div
          style={{
            marginLeft: 24,
            fontSize: 64,
            fontWeight: 500,
            letterSpacing: "-2.66px",
            lineHeight: 1,
            color: modos.claro.tinta,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.floor(multiplicador)}x mais
        </div>
      ) : null}
    </div>
  </div>
);

/**
 * A linha de base, colada no numero.
 *
 * Ela existe porque o `Comunicacao_Profissio.md` nao aceita porcentagem de
 * resultado sem contexto, base e metodo, e porque rodape solto no fim da cena
 * nao conta como base: quem le o numero tem que ler o recorte no mesmo olhar.
 */
const Base: React.FC<{ texto: string; o: number }> = ({ texto, o }) => (
  <div
    style={{
      marginTop: 40,
      maxWidth: 1180,
      opacity: o,
    }}
  >
    <div
      style={{
        fontSize: 26,
        letterSpacing: "-0.91px",
        lineHeight: 1.35,
        color: modos.claro.apoio,
        borderTop: "1px solid rgba(16,18,24,0.22)",
        paddingTop: 16,
      }}
    >
      {texto}
    </div>
  </div>
);
