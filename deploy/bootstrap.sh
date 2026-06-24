#!/usr/bin/env bash
# ==========================================================================
# Catedral ERP — instalacao automatica em VPS Ubuntu (rode como root)
#
# Uso:
#   sudo bash bootstrap.sh <DOMINIO> <EMAIL_PARA_HTTPS> [SENHA_DO_BANCO]
#
# Exemplo:
#   sudo bash bootstrap.sh catedralerp.com.br voce@email.com
#
# Se a SENHA_DO_BANCO nao for informada, uma aleatoria e gerada e exibida no fim.
# ==========================================================================
set -euo pipefail

DOMAIN="${1:?Informe o dominio. Ex: sudo bash bootstrap.sh catedralerp.com.br voce@email.com}"
EMAIL="${2:?Informe um email para o certificado HTTPS (Let's Encrypt)}"
DB_PASSWORD="${3:-$(openssl rand -hex 16)}"
REPO="https://github.com/gustavowilliam717-ui/catedral-erpp.git"
APP_DIR="/opt/catedral-erp"

if [ "$(id -u)" -ne 0 ]; then
  echo "Rode como root (use sudo)." >&2
  exit 1
fi

echo "==> [1/9] Atualizando sistema e instalando pacotes..."
export DEBIAN_FRONTEND=noninteractive
apt update && apt upgrade -y
apt install -y python3 python3-venv python3-pip git nginx postgresql postgresql-contrib curl openssl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "==> [2/9] Configurando PostgreSQL..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='catedral'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE USER catedral WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "ALTER USER catedral WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='catedral_erp'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE catedral_erp OWNER catedral;"

echo "==> [3/9] Usuario de servico e codigo-fonte..."
id catedral &>/dev/null || useradd --system --create-home --shell /bin/bash catedral
mkdir -p "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull --ff-only
else
  rm -rf "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
fi
chown -R catedral:catedral "$APP_DIR"

echo "==> [4/9] Ambiente Python e dependencias..."
sudo -u catedral -H python3 -m venv "$APP_DIR/venv"
sudo -u catedral -H "$APP_DIR/venv/bin/pip" install --upgrade pip
sudo -u catedral -H "$APP_DIR/venv/bin/pip" install -r "$APP_DIR/backend/requirements.txt"

echo "==> [5/9] Arquivo de variaveis (.env)..."
if [ ! -f "$APP_DIR/backend/.env" ]; then
  cp "$APP_DIR/deploy/.env.production.example" "$APP_DIR/backend/.env"
  sed -i "s#catedral:SENHA@localhost#catedral:${DB_PASSWORD}@localhost#" "$APP_DIR/backend/.env"
  sed -i "s#https://SEU_DOMINIO.com,https://www.SEU_DOMINIO.com#https://${DOMAIN},https://www.${DOMAIN}#" "$APP_DIR/backend/.env"
  chown catedral:catedral "$APP_DIR/backend/.env"
  chmod 600 "$APP_DIR/backend/.env"
fi

echo "==> [6/9] Build do frontend..."
cd "$APP_DIR/frontend"
sudo -u catedral -H npm ci
sudo -u catedral -H npm run build

echo "==> [7/9] Servico systemd..."
cp "$APP_DIR/deploy/catedral-erp.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable catedral-erp
systemctl restart catedral-erp

echo "==> [8/9] Nginx..."
cp "$APP_DIR/deploy/nginx-catedral.conf" /etc/nginx/sites-available/catedral
sed -i "s/SEU_DOMINIO.com/${DOMAIN}/g" /etc/nginx/sites-available/catedral
ln -sf /etc/nginx/sites-available/catedral /etc/nginx/sites-enabled/catedral
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> [9/9] HTTPS (Let's Encrypt) e firewall..."
apt install -y certbot python3-certbot-nginx
if certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect; then
  HTTPS_OK=1
else
  HTTPS_OK=0
  echo "AVISO: certbot falhou. Provavelmente o DNS de ${DOMAIN} ainda nao aponta para este servidor."
fi
ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true
yes | ufw enable || true

echo ""
echo "============================================================"
echo " Deploy concluido!"
if [ "$HTTPS_OK" = "1" ]; then
  echo " Acesse: https://${DOMAIN}"
else
  echo " Acesse (sem HTTPS por enquanto): http://${DOMAIN}"
  echo " Quando o DNS propagar, rode:"
  echo "   sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi
echo " Senha do banco: ${DB_PASSWORD}"
echo " (salva tambem em ${APP_DIR}/backend/.env)"
echo "------------------------------------------------------------"
echo " IMPORTANTE: para cadastro/login funcionarem, preencha o"
echo " envio de email (SMTP) e SMS (Zenvia/Twilio):"
echo "   sudo nano ${APP_DIR}/backend/.env"
echo "   sudo systemctl restart catedral-erp"
echo "============================================================"
