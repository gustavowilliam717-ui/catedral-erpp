# NEXTERP - Backend

## Rodar com SQLite

```powershell
cd backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API:

```text
http://127.0.0.1:8000
```

Teste do banco:

```text
http://127.0.0.1:8000/health/database
```

## Rodar com PostgreSQL

1. Crie um banco no PostgreSQL, por exemplo:

```sql
CREATE DATABASE catedral_erp;
```

2. Copie o exemplo de ambiente:

```powershell
Copy-Item .env.example .env
```

3. Edite `backend/.env` e coloque a URL do seu banco:

```env
DATABASE_URL=postgresql+psycopg://postgres:SUA_SENHA@localhost:5432/catedral_erp
```

4. Instale as dependencias:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

5. Rode o backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

6. Confira se mudou para PostgreSQL:

```text
http://127.0.0.1:8000/health/database
```

Resposta esperada:

```json
{"status":"ok","database":"postgresql","driver":"psycopg"}
```

## Migrar os dados atuais do SQLite para PostgreSQL

Depois que o PostgreSQL estiver criado e o `.env` estiver com `DATABASE_URL`, rode:

```powershell
cd backend
.\.venv\Scripts\python.exe scripts\migrate_sqlite_to_postgres.py
```

Ou informe a URL direto no comando:

```powershell
.\.venv\Scripts\python.exe scripts\migrate_sqlite_to_postgres.py --target "postgresql+psycopg://postgres:SUA_SENHA@localhost:5432/catedral_erp"
```

O script copia produtos, usuarios, sessoes, historico de precificacao, receitas, despesas, integracoes e configuracoes.

## Se o comando psql nao aparecer

Feche e abra o PowerShell. Se continuar sem aparecer, adicione o bin do PostgreSQL ao PATH. Exemplo:

```powershell
$env:Path = "C:\Program Files\PostgreSQL\17\bin;$env:Path"
psql --version
```

Troque `17` pela versao instalada no seu computador.
