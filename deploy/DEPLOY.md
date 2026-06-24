# Deploy do Catedral ERP em VPS (Ubuntu)

Guia para colocar o sistema no ar em uma VPS Linux (Hostinger, Contabo, etc.).
O FastAPI serve a API **e** o frontend buildado; o Nginx faz proxy reverso + HTTPS.

> Substitua `SEU_DOMINIO.com` pelo seu dominio em todos os passos.
> Os comandos assumem Ubuntu 22.04/24.04. Rode como um usuario com `sudo`.

---

## 1. Pacotes base

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip git nginx postgresql postgresql-contrib
# Node.js 20 (para buildar o frontend)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2. Banco de dados PostgreSQL

```bash
sudo -u postgres psql <<'SQL'
CREATE USER catedral WITH PASSWORD 'TROQUE_ESTA_SENHA';
CREATE DATABASE catedral_erp OWNER catedral;
GRANT ALL PRIVILEGES ON DATABASE catedral_erp TO catedral;
SQL
```

## 3. Usuario de servico e codigo

```bash
sudo useradd --system --create-home --shell /bin/bash catedral
sudo mkdir -p /opt/catedral-erp
sudo chown catedral:catedral /opt/catedral-erp

# Clonar o repositorio
sudo -u catedral git clone https://github.com/gustavowilliam717-ui/catedral-erpp.git /opt/catedral-erp
```

## 4. Ambiente Python + dependencias

```bash
sudo -u catedral python3 -m venv /opt/catedral-erp/venv
sudo -u catedral /opt/catedral-erp/venv/bin/pip install --upgrade pip
sudo -u catedral /opt/catedral-erp/venv/bin/pip install -r /opt/catedral-erp/backend/requirements.txt
```

## 5. Variaveis de ambiente

```bash
sudo -u catedral cp /opt/catedral-erp/deploy/.env.production.example /opt/catedral-erp/backend/.env
sudo -u catedral nano /opt/catedral-erp/backend/.env
```

Preencha:
- `DATABASE_URL` com a senha definida no passo 2;
- `ALLOWED_ORIGINS` com `https://SEU_DOMINIO.com`;
- `SMTP_*` e `TWILIO_*` (obrigatorios para cadastro/login funcionarem);
- `OPENAI_API_KEY` se for usar o chat.

> O backend cria as tabelas e aplica as migracoes de coluna automaticamente
> no primeiro start — nao precisa rodar migracao manual.

## 6. Build do frontend

```bash
cd /opt/catedral-erp/frontend
sudo -u catedral npm ci
sudo -u catedral npm run build
```

## 7. Servico systemd

```bash
sudo cp /opt/catedral-erp/deploy/catedral-erp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now catedral-erp
sudo systemctl status catedral-erp        # deve aparecer "active (running)"
curl -s http://127.0.0.1:8000/health/database   # deve responder status ok
```

## 8. Nginx

```bash
sudo cp /opt/catedral-erp/deploy/nginx-catedral.conf /etc/nginx/sites-available/catedral
sudo sed -i 's/SEU_DOMINIO.com/seudominio.com/g' /etc/nginx/sites-available/catedral
sudo ln -s /etc/nginx/sites-available/catedral /etc/nginx/sites-enabled/catedral
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Aponte o DNS do dominio (registro A) para o IP da VPS antes do proximo passo.

## 9. HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

O certbot ajusta o Nginx para 443 e renova sozinho. Pronto: acesse
`https://seudominio.com`.

## 10. Firewall (opcional, recomendado)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Atualizacoes futuras

Com tudo configurado, cada nova versao vai pro ar com:

```bash
cd /opt/catedral-erp && bash deploy/deploy.sh
```

## Comandos uteis

```bash
sudo systemctl restart catedral-erp     # reiniciar
sudo journalctl -u catedral-erp -f      # ver logs em tempo real
sudo systemctl status catedral-erp      # status
```
