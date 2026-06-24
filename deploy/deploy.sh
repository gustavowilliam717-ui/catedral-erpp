#!/usr/bin/env bash
# Atualiza e reinicia o Catedral ERP na VPS.
# Uso: bash deploy/deploy.sh   (a partir de /opt/catedral-erp)
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/catedral-erp}"
cd "$APP_DIR"

echo ">> Atualizando codigo..."
git pull --ff-only

echo ">> Instalando dependencias do backend..."
"$APP_DIR/venv/bin/pip" install -r backend/requirements.txt

echo ">> Buildando frontend..."
cd "$APP_DIR/frontend"
npm ci
npm run build

echo ">> Reiniciando servico..."
sudo systemctl restart catedral-erp

echo ">> Deploy concluido. Status:"
sudo systemctl --no-pager status catedral-erp | head -n 10
