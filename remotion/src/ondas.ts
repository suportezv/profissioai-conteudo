/**
 * Envelopes de volume medidos nos proprios arquivos de audio.
 *
 * Gerados por `scripts/extrai_onda.py`, nao escritos a mao. **Barra de onda
 * inventada nao corresponde ao que e dito**, e o espectador nao le a forma da
 * onda mas percebe quando ela nao bate com a fala que esta ouvindo: silencio
 * com barra alta, palavra forte num vale. Os vales baixos destas duas listas
 * sao as pausas reais da EITA falando.
 *
 * Se o corte do clipe mudar, rodar o script de novo com os novos tempos.
 */

/** A EITA respondendo na reacao, de 2,62 s a 6,68 s do clipe. */
export const ONDA_OUVINDO = [
  0.802, 0.724, 0.864, 0.741, 0.753, 0.592, 0.491, 0.419,
  0.316, 0.000, 0.672, 0.997, 0.975, 1.000, 0.801, 0.693,
  0.907, 0.503, 0.645, 0.750, 0.653, 0.804, 0.830, 0.455,
  0.966, 0.135,
];

/** A EITA assumindo a missao, de 6,44 s a 21,68 s do clipe. */
export const ONDA_MISSAO = [
  0.577, 0.840, 0.835, 0.875, 0.901, 0.941, 0.000, 0.775,
  0.884, 0.834, 0.719, 0.972, 0.652, 0.744, 0.632, 0.000,
  0.771, 0.865, 0.916, 0.000, 0.926, 0.913, 0.000, 0.916,
  0.694, 0.738, 0.951, 0.219, 0.897, 1.000, 0.873, 0.689,
  0.797, 0.000,
];
