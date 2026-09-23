# Moodboard do case EITA no WhatsApp

Canvas publicado: **https://claude.ai/artifact/2JSCEqCC9c6Nh8FohsrpBe**
(privado; para alguém de fora ver, compartilhar pelo menu Share da própria página).

Sete artboards: capa, cor e superfície, lettering, fotografia, gráficos e UI,
locução e a linha do tempo das nove cenas. Tudo na revisão 3 da identidade.

## O que está versionado aqui

| Pasta | O que é |
|---|---|
| `artboards/` | a fonte dos sete artboards (`.dc.html`) mais o `canvas.json`. Para editar o moodboard, mexer aqui e republicar no **mesmo** artefato |
| `foto-*.jpg` | os frames de referência de fotografia, tirados dos clipes do Veo |
| `cena01-whatsapp.png` | frame do render real da cena 01 (ignorado pelo git, refazer com o Remotion) |
| `voz-*.mp4` | as amostras de locução como vídeo de onda (ignorados pelo git, refazer com `scripts/onda_voz.py`) |

Os clipes de b-roll ficam em `../broll/` e também não entram no git.

## Como refazer cada peça

**Fotografia** (precisa de crédito na conta do Gemini):
```
python3 scripts/gera_video_veo.py --lote lote.json --pasta projects/03-case-eita-whatsapp/broll \
  --modelo veo-3.1-generate-preview --resolucao 1080p
```

**Amostra de voz**, de um mp3 qualquer para um mp4 que qualquer lugar aceita:
```
python3 scripts/onda_voz.py entrada.mp3 saida.mp4
```

**Ritmo do roteiro**, que é o que garante que a narração cabe:
```
python3 scripts/mede_ritmo.py
```

## Duas coisas que o moodboard decide e que valem fora deste filme

1. **A voz da Profissio.** O `CLAUDE.md` tinha a voz como PENDENTE. O artboard de
   locução traz cinco candidatas dizendo o mesmo trecho. A escolha vale para o
   estúdio inteiro, não só para este case.
2. **A grafia fonética da marca na locução.** Escrever `Profissio.ai` faz o
   sintetizador ler "ponto a i". O roteiro de locução escreve **Profício ei ái**,
   e as cinco amostras foram conferidas por transcrição automática.
