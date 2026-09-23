/**
 * Motor de digitacao: escrever, hesitar, apagar, escrever de novo.
 *
 * Existe separado da cena porque o **ritmo e o conteudo da cena**, nao um
 * detalhe de animacao. Quem esta desabafando digita rapido, para, apaga mais
 * rapido ainda e recomeca. Mudar esse ritmo e mudar o que a cena diz, entao
 * ele fica num lugar so, em segundos, legivel sem ler o resto.
 *
 * O tempo de cada trecho e derivado da **velocidade em caracteres por
 * segundo**, nao fixado a mao: frase mais longa leva mais tempo sozinha, e
 * trocar uma frase nao obriga a recalcular a linha do tempo inteira.
 */

/** Velocidades medidas em pessoa digitando com urgencia, nao em datilografo. */
export const CPS_DIGITA = 19; // caracteres por segundo, escrevendo
export const CPS_APAGA = 38; // apagando e mais rapido: e segurar o backspace

export type Rascunho = {
  texto: string;
  /** Quanto tempo a frase fica inteira na tela antes de ser apagada. */
  hesita: number;
  /** O ultimo rascunho nao e apagado: fica ali, sem ser enviado. */
  apaga?: boolean;
  /** Respiro depois de apagar, antes de comecar o proximo. */
  pausa?: number;
};

export type Trecho = {
  ini: number;
  fim: number;
  texto: string;
  /** true enquanto caracteres entram ou saem: o cursor pisca so na pausa. */
  ativo: boolean;
};

/**
 * Monta a linha do tempo a partir dos rascunhos, em segundos.
 *
 * Devolve uma lista de trechos consultavel por tempo, e o total, para a cena
 * conferir se cabe na duracao que tem.
 */
export const montaDigitacao = (
  rascunhos: Rascunho[],
  comecaEm: number,
): { trechos: Trecho[]; total: number } => {
  const trechos: Trecho[] = [];
  let t = comecaEm;

  for (const r of rascunhos) {
    const n = r.texto.length;
    const dDigita = n / CPS_DIGITA;
    trechos.push({ ini: t, fim: t + dDigita, texto: r.texto, ativo: true });
    t += dDigita;

    trechos.push({ ini: t, fim: t + r.hesita, texto: r.texto, ativo: false });
    t += r.hesita;

    if (r.apaga !== false) {
      const dApaga = n / CPS_APAGA;
      trechos.push({ ini: t, fim: t + dApaga, texto: r.texto, ativo: true });
      t += dApaga;
      const pausa = r.pausa ?? 0.25;
      trechos.push({ ini: t, fim: t + pausa, texto: "", ativo: false });
      t += pausa;
    }
  }
  return { trechos, total: t };
};

/**
 * O que esta escrito no campo no segundo `seg`.
 *
 * Um trecho `ativo` com texto igual ao anterior e apagamento; com texto novo,
 * digitacao. O sinal sai da ordem, nao de um campo a mais.
 */
export const textoEm = (
  trechos: Trecho[],
  seg: number,
): { texto: string; digitando: boolean } => {
  for (let i = 0; i < trechos.length; i++) {
    const tr = trechos[i];
    if (seg < tr.ini || seg >= tr.fim) continue;
    if (!tr.ativo) return { texto: tr.texto, digitando: false };

    const p = (seg - tr.ini) / Math.max(tr.fim - tr.ini, 1e-6);
    const anterior = trechos[i - 1];
    const apagando = anterior !== undefined && anterior.texto === tr.texto && !anterior.ativo;
    const n = apagando
      ? Math.round(tr.texto.length * (1 - p))
      : Math.round(tr.texto.length * p);
    return { texto: tr.texto.slice(0, n), digitando: true };
  }
  // **Antes do primeiro trecho o campo esta vazio.** Esta funcao ja devolveu o
  // texto do ultimo trecho para qualquer tempo fora da lista, e o efeito era
  // silencioso e grave: no frame zero da cena a frase final ja aparecia
  // escrita, ou seja a cena abria entregando o fim dela. Depois do ultimo
  // trecho o texto persiste de proposito, porque o rascunho fica parado no
  // campo sem ser enviado, que e o ponto da cena.
  const primeiro = trechos[0];
  if (primeiro && seg < primeiro.ini) return { texto: "", digitando: false };
  const ultimo = trechos[trechos.length - 1];
  return { texto: ultimo ? ultimo.texto : "", digitando: false };
};

/** Um toque de tecla: quando, e se foi digitando ou apagando. */
export type Toque = { seg: number; apagando: boolean };

/**
 * Os tempos de cada tecla, para o som ficar colado na imagem.
 *
 * `cada` existe porque a densidade visual e a sonora nao sao a mesma coisa.
 * Digitando a 19 caracteres por segundo, um som por caractere vira zumbido
 * continuo em vez de digitacao; apagando a 38, pior ainda. Tocar a cada 2 ou 3
 * caracteres soa como alguem digitando rapido, que e o que a cena quer dizer.
 *
 * Os tempos saem da **mesma linha do tempo que desenha o texto**, entao imagem
 * e som nao podem divergir: nao existe uma segunda tabela para manter em dia.
 */
export const toques = (
  trechos: Trecho[],
  cadaDigita = 2,
  cadaApaga = 3,
): Toque[] => {
  const fora: Toque[] = [];
  for (let i = 0; i < trechos.length; i++) {
    const tr = trechos[i];
    if (!tr.ativo || !tr.texto) continue;
    const anterior = trechos[i - 1];
    const apagando =
      anterior !== undefined && anterior.texto === tr.texto && !anterior.ativo;
    const passo = apagando ? cadaApaga : cadaDigita;
    const n = tr.texto.length;
    const dur = tr.fim - tr.ini;
    for (let c = 0; c < n; c += passo) {
      fora.push({ seg: tr.ini + (dur * c) / n, apagando });
    }
  }
  return fora;
};
