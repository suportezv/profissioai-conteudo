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

/**
 * Cena 07 do case Soldiers: sete personas sobre a mesma arquitetura.
 *
 * 10 s, narracao de 7,89 s que comeca em 0,6 s.
 *
 * ## Os nomes sao os reais, lidos do proprio produto
 *
 * Saiam do site do MODO (`modo.soldiersnutrition.com.br`), da mesma estrutura
 * de dados que desenha os cartoes de "Modos exclusivos". Nao sao suposicao: sao
 * o que o cliente publica.
 *
 * **Os MODOs de influenciador nao sao os mesmos rostos dos videos de opt-in da
 * cena 03.** Aquela e a base de afiliados, bem maior; esta e a lista curada de
 * sete. Misturar as duas seria erro de fato, entao nenhuma imagem viaja de uma
 * cena para a outra.
 *
 * ## As fotos foram recortadas contra a cabeca, nao contra a borda
 *
 * O cliente mandou seis artes com enquadramentos muito diferentes: de plano
 * inteiro a busto fechado, cada uma com a pessoa num lado do quadro. Cortadas
 * pela borda elas viravam seis cartoes de escalas diferentes, e a grade
 * perdia a leitura de "a mesma arquitetura".
 *
 * O corte e derivado da **caixa da cabeca** de cada foto: a cabeca ocupa 30%
 * da altura do corte e o topo dela cai a 10% do quadro, sempre. Quem estava
 * mais aberto foi aproximado, quem ja estava fechado ficou como estava. Isso
 * inclui o Vitor Zanelato, que veio do site bem mais aberto que os outros e
 * foi repadronizado junto.
 *
 * As sete artes chegaram. Se alguma faltasse, o cartao usaria a **inicial**,
 * que e o proprio fallback que o site desenhou: recriar o rosto de alguem, ou
 * pescar um frame de outro video achando que e a mesma pessoa, seria pior que
 * a lacuna.
 *
 * ## O cartao e do cliente, entao ele tem a cara do cliente
 *
 * Fundo escuro e amarelo `#F6C800` sao do MODO, nao da Profissio. Mesma regra
 * do verde do WhatsApp na cena 04 do case anterior: cor de terceiro e do
 * terceiro, mesmo quando quem monta a peca somos nos.
 */

export const CENA07_FRAMES = s(10);
const AUDIO_EM = s(0.6);
const MARGEM = 120;
const m = modos.claro;

/** O amarelo do MODO. E da Soldiers, nao da Profissio: nao trocar pelo azul. */
const MODO_AMARELO = "#F6C800";
const MODO_FUNDO = "#141414";
const MODO_BORDA = "#2C2C2C";

type Persona = {
  /** Como o cartao se chama no site, depois da palavra MODO. */
  nome: string;
  /** A inicial que o proprio site usa quando a arte nao carrega. */
  letra: string;
  /** Arquivo em `public/soldiers-personas`, quando existe. */
  arte?: string;
  /** A arte do MODO base e quadrada: "cover" decepa o lockup, entao ela cabe. */
  encaixe?: "cover" | "contain";
  /** O MODO base vem na assinatura; os outros pedem cupom. */
  base?: boolean;
};

const PERSONAS: Persona[] = [
  {
    nome: "SOLDIERS",
    letra: "M",
    arte: "modo-base.jpg",
    encaixe: "contain",
    base: true,
  },
  { nome: "JUJU SALIMENI", letra: "J", arte: "juju-salimeni.jpg" },
  { nome: "CANTARELLI", letra: "F", arte: "cantarelli.jpg" },
  { nome: "CEUBOLINHA", letra: "C", arte: "ceubolinha.jpg" },
  { nome: "GORDELAZZ", letra: "G", arte: "gordelazz.jpg" },
  { nome: "LUCAS STEIN", letra: "L", arte: "lucas-stein.jpg" },
  { nome: "VITOR ZANELATO", letra: "V", arte: "vitor-zanelato.jpg" },
];

const PRIMEIRO = s(1.0);
const PASSO_ENTRE = 9;
const LIGA = s(6.2);

export const Cena07: React.FC = () => {
  const f = useCurrentFrame();
  const liga = passo(f, LIGA, LIGA + s(0.9));
  const base = janela(f, s(6.6), CENA07_FRAMES, 10, 0);

  return (
    <AbsoluteFill style={{ fontFamily: marca.fonte, color: m.tinta }}>
      <Superficie modo="claro" halo />
      <Sequence from={AUDIO_EM}>
        <Audio src={staticFile("locucao-soldiers/cena-07.mp3")} />
      </Sequence>

      <AbsoluteFill
        style={{
          padding: MARGEM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 48,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: marca.azul,
            opacity: janela(f, s(0.6), CENA07_FRAMES, 9, 0),
          }}
        >
          Sete personas ao mesmo tempo
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {PERSONAS.map((p, i) => {
            const o = janela(f, PRIMEIRO + i * PASSO_ENTRE, CENA07_FRAMES, 8, 0);
            return (
              <div
                key={p.nome}
                style={{
                  flexGrow: 1,
                  flexBasis: 0,
                  background: MODO_FUNDO,
                  border: `1px solid ${p.base ? MODO_AMARELO : MODO_BORDA}`,
                  borderRadius: marca.raio.painel,
                  boxShadow: marca.sombra.painel,
                  height: 400,
                  position: "relative",
                  overflow: "hidden",
                  ...entra(o, 18),
                }}
              >
                {p.arte ? (
                  <Img
                    src={staticFile(`soldiers-personas/${p.arte}`)}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: p.encaixe ?? "cover",
                      objectPosition: p.encaixe === "contain" ? "center 38%" : "center",
                    }}
                  />
                ) : (
                  /* o fallback que o proprio site desenhou: a inicial, fantasma */
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 200,
                      fontWeight: 700,
                      color: MODO_AMARELO,
                      opacity: 0.09,
                      lineHeight: 1,
                    }}
                  >
                    {p.letra}
                  </div>
                )}

                {/* o escurecimento que segura o nome sobre a foto */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(20,20,20,0) 38%, rgba(20,20,20,0.92) 88%)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      alignSelf: "flex-start",
                      border: `1px solid ${p.base ? "#3a3a3a" : "#4c471f"}`,
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: p.base ? "#AAA9A5" : MODO_AMARELO,
                    }}
                  >
                    {p.base ? "na assinatura" : "por cupom"}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: MODO_AMARELO,
                    }}
                  >
                    MODO
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "-0.5px",
                      lineHeight: 1.1,
                      color: marca.branco,
                    }}
                  >
                    {p.nome}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* a linha que liga os sete: so existe depois que todos entraram */}
        <div style={{ position: "relative", height: 58 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "7%",
              width: "86%",
              height: 1,
              background: "rgba(16,18,24,0.22)",
              transformOrigin: "center",
              transform: `scaleX(${liga})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 30,
              letterSpacing: "-1.05px",
              color: m.apoio,
              ...entra(base, 14),
            }}
          >
            a mesma arquitetura, testada uma vez
          </div>
        </div>
      </AbsoluteFill>

      {/* um toque por cartao, e mais nada.
          A cena tinha sete cartoes e **oito** eventos de som: os sete tiques
          mais um `surge` no beat da conexao. Contado de ouvido isso vira "um
          click a mais", porque o ouvido nao separa o que e cartao do que e
          transicao quando os dois tocam na mesma cena. Se a conexao voltar a
          precisar de som, ele tem que ser de outra familia, nao mais um
          toque. */}
      {PERSONAS.map((p, i) => (
        <Sfx key={p.nome} som="tique" em={PRIMEIRO + i * PASSO_ENTRE} volume={0.1} />
      ))}
    </AbsoluteFill>
  );
};
