#!/usr/bin/env bash
# Migra este seed para o repositorio definitivo suportezv/profecia-conteudo.
# Rodar de dentro do clone do profissioai-conteudo, com o repo destino ja criado
# (vazio) no GitHub e acessivel com push.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ORIGEM="$(cd "$HERE/../.." && pwd)"   # clone do profissioai-conteudo
DEST="${1:-/workspace/profecia-conteudo}"
REPO_URL="${2:-https://github.com/suportezv/profecia-conteudo}"

git clone "$REPO_URL" "$DEST"
cp -r "$HERE"/. "$DEST"/
rm -f "$DEST/MIGRAR.sh"
mkdir -p "$DEST/assets/sfx"
cp "$ORIGEM"/assets/sfx/*.mp3 "$DEST/assets/sfx/"   # biblioteca de sons do grupo
cd "$DEST"
git add -A
git commit -m "Bootstrap do Profecia Conteudo Studio (replica do profissioai-conteudo)"
git push -u origin HEAD
echo "Migrado. Apague seeds/profecia-conteudo do repo de origem."
