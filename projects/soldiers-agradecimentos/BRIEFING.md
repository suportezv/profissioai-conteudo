# Soldiers — Agradecimentos de influenciadores

Decupagem e colorização dos brutos de agradecimento gravados com influenciadores
parceiros da **Soldiers Nutrition**. Não é conteúdo da Profissio.ai: a marca, o
tom e o look aqui são da Soldiers. O que a Profissio.ai entrega neste material é
o serviço de edição, e o produto citado nas falas é o agente de IA do
**MODO Soldiers**.

## O material bruto

Origem: `OneDrive_2026-08-07.zip` no Drive (`1WsbDCMhLDiTuvf67jwIr1kcABnldfcNQ`),
pasta interna `CAMERA ENZO - AGRADECIMENTOS INFLUS`. **33 arquivos MP4 mais 33
XMLs de câmera, 11,48 GB, ~26 minutos de gravação.**

Especificação, lida do XML da própria câmera e confirmada no ffprobe:

| | |
|---|---|
| Câmera | Sony ILCE-7M3 (A7 III) |
| Vídeo | H.264 High, 3840x2160, 29.97p, ~59 Mbps, 8 bits |
| Gama | **S-Log2** (`CaptureGammaEquation`) |
| Primárias | **S-Gamut** (`CaptureColorPrimaries`) |
| Áudio | LPCM 16 bits, 48 kHz, estéreo |
| Orientação | **gravado na vertical, sem flag de rotação no arquivo** |

Dois pontos que definiram o trabalho: o material é **log**, então chega chapado e
dessaturado e precisa de conversão de cor, não de "filtro"; e o conteúdo está
**deitado no arquivo**, porque a câmera gravou em pé sem gravar a rotação. Sem
girar, todo mundo aparece de lado.

## O que cada clipe contém

Não são takes limpos. Cada arquivo traz a conversa de set inteira: a direção
explicando o roteiro, o "tô gravando, tá?", falsos começos, erros, risada, e
uma ou mais tentativas da mensagem. Alguns clipes passam de dois minutos e
quase nada ali é aproveitável; outros trazem a mesma pessoa tentando de novo
em arquivos separados.

O roteiro que todos tentam dizer é, com variações de cada um:

> Oi, eu sou [nome], obrigado por ter usado o meu cupom. A partir de agora eu
> vou te acompanhar por 90 dias com dica de treino, dieta e suplementação.
> E aí, você topa?

## Critério de corte

**Último take limpo.** Quando a pessoa erra e repete, vale a última tentativa
completa e sem tropeço — inclusive quando as tentativas estão espalhadas por
arquivos diferentes (a Pietra no C0003 e C0004, o Vitor Manato no C0006 ao
C0008, a influenciadora do C0013 ao C0018).

Uma regra veio da própria direção, gravada no C0010:

> "uma ideia é passar o vídeo **menos editado possível**, assim, sabe? Pra
> pessoa sentir que é uma coisa única pra ela."

Por isso o corte é **nas pontas, não no meio**. Tira-se a conversa de set antes
e depois, e juntam-se trechos quando a fala foi gravada em pedaços separados
(o final regravado do Renan, por exemplo), mas não se picota o interior de um
take bom para "apertar" respiro. O resultado tem que soar como uma mensagem
gravada de uma vez para uma pessoa só.

## Colorização

Conversão **S-Log2 / S-Gamut → Rec.709**, gerada em `scripts/gera_lut_slog2.py`
e não copiada de LUT pronta de terceiros. A cadeia:

1. curva log → cena linear (`colour-science`, `log_decoding_SLog2`)
2. primárias S-Gamut → Rec.709 (ambos D65)
3. **−0,5 stop** de exposição na cena linear
4. ombro suave nas altas a partir de 0,65
5. gama de exibição 1/2,4 (o cinza médio 0,18 cai em 0,487, quase no meio da escala)

O passo 3 e o 4 não são gosto, são correção: sem eles **43% do grafismo branco
da camiseta estourava**. Com eles, zero clipping e o branco fica praticamente
neutro (R=249 G=246 B=241 no alvo medido).

A LUT é aplicada em RGB de faixa cheia — o ffmpeg converte `yuvj420p → rgb24`
automaticamente, e o S-Log2 desta câmera de fato ocupa a escala inteira
(o preto medido bate com os ~90/1023 esperados). A saída volta para YUV de
faixa limitada, que é o padrão de entrega em H.264.

Efeito medido em um clipe de referência:

| | bruto | colorizado |
|---|---|---|
| Luma média | 94,8 | 143,0 |
| Faixa de luma (baixa→alta) | 48 → 125 | 67 → 200 |
| Saturação média | 9,4 | 25,4 |

Uma única LUT serve todos os clipes: o set, a luz e a câmera são os mesmos, e
ela se sustenta em tons de pele bem diferentes.

## Saída

- **1080x1920, H.264 High, 29.97p, yuv420p, faixa limitada, tags BT.709**
- áudio AAC 192 kbps, 48 kHz, estéreo, normalizado para −14 LUFS
- `+faststart`, para tocar sem baixar o arquivo inteiro

## Como reproduzir

```bash
# 1. listar/extrair do ZIP remoto sem baixar os 11 GB
python3 scripts/zip_index_remoto.py list <file_id>

# 2. gerar a LUT
python3 scripts/gera_lut_slog2.py lut.cube --exposicao -0.5 --joelho 0.65

# 3. decupar e colorizar a partir das âncoras de texto
python3 scripts/decupar.py projects/soldiers-agradecimentos/edl.json \
  --brutos brutos --stt stt --lut lut.cube --saida finais
```

A decupagem vive em `edl.json`. Cada trecho aproveitado é descrito por **âncoras
de texto** ("de tal frase até tal frase"), não por timecode na mão: o script casa
as âncoras contra a transcrição com timestamp por palavra (ElevenLabs Scribe) e
resolve os tempos. Reescrever um corte é editar uma frase, não recontar
segundos.
