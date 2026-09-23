import React from "react";
import {
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { marca } from "../marca";
import { wa, UI } from "../whatsapp";
import { entra, s } from "../anim";
import { useFormato } from "../formato";

/**
 * O fator da conversa no 9:16.
 *
 * No vertical a conversa e o assunto do quadro, e ela tem que ler como um
 * celular na mao, nao como um print reduzido: tudo cresce 50% (corpo 22 vira
 * 33, que e o tamanho de leitura de uma mensagem num Reels). No 16:9 o fator
 * e 1, e cada numero abaixo sai identico ao de antes.
 */
const useK = () => (useFormato().vertical ? 1.5 : 1);

/** Duração real do clipe gerado, que é o que a barra de progresso anda. */
const CLIPE_FRAMES = s(4);

/**
 * As peças de conversa que as cenas 03, 06 e 07 dividem.
 *
 * Fica separado pelo mesmo motivo do `whatsapp.ts`: **três cenas desenham a
 * mesma conversa**, e se cada uma guardasse os próprios balões elas
 * divergiriam na primeira revisão. O filme depende de o espectador reconhecer
 * que é sempre o mesmo AIChef.
 *
 * Nenhuma conversa real entra na peça: tudo aqui é recriação, e as fotos que
 * o "cliente" manda são imagens geradas, não material de usuário.
 */

/**
 * O avatar do AIChef, como o WhatsApp mostra a foto de perfil de uma empresa.
 *
 * O arquivo do cliente é o balão escuro com o chapéu de chef vermelho, num
 * retrato alto. Avatar de app é redondo, então o desenho vai **contido** num
 * disco branco em vez de preencher o círculo: cortar pela borda decapitaria o
 * chapéu, que é justamente o que identifica a marca. O deslocamento vertical
 * de 4% centra o conjunto chapéu mais balão, que tem o peso visual embaixo.
 */
export const AvatarChef: React.FC<{ tam: number }> = ({ tam }) => (
  <div
    style={{
      width: tam,
      height: tam,
      borderRadius: tam / 2,
      background: "#FFFFFF",
      flexShrink: 0,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Img
      src={staticFile("marca-polishop/aichef-avatar.png")}
      style={{
        width: tam * 0.7,
        height: tam * 0.82,
        objectFit: "contain",
        transform: `translateY(${tam * 0.04}px)`,
        display: "block",
      }}
    />
  </div>
);

export const Painel: React.FC<{
  largura: number;
  altura: number;
  o: number;
  children: React.ReactNode;
}> = ({ largura, altura, o, children }) => {
  const k = useK();
  return (
    <div
      style={{
        width: largura,
        background: wa.fundoChat,
        borderRadius: marca.raio.arte,
        overflow: "hidden",
        boxShadow: marca.sombra.painel,
        ...entra(o, 20),
      }}
    >
      <div
        style={{
          background: wa.barra,
          padding: `${15 * k}px ${22 * k}px`,
          display: "flex",
          alignItems: "center",
          gap: 14 * k,
        }}
      >
        <AvatarChef tam={44 * k} />
        <div style={{ fontFamily: UI, fontSize: 22 * k, color: wa.texto }}>AIChef</div>
      </div>
      <div
        style={{
          padding: 22 * k,
          height: altura,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 12 * k,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Balao: React.FC<{
  o: number;
  saida?: boolean;
  largura?: number;
  children: React.ReactNode;
  hora?: string;
}> = ({ o, saida, largura = 520, children, hora }) => {
  const k = useK();
  return (
    <div
      style={{
        alignSelf: saida ? "flex-end" : "flex-start",
        maxWidth: largura * k,
        background: saida ? wa.balaoSaida : wa.balaoEntrada,
        borderRadius: 18 * k,
        borderTopLeftRadius: (saida ? 18 : 5) * k,
        borderTopRightRadius: (saida ? 5 : 18) * k,
        padding: `${13 * k}px ${17 * k}px`,
        fontFamily: UI,
        fontSize: 22 * k,
        color: wa.texto,
        lineHeight: 1.4,
        ...entra(o, 12),
      }}
    >
      {children}
      {hora ? (
        <div
          style={{
            fontSize: 15 * k,
            color: wa.apoio,
            textAlign: "right",
            marginTop: 4 * k,
          }}
        >
          {hora}
        </div>
      ) : null}
    </div>
  );
};

/** Foto mandada dentro de um balão, como o app mostra. */
export const BalaoFoto: React.FC<{
  o: number;
  arquivo: string;
  saida?: boolean;
  legenda?: string;
}> = ({ o, arquivo, saida, legenda }) => {
  const k = useK();
  return (
    <div
      style={{
        alignSelf: saida ? "flex-end" : "flex-start",
        background: saida ? wa.balaoSaida : wa.balaoEntrada,
        borderRadius: 18 * k,
        borderTopRightRadius: (saida ? 5 : 18) * k,
        borderTopLeftRadius: (saida ? 18 : 5) * k,
        padding: 6 * k,
        ...entra(o, 12),
      }}
    >
      <Img
        src={staticFile(`polishop/${arquivo}`)}
        style={{
          width: 300 * k,
          height: 300 * k,
          objectFit: "cover",
          borderRadius: 14 * k,
          display: "block",
        }}
      />
      {legenda ? (
        <div
          style={{
            fontFamily: UI,
            fontSize: 21 * k,
            color: wa.texto,
            padding: `${10 * k}px ${12 * k}px ${4 * k}px`,
            maxWidth: 300 * k,
            lineHeight: 1.35,
          }}
        >
          {legenda}
        </div>
      ) : null}
    </div>
  );
};

/** Os três pontinhos. Mensagem que aparece do nada lê como cartão de motion. */
export const Digitando: React.FC<{ o: number }> = ({ o }) => {
  const f = useCurrentFrame();
  const k = useK();
  return (
    <div
      style={{
        background: wa.balaoEntrada,
        borderRadius: 18 * k,
        borderTopLeftRadius: 5 * k,
        padding: `${16 * k}px ${20 * k}px`,
        alignSelf: "flex-start",
        display: "flex",
        gap: 7 * k,
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
              width: 9 * k,
              height: 9 * k,
              borderRadius: 5 * k,
              background: wa.apoio,
              opacity: 0.45 + sobe * 0.55,
              transform: `translateY(${-sobe * 4 * k}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Balão de áudio no tamanho que um áudio de WhatsApp realmente tem.
 *
 * Lição do case anterior: compacto demais ele lê como chip, não como áudio.
 * No app o áudio ocupa quase a largura útil da conversa, porque a barra de
 * progresso precisa de curso.
 */
const ONDA = [
  0.3, 0.55, 0.38, 0.72, 0.5, 0.88, 0.6, 0.42, 0.8, 0.55, 0.32, 0.68, 0.46,
  0.9, 0.58, 0.36, 0.74, 0.5, 0.82, 0.6, 0.4, 0.66, 0.48, 0.86,
];

export const BalaoAudio: React.FC<{
  o: number;
  progresso: number;
  saida?: boolean;
}> = ({ o, progresso, saida }) => {
  const k = useK();
  return (
  <div
    style={{
      alignSelf: saida ? "flex-end" : "flex-start",
      width: 430 * k,
      background: saida ? wa.balaoSaida : wa.balaoEntrada,
      borderRadius: 18 * k,
      borderTopLeftRadius: (saida ? 18 : 5) * k,
      borderTopRightRadius: (saida ? 5 : 18) * k,
      padding: `${14 * k}px ${18 * k}px ${8 * k}px`,
      display: "flex",
      flexDirection: "column",
      gap: 2 * k,
      ...entra(o, 12),
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
      <div
        style={{
          width: 50 * k,
          height: 50 * k,
          borderRadius: 25 * k,
          background: wa.verde,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={16 * k} height={19 * k} viewBox="0 0 12 14">
          <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
          <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
        </svg>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 * k, height: 44 * k }}>
        {ONDA.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: (6 + v * 36) * k,
              borderRadius: 2 * k,
              background: i / ONDA.length <= progresso ? wa.lido : wa.apoio,
              opacity: i / ONDA.length <= progresso ? 0.95 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
    <div
      style={{
        fontFamily: UI,
        fontSize: 15 * k,
        color: wa.apoio,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>0:11</span>
      <span>{saida ? "19:42" : "19:42"}</span>
    </div>
  </div>
  );
};

/**
 * Cartão de vídeo, como o app mostra um mp4 recebido.
 *
 * ## O quadro estava vazio, e vazio é o que o usuário viu
 *
 * Até 23/set/2026 aqui havia um retângulo `#16232A` com um botão de play e uma
 * barra correndo. A intenção era "não usar material do cliente", mas o efeito
 * era **um cartão de vídeo sem vídeo**, e o usuário pediu para gerar um. Ele
 * tem razão e a razão é de argumento: a cena afirma que a Polishop grava as
 * próprias receitas e manda o vídeo junto do passo a passo, e um retângulo
 * escuro não afirma nada.
 *
 * O clipe é **gerado**, não é material do cliente, o que mantém a regra de
 * recriação intacta: mãos arrumando frango no cesto de uma air fryer numa
 * cozinha, sem rosto, sem texto e sem marca nenhuma no quadro.
 *
 * ## O play some, porque vídeo parado num filme de motion lê como foto
 *
 * No app o vídeo fica parado até alguém tocar. Aqui ele começa parado com o
 * play por cima e, meio segundo depois, o play sai e o vídeo corre, como se
 * tivesse sido tocado. A barra de progresso anda **na duração real do
 * arquivo**, não numa contagem inventada.
 */
export const BalaoVideo: React.FC<{
  o: number;
  titulo: string;
  dura: string;
  /** Frame da cena em que o balão entrou, de onde sai o tempo de reprodução. */
  em: number;
}> = ({ o, titulo, dura, em }) => {
  const f = useCurrentFrame();
  const k = useK();
  const { vertical } = useFormato();
  const decorrido = Math.max(0, f - em);
  const toca = interpolate(decorrido, [12, 22], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const andou = Math.min(1, decorrido / (CLIPE_FRAMES * 2));

  return (
    <div
      style={{
        alignSelf: "flex-start",
        background: wa.balaoEntrada,
        borderRadius: 18 * k,
        borderTopLeftRadius: 5 * k,
        padding: 6 * k,
        ...entra(o, 12),
      }}
    >
      {/* No 9:16 o video chega em pe, 4:5, como chega um video gravado no
          celular: o clipe 16:9 e recortado no cesto, que fica no centro do
          quadro de origem, e nao reduzido dentro do balao. */}
      <div
        style={{
          width: vertical ? 420 : 330,
          height: vertical ? 525 : 186,
          borderRadius: 14 * k,
          background: "#16232A",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* `OffthreadVideo` nao tem `loop` nesta versao; o `Loop` do Remotion
            repete o clipe de 4 s pelos ~10 s que o balao fica em cena. */}
        <Loop durationInFrames={CLIPE_FRAMES} layout="none">
          <OffthreadVideo
            src={staticFile("polishop/receita-frango.mp4")}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Loop>
        {/* o play sai como se alguem tivesse tocado */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(11,20,26,${0.28 * toca})`,
            opacity: toca,
          }}
        >
          <div
            style={{
              width: 62 * k,
              height: 62 * k,
              borderRadius: 31 * k,
              background: "rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={22 * k} height={26 * k} viewBox="0 0 22 26">
              <path d="M3 2l17 11L3 24z" fill={wa.texto} />
            </svg>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 12 * k,
            right: 12 * k,
            bottom: 12 * k,
            height: 3 * k,
            borderRadius: 2,
            background: "rgba(255,255,255,0.22)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: "100%", width: `${andou * 100}%`, background: wa.verde }} />
        </div>
      </div>
      <div
        style={{
          fontFamily: UI,
          fontSize: 20 * k,
          color: wa.texto,
          padding: `${10 * k}px ${12 * k}px ${4 * k}px`,
          display: "flex",
          justifyContent: "space-between",
          gap: 16 * k,
        }}
      >
        <span>{titulo}</span>
        <span style={{ color: wa.apoio }}>{dura}</span>
      </div>
    </div>
  );
};
