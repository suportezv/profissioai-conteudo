#!/usr/bin/env bash
# Corte vertical (1080x1920) de um master 16:9, sem re-renderizar nada.
#
# Uso: scripts/vertical.sh <master-16x9.mp4> <saida-vertical.mp4>
#
# O master entra inteiro como cartao flutuante (984x554, raio 20) sobre a
# moldura da marca, que e um PNG parado renderizado uma vez pela composicao
# `MolduraVertical` do Remotion. O audio do master e copiado sem reencode, entao
# a loudness aprovada (-14 LUFS) chega intacta. A geometria do cartao mora em
# `remotion/src/MolduraVertical.tsx`; se mudar la, mudar os numeros aqui.
set -euo pipefail
ENT="$1"; SAI="$2"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
W=984; H=554; X=48; Y=$(( (1920 - H) / 2 )); RAIO=20

( cd "$RAIZ/remotion" && npx remotion still src/index.ts MolduraVertical "$TMP/moldura.png" --frame=0 --log=error >/dev/null )
python3 - "$TMP/mascara.png" $W $H $RAIO <<'PY'
import sys
from PIL import Image, ImageDraw
p, w, h, r = sys.argv[1], *map(int, sys.argv[2:])
k = 4  # desenha em 4x e reduz, para a curva do canto sair sem serrilhado
m = Image.new("L", (w * k, h * k), 0)
ImageDraw.Draw(m).rounded_rectangle([0, 0, w * k - 1, h * k - 1], radius=r * k, fill=255)
m.resize((w, h), Image.LANCZOS).save(p)
PY

ffmpeg -hide_banner -v error -y -i "$ENT" -loop 1 -i "$TMP/moldura.png" -loop 1 -i "$TMP/mascara.png" \
  -filter_complex "[0:v]scale=${W}:${H}:flags=lanczos,format=rgba[v];[2:v]format=gray[m];[v][m]alphamerge[vm];[1:v][vm]overlay=${X}:${Y}:shortest=1,fps=30,format=yuv420p[o]" \
  -map "[o]" -map 0:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -c:a copy -movflags +faststart "$SAI"
