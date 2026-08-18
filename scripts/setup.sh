#!/usr/bin/env bash
# Setup do Profissio.ai Conteúdo Studio (Linux/cloud). No Mac, siga SETUP.md manualmente.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="${TOOLS_DIR:-/workspace}"
VIDEO_USE="$TOOLS_DIR/browser-use/video-use"
HYPERFRAMES="$TOOLS_DIR/heygen-com/hyperframes"

# --- Rota de rede (cloud) ---------------------------------------------------
# pypi.org, files.pythonhosted.org e registry.npmjs.org vem em no_proxy, entao
# contornam o agent proxy e batem direto no firewall de egresso, que recusa com
# 403 mesmo estando na allowlist. Roteando pelo agent proxy eles respondem 200.
if [ -n "${HTTPS_PROXY:-}" ]; then
  export no_proxy="" NO_PROXY="" HTTP_PROXY="$HTTPS_PROXY"
  export SSL_CERT_FILE="${SSL_CERT_FILE:-/root/.ccr/ca-bundle.crt}"
  export REQUESTS_CA_BUNDLE="$SSL_CERT_FILE"
  export UV_DEFAULT_INDEX="https://pypi.org/simple"
  export npm_config_proxy="$HTTPS_PROXY" npm_config_https_proxy="$HTTPS_PROXY"
  export npm_config_noproxy="" npm_config_cafile="$SSL_CERT_FILE"
fi

echo "== 1/5 ffmpeg =="
# No cloud com network Custom o apt fica bloqueado (403 no archive.ubuntu.com), então
# o caminho confiável é o build estático do BtbN via GitHub Releases, que o proxy libera.
# O build "gpl" traz libass (subtitles) e zimg (zscale), ambos obrigatórios aqui.
if ! command -v ffmpeg >/dev/null; then
  if ! (apt-get update -qq && apt-get install -y -qq ffmpeg fonts-liberation) 2>/dev/null; then
    echo "apt indisponível; instalando build estático do GitHub Releases"
    TMP="$(mktemp -d)"
    curl -sL --max-time 300 -o "$TMP/ff.tar.xz" \
      https://github.com/BtbN/FFmpeg-Builds/releases/latest/download/ffmpeg-master-latest-linux64-gpl.tar.xz
    tar -xf "$TMP/ff.tar.xz" -C "$TMP"
    FFDIR="$(find "$TMP" -maxdepth 1 -type d -name 'ffmpeg-master-*' | head -1)"
    install -m755 "$FFDIR/bin/ffmpeg" "$FFDIR/bin/ffprobe" /usr/local/bin/
    rm -rf "$TMP"
  fi
fi
ffmpeg -version | head -1

echo "== 2/5 video-use =="
if [ ! -d "$VIDEO_USE/.git" ]; then
  GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/browser-use/video-use "$VIDEO_USE"
fi
if git -C "$VIDEO_USE" apply --check "$REPO_ROOT/patches/video-use-is-portrait-source.patch" 2>/dev/null; then
  git -C "$VIDEO_USE" apply "$REPO_ROOT/patches/video-use-is-portrait-source.patch"
  echo "patch is_portrait_source aplicado"
else
  echo "patch is_portrait_source: já aplicado ou não aplicável (verifique manualmente)"
fi
if ! (cd "$VIDEO_USE" && uv sync) && ! (cd "$VIDEO_USE" && pip install -e .); then
  echo "AVISO: deps do video-use não instaladas (pypi.org bloqueado?). Ver 'Rede do environment' no CLAUDE.md."
fi
mkdir -p ~/.claude/skills
ln -sfn "$VIDEO_USE" ~/.claude/skills/video-use

echo "== 3/5 hyperframes + media-use =="
if [ ! -d "$HYPERFRAMES/.git" ]; then
  GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/heygen-com/hyperframes "$HYPERFRAMES"
fi
npx --yes hyperframes skills update || \
  echo "AVISO: hyperframes skills update falhou (registry.npmjs.org bloqueado?)."

echo "== 4/5 Python (PIL para overlays, numpy para batidas) =="
python3 -c 'import PIL' 2>/dev/null || pip3 install pillow || echo "AVISO: pillow não instalado (pypi bloqueado). Lettering/overlays indisponíveis."
python3 -c 'import numpy' 2>/dev/null || pip3 install numpy || echo "AVISO: numpy não instalado (pypi bloqueado). Detecção de batidas indisponível."

echo "== 5/5 estúdio =="
ln -sfn "$REPO_ROOT" ~/profissioai-conteudo
echo "~/profissioai-conteudo -> $REPO_ROOT"

# Propaga a chave da ElevenLabs do environment para o .env do video-use.
if [ ! -f "$VIDEO_USE/.env" ] && [ -n "${ELEVENLABS_API_KEY:-}" ]; then
  printf 'ELEVENLABS_API_KEY=%s\n' "$ELEVENLABS_API_KEY" > "$VIDEO_USE/.env"
  chmod 600 "$VIDEO_USE/.env"
  echo "ELEVENLABS_API_KEY gravada em $VIDEO_USE/.env (a partir da env var)"
elif [ ! -f "$VIDEO_USE/.env" ]; then
  echo "PENDENTE: gravar ELEVENLABS_API_KEY em $VIDEO_USE/.env (peça ao usuário; chave sk_ de 51 chars)"
fi
echo "Setup concluído. Rode: bash $REPO_ROOT/scripts/validate.sh"
