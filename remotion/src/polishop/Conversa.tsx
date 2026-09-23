import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { marca } from "../marca";
import { wa, UI } from "../whatsapp";
import { entra } from "../anim";

/**
 * As peças de conversa que as cenas 03, 06 e 07 dividem.
 *
 * Fica separado pelo mesmo motivo do `whatsapp.ts`: **três cenas desenham a
 * mesma conversa**, e se cada uma guardasse os próprios balões elas
 * divergiriam na primeira revisão. O filme depende de o espectador reconhecer
 * que é sempre o mesmo A.IChef.
 *
 * Nenhuma conversa real entra na peça: tudo aqui é recriação, e as fotos que
 * o "cliente" manda são imagens geradas, não material de usuário.
 */

export const Painel: React.FC<{
  largura: number;
  altura: number;
  o: number;
  children: React.ReactNode;
}> = ({ largura, altura, o, children }) => (
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
        padding: "15px 22px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* o avatar oficial do A.IChef esta pendente do cliente */}
      <div style={{ width: 44, height: 44, borderRadius: 22, background: wa.verde }} />
      <div style={{ fontFamily: UI, fontSize: 22, color: wa.texto }}>A.IChef</div>
    </div>
    <div
      style={{
        padding: 22,
        height: altura,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 12,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

export const Balao: React.FC<{
  o: number;
  saida?: boolean;
  largura?: number;
  children: React.ReactNode;
  hora?: string;
}> = ({ o, saida, largura = 520, children, hora }) => (
  <div
    style={{
      alignSelf: saida ? "flex-end" : "flex-start",
      maxWidth: largura,
      background: saida ? wa.balaoSaida : wa.balaoEntrada,
      borderRadius: 18,
      borderTopLeftRadius: saida ? 18 : 5,
      borderTopRightRadius: saida ? 5 : 18,
      padding: "13px 17px",
      fontFamily: UI,
      fontSize: 22,
      color: wa.texto,
      lineHeight: 1.4,
      ...entra(o, 12),
    }}
  >
    {children}
    {hora ? (
      <div
        style={{
          fontSize: 15,
          color: wa.apoio,
          textAlign: "right",
          marginTop: 4,
        }}
      >
        {hora}
      </div>
    ) : null}
  </div>
);

/** Foto mandada dentro de um balão, como o app mostra. */
export const BalaoFoto: React.FC<{
  o: number;
  arquivo: string;
  saida?: boolean;
  legenda?: string;
}> = ({ o, arquivo, saida, legenda }) => (
  <div
    style={{
      alignSelf: saida ? "flex-end" : "flex-start",
      background: saida ? wa.balaoSaida : wa.balaoEntrada,
      borderRadius: 18,
      borderTopRightRadius: saida ? 5 : 18,
      borderTopLeftRadius: saida ? 18 : 5,
      padding: 6,
      ...entra(o, 12),
    }}
  >
    <Img
      src={staticFile(`polishop/${arquivo}`)}
      style={{
        width: 300,
        height: 300,
        objectFit: "cover",
        borderRadius: 14,
        display: "block",
      }}
    />
    {legenda ? (
      <div
        style={{
          fontFamily: UI,
          fontSize: 21,
          color: wa.texto,
          padding: "10px 12px 4px",
          maxWidth: 300,
          lineHeight: 1.35,
        }}
      >
        {legenda}
      </div>
    ) : null}
  </div>
);

/** Os três pontinhos. Mensagem que aparece do nada lê como cartão de motion. */
export const Digitando: React.FC<{ o: number }> = ({ o }) => {
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
}> = ({ o, progresso, saida }) => (
  <div
    style={{
      alignSelf: saida ? "flex-end" : "flex-start",
      width: 430,
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
          width: 50,
          height: 50,
          borderRadius: 25,
          background: wa.verde,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="16" height="19" viewBox="0 0 12 14">
          <rect x="0" y="0" width="4" height="14" fill={wa.fundoChat} />
          <rect x="8" y="0" width="4" height="14" fill={wa.fundoChat} />
        </svg>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3, height: 44 }}>
        {ONDA.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6 + v * 36,
              borderRadius: 2,
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
        fontSize: 15,
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

/** Cartão de vídeo, como o app mostra um mp4 recebido. */
export const BalaoVideo: React.FC<{ o: number; titulo: string; dura: string }> = ({
  o,
  titulo,
  dura,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        alignSelf: "flex-start",
        background: wa.balaoEntrada,
        borderRadius: 18,
        borderTopLeftRadius: 5,
        padding: 6,
        ...entra(o, 12),
      }}
    >
      <div
        style={{
          width: 330,
          height: 186,
          borderRadius: 14,
          background: "#16232A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 31,
            background: "rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="22" height="26" viewBox="0 0 22 26">
            <path d="M3 2l17 11L3 24z" fill={wa.texto} />
          </svg>
        </div>
        {/* a barra anda: cartao de video parado le como imagem quebrada */}
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.22)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${interpolate(f % 90, [0, 90], [0, 100])}%`,
              background: wa.verde,
            }}
          />
        </div>
      </div>
      <div
        style={{
          fontFamily: UI,
          fontSize: 20,
          color: wa.texto,
          padding: "10px 12px 4px",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <span>{titulo}</span>
        <span style={{ color: wa.apoio }}>{dura}</span>
      </div>
    </div>
  );
};
