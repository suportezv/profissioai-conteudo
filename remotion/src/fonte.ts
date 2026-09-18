import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Registra a Sora a partir do arquivo local.
 *
 * Nao usar Google Fonts: o render roda headless e fonts.googleapis.com esta
 * fora da allowlist do environment, entao a peca sairia na sans do sistema e o
 * erro so apareceria olhando o video pronto.
 */
const espera = delayRender("Carregando Sora");

const fonte = new FontFace(
  "Sora",
  `url(${staticFile("Sora-Variable.ttf")}) format("truetype")`,
  { weight: "100 800" },
);

fonte
  .load()
  .then(() => {
    document.fonts.add(fonte);
    continueRender(espera);
  })
  .catch((e) => {
    console.error("Sora nao carregou:", e);
    continueRender(espera);
  });
