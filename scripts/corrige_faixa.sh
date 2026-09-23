#!/usr/bin/env bash
# Converte um render do Remotion para faixa de TV, que e o que todo player espera.
#
# Generico: nao tem nada de marca. Serve para qualquer render.
#
# O Remotion entrega `yuvj420p`, que e faixa cheia (0-255). Player e editor
# assumem faixa de TV (16-235), entao o mesmo arquivo aparece com preto
# esmagado e branco estourado em um lugar e certo em outro, e a diferenca so
# aparece quando alguem abre o arquivo em outro programa. Corrigir uma vez na
# saida evita a caca ao fantasma depois.
#
# Uso:  bash corrige_faixa.sh entrada.mp4 [saida.mp4]
#       bash corrige_faixa.sh pasta/            (todos os .mp4 da pasta)
set -euo pipefail

converte() {
  local ent="$1" sai="$2"
  ffmpeg -v error -y -i "$ent" \
    -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
    -c:v libx264 -preset slow -crf 17 \
    -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a aac -b:a 192k -movflags +faststart \
    "$sai"

  local fmt
  # este ffprobe devolve "yuv420p," com virgula sobrando; comparar cru falha
  fmt=$(ffprobe -v error -select_streams v -show_entries stream=pix_fmt -of csv=p=0 "$sai" | tr -d ',[:space:]')
  if [ "$fmt" != "yuv420p" ]; then
    echo "  ERRO: $sai saiu como $fmt, esperado yuv420p" >&2
    return 1
  fi
  printf "  %-24s %s  %s KB\n" "$(basename "$sai")" "$fmt" \
    "$(( $(stat -c%s "$sai") / 1024 ))"
}

alvo="${1:?uso: corrige_faixa.sh <arquivo.mp4|pasta> [saida.mp4]}"

if [ -d "$alvo" ]; then
  destino="$alvo/tv"
  mkdir -p "$destino"
  for f in "$alvo"/*.mp4; do
    [ -e "$f" ] || continue
    case "$f" in */tv/*) continue;; esac
    converte "$f" "$destino/$(basename "$f")"
  done
  echo "prontos em $destino"
else
  converte "$alvo" "${2:-${alvo%.mp4}-tv.mp4}"
fi
