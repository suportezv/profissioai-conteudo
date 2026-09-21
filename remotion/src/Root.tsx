import React from "react";
import { Composition } from "remotion";
import { CartaoTitulo } from "./CartaoTitulo";
import { Hero } from "./Hero";
import { Cena01, CENA01_FRAMES } from "./Cena01";
import { Cena03, CENA03_FRAMES } from "./Cena03";
import { Cena04, CENA04_FRAMES } from "./Cena04";
import { Cena06, CENA06_FRAMES } from "./Cena06";
import { Cena07, CENA07_FRAMES } from "./Cena07";
import { Cena08, CENA08_FRAMES } from "./Cena08";
import { Cena09, CENA09_FRAMES } from "./Cena09";
import { Completo, COMPLETO_FRAMES } from "./Completo";

const base = {
  sobrelinha: "Agentes de IA · Atendimento · CRM",
  titulo: "Cada conversa move o seu negócio.",
  destaque: "conversa",
  rodape: "Agendar demonstração",
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CaseEitaCompleto"
      component={Completo}
      durationInFrames={COMPLETO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena01"
      component={Cena01}
      durationInFrames={CENA01_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena03"
      component={Cena03}
      durationInFrames={CENA03_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena04"
      component={Cena04}
      durationInFrames={CENA04_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena06"
      component={Cena06}
      durationInFrames={CENA06_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena07"
      component={Cena07}
      durationInFrames={CENA07_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena08"
      component={Cena08}
      durationInFrames={CENA08_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena09"
      component={Cena09}
      durationInFrames={CENA09_FRAMES}
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
