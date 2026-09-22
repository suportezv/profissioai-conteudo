import React from "react";
import { Composition } from "remotion";
import { CartaoTitulo } from "./CartaoTitulo";
import { Hero } from "./Hero";
import { Cena01, CENA01_FRAMES } from "./Cena01";
import { Cena03, CENA03_FRAMES } from "./Cena03";
import {
  Cena04A,
  Cena04B,
  CENA04A_FRAMES,
  CENA04B_FRAMES,
} from "./Cena04";
import { Sonora } from "./Sonora";
import { Cena06, CENA06_FRAMES } from "./Cena06";
import { Cena07, CENA07_FRAMES } from "./Cena07";
import { Cena08, CENA08_FRAMES } from "./Cena08";
import { Cena09, CENA09_FRAMES } from "./Cena09";
import { Completo, COMPLETO_FRAMES } from "./Completo";
import {
  Completo as SoldiersCompleto,
  COMPLETO_FRAMES as SOLDIERS_FRAMES,
} from "./soldiers/Completo";
import {
  Completo as YooperCompleto,
  COMPLETO_FRAMES as YOOPER_FRAMES,
} from "./yooper/Completo";
import { Cena01 as Y01, CENA01_FRAMES as Y01_F } from "./yooper/Cena01";
import { Cena02 as Y02, CENA02_FRAMES as Y02_F } from "./yooper/Cena02";
import { Cena03 as Y03, CENA03_FRAMES as Y03_F } from "./yooper/Cena03";
import { Cena05 as Y05, CENA05_FRAMES as Y05_F } from "./yooper/Cena05";
import { Cena06 as Y06, CENA06_FRAMES as Y06_F } from "./yooper/Cena06";
import { Cena07 as Y07, CENA07_FRAMES as Y07_F } from "./yooper/Cena07";
import { Cena08 as Y08, CENA08_FRAMES as Y08_F } from "./yooper/Cena08";
import { Cena09 as Y09, CENA09_FRAMES as Y09_F } from "./yooper/Cena09";

const base = {
  sobrelinha: "Agentes de IA · Atendimento · CRM",
  titulo: "Cada conversa move o seu negócio.",
  destaque: "conversa",
  rodape: "Agendar demonstração",
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="YooperCompleto"
      component={YooperCompleto}
      durationInFrames={YOOPER_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena01"
      component={Y01}
      durationInFrames={Y01_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena02"
      component={Y02}
      durationInFrames={Y02_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena03"
      component={Y03}
      durationInFrames={Y03_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena05"
      component={Y05}
      durationInFrames={Y05_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena06"
      component={Y06}
      durationInFrames={Y06_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena07"
      component={Y07}
      durationInFrames={Y07_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena08"
      component={Y08}
      durationInFrames={Y08_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="YooperCena09"
      component={Y09}
      durationInFrames={Y09_F}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="SoldiersCompleto"
      component={SoldiersCompleto}
      durationInFrames={SOLDIERS_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
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
      id="CaseEitaCena04A"
      component={Cena04A}
      durationInFrames={CENA04A_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CaseEitaCena04B"
      component={Cena04B}
      durationInFrames={CENA04B_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    {/* a sonora existe como composicao propria so para conferir o GC sobre o
        plano sem renderizar o filme inteiro */}
    <Composition
      id="CaseEitaSonora07"
      component={Sonora}
      durationInFrames={234}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        arquivo: "ana-ouvindo.mp4",
        nome: "Anaclaudia Zani",
        papel: "psicóloga · criadora da EITA",
        gcEm: 2.8,
        gcDura: 3.6,
      }}
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
