import React from "react";
import { Composition } from "remotion";
import { CartaoTitulo } from "./CartaoTitulo";
import { Hero } from "./Hero";
import { Cena01, CENA01_FRAMES } from "./Cena01";

const base = {
  sobrelinha: "Agentes de IA · Atendimento · CRM",
  titulo: "Cada conversa move o seu negócio.",
  destaque: "conversa",
  rodape: "Agendar demonstração",
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CaseEitaCena01"
      component={Cena01}
      durationInFrames={CENA01_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="HeroSite"
      component={Hero}
      durationInFrames={720}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CartaoTituloVertical"
      component={CartaoTitulo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ ...base, modo: "escuro" as const }}
    />
    <Composition
      id="CartaoTituloFeed"
      component={CartaoTitulo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1350}
      defaultProps={{ ...base, modo: "claro" as const }}
    />
    <Composition
      id="CartaoTituloQuadrado"
      component={CartaoTitulo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ ...base, modo: "azul" as const }}
    />
  </>
);
