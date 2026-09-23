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
import { useFormato } from "../formato";

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
/** Periodo confirmado pelo cliente em 23/set: o mesmo da cena 08. O N segue pendente. */
const BASE = "todos os agentes da Soldiers, com as personas · 07/08/2026 a 21/09/2026 · N a confirmar";

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
  { pct: 50, rotulo: "já estavam há mais de 30 dias sem comprar", em: REAT_EM + s(0.3) },
  { pct: 31, rotulo: "já estavam há mais de 60 dias sem comprar", em: REAT_EM + s(4.0) },
  { pct: 21, rotulo: "já estavam há mais de 90 dias sem comprar", em: REAT_EM + s(4.8) },
];

/** Largura util da faixa de barras, em px de 1920. 100% ocupa isso. */
const FAIXA = 1080;

/**
 * O 9:16. Os oito blocos ocupam a largura util inteira (8 x 110 + 7 vaos de 8
 * = 936), e por isso o valor desce para baixo da barra, com o "8x mais" numa
 * linha propria: "13,5%" a 260 px mede 692, e os dois lado a lado passam da
 * largura util. As duas taxas tem o mesmo corpo, como no 16:9. Na reativacao a
 * regua e de 1100 px (50% = 550), com a porcentagem na ponta e o rotulo
 * embaixo: lado a lado ele nao cabe numa coluna de 1080.
 */
const V = {
  bloco: 110,
  alturaBloco: 110,
  taxa: 260,
  faixa: 1100,
  alturaBarra: 100,
  limiar: 120,
};

export const Cena08B: React.FC = () => {
  const f = useCurrentFrame();
  const { vertical, M, W, H, seguro } = useFormato();
  const PAD = vertical
    ? `${seguro.topo}px ${M}px ${H - seguro.base}px`
    : MARGEM;
  const faixa = vertical ? V.faixa : FAIXA;
  /** Texto de apoio no 9:16 para antes da coluna de botoes do app. */
  const largTexto = W - M - seguro.direita;
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
        <AbsoluteFill style={{ padding: PAD, justifyContent: "center" }}>
          <div
            style={{
              fontSize: vertical ? 30 : 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              marginBottom: vertical ? 48 : 46,
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
            vertical={vertical}
          />

          <div style={{ height: vertical ? 56 : 54 }} />

          <Linha
            rotulo="quem passou por um agente"
            valor={(contados / BLOCOS) * 13.5}
            blocos={BLOCOS}
            cheios={contados}
            cor={marca.azul}
            o={janela(f, AGENTE_EM, CONV_SAI, 11, 10)}
            multiplicador={contados}
            vertical={vertical}
          />

          <Base
            texto={BASE}
            o={passo(f, BLOCOS_ATE + s(0.2), BLOCOS_ATE + s(0.6))}
            vertical={vertical}
            largura={largTexto}
          />
        </AbsoluteFill>
      ) : null}

      {/* ---------- beat 2: a reativacao, em limiares acumulados ---------- */}
      {reat > 0.001 ? (
        <AbsoluteFill style={{ padding: PAD, justifyContent: "center" }}>
          <div
            style={{
              fontSize: vertical ? 30 : 24,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: marca.azul,
              marginBottom: vertical ? 24 : 20,
              ...entra(reat, 14),
            }}
          >
            Das recompras atribuídas aos agentes
          </div>

          <div
            style={{
              fontSize: vertical ? 84 : 40,
              fontWeight: 500,
              letterSpacing: vertical ? "-2.94px" : "-1.4px",
              lineHeight: vertical ? 1.1 : 1.2,
              // no 9:16 "quem ja tinha esfriado" mede 889 px e fecha a primeira
              // linha: a parte azul fica inteira na segunda
              maxWidth: vertical ? 936 : 1180,
              marginBottom: vertical ? 56 : 44,
              ...entra(reat, 18),
            }}
          >
            quem já tinha esfriado <span style={{ color: marca.azul }}>voltou a comprar</span>
          </div>

          {LIMIARES.map((l, i) => {
            const o = janela(f, l.em, CENA08B_FRAMES, 10, 0);
            if (o <= 0.001) return null;
            const cresce = passo(f, l.em, l.em + s(0.9));
            if (vertical) {
              // barra e porcentagem numa linha, o rotulo embaixo
              return (
                <div
                  key={l.pct}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 30,
                    opacity: o,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div
                      style={{
                        width: faixa * (l.pct / 100) * cresce,
                        height: V.alturaBarra,
                        background:
                          i === 0 ? marca.azul : `rgba(36,88,245,${0.9 - i * 0.22})`,
                        borderRadius: marca.raio.controle,
                      }}
                    />
                    <div
                      style={{
                        fontSize: V.limiar,
                        fontWeight: 500,
                        letterSpacing: "-4.2px",
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                        color: marca.azul,
                      }}
                    >
                      {br(conta(f, l.em, l.em + s(0.9), l.pct), 0)}%
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 40,
                      letterSpacing: "-1.4px",
                      color: m.apoio,
                      maxWidth: largTexto,
                    }}
                  >
                    {l.rotulo}
                  </div>
                </div>
              );
            }
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
            vertical={vertical}
            largura={largTexto}
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
  /**
   * No 9:16 os oito blocos tomam a largura toda, entao o valor e o
   * multiplicador descem para a linha de baixo da barra (so na linha de oito:
   * a unidade continua com o valor na ponta, que ali cabe).
   */
  vertical?: boolean;
}> = ({ rotulo, valor, blocos, cheios, cor, o, multiplicador, vertical = false }) => {
  const empilha = vertical && blocos > 1;
  const barra = (
    <div
      style={{
        display: "flex",
        gap: VAO_BLOCO,
        height: vertical ? V.alturaBloco : 76,
        // no 9:16 a linha empilhada reserva a altura antes do primeiro bloco
        minHeight: empilha ? V.alturaBloco : undefined,
      }}
    >
      {Array.from({ length: blocos }, (_, i) => {
        const parte = Math.max(0, Math.min(1, cheios - i));
        if (parte <= 0) return null;
        return (
          <div
            key={i}
            style={{
              width: (vertical ? V.bloco : BLOCO) * parte,
              height: "100%",
              background: cor,
              borderRadius: marca.raio.controle,
            }}
          />
        );
      })}
    </div>
  );
  // o valor so existe depois que a barra comeca: "0,0%" parado ao lado de
  // uma faixa vazia le como erro de render, nao como estado inicial
  const numero =
    cheios > 0.02 ? (
      <div
        style={{
          fontSize: vertical ? V.taxa : 76,
          fontWeight: 500,
          letterSpacing: vertical ? "-9.1px" : "-2.66px",
          lineHeight: 1,
          color: cor,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {br(valor, 1)}%
      </div>
    ) : null;
  const vezes =
    multiplicador !== undefined && multiplicador > 0.8 ? (
      <div
        style={{
          marginLeft: vertical ? 0 : 24,
          fontSize: vertical ? 84 : 64,
          fontWeight: 500,
          letterSpacing: vertical ? "-2.94px" : "-2.66px",
          lineHeight: 1,
          color: modos.claro.tinta,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.floor(multiplicador)}x mais
      </div>
    ) : null;

  if (empilha) {
    return (
      <div style={{ ...entra(o, 18) }}>
        <div
          style={{
            fontSize: 40,
            letterSpacing: "-1.4px",
            color: modos.claro.apoio,
            marginBottom: 18,
          }}
        >
          {rotulo}
        </div>
        {barra}
        {/* a altura fica reservada: o numero entra sem empurrar a base */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            height: V.taxa + 8 + 84,
            marginTop: 20,
          }}
        >
          {numero}
          {vezes}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...entra(o, 18) }}>
      <div
        style={{
          fontSize: vertical ? 40 : 28,
          letterSpacing: vertical ? "-1.4px" : "-0.98px",
          color: modos.claro.apoio,
          marginBottom: vertical ? 18 : 16,
        }}
      >
        {rotulo}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {barra}
        {numero}
        {vezes}
      </div>
    </div>
  );
};

/**
 * A linha de base, colada no numero.
 *
 * Ela existe porque o `Comunicacao_Profissio.md` nao aceita porcentagem de
 * resultado sem contexto, base e metodo, e porque rodape solto no fim da cena
 * nao conta como base: quem le o numero tem que ler o recorte no mesmo olhar.
 */
const Base: React.FC<{
  texto: string;
  o: number;
  vertical?: boolean;
  /** No 9:16, a largura que para antes da coluna de botoes do app. */
  largura?: number;
}> = ({ texto, o, vertical = false, largura = 1180 }) => (
  <div
    style={{
      marginTop: vertical ? 36 : 40,
      maxWidth: vertical ? largura : 1180,
      opacity: o,
    }}
  >
    <div
      style={{
        fontSize: vertical ? 32 : 26,
        letterSpacing: vertical ? "-1.12px" : "-0.91px",
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
