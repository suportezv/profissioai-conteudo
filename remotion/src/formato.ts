import { useVideoConfig } from "remotion";

/**
 * O formato do quadro, para a mesma cena servir ao 16:9 e ao 9:16.
 *
 * **Os cortes verticais nao sao outro filme.** Roteiro, locucao, trilha,
 * efeitos e todos os tempos sao os mesmos do corte horizontal aprovado; o que
 * muda e so a diagramacao. Por isso cada cena continua sendo um componente so
 * e le daqui em que quadro esta, em vez de existir uma copia vertical de cada
 * cena que envelheceria na primeira revisao (mesma regra do `Cabecalho.tsx`:
 * quando duas coisas tem que ser iguais, elas tem que ser uma so).
 *
 * O formato sai do tamanho da composicao, sem prop nem contexto: as
 * composicoes `*Vertical` do `Root.tsx` sao as mesmas `Completo` em 1080x1920.
 * (O `durationInFrames` do `useVideoConfig` dentro de uma `Series.Sequence` e o
 * da composicao inteira, mas largura e altura sao as do quadro, que e o que
 * interessa aqui.)
 */
export const useFormato = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return {
    vertical,
    W: width,
    H: height,
    /** Margem lateral: 120 no 16:9 (a das cenas), 72 no 9:16 (grade das pecas). */
    M: vertical ? 72 : 120,
    /**
     * Faixa segura do 9:16, onde o Reels, o TikTok e o Shorts nao desenham
     * interface por cima: o alto tem o cabecalho do app e o baixo tem legenda,
     * nome do perfil e botoes (e a coluna de botoes invade a direita na metade
     * de baixo). Texto que precisa ser lido mora entre `topo` e `base`; imagem
     * pode sangrar para fora dela. No 16:9 a faixa e o quadro inteiro.
     */
    seguro: vertical
      ? { topo: 220, base: 1500, direita: 140 }
      : { topo: 0, base: height, direita: 0 },
  };
};
