# ---- Estagio 1: build do frontend (Node oficial) ----
FROM node:22-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Estagio 2: backend Python servindo o frontend buildado ----
FROM python:3.11-slim
WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY --from=frontend /app/frontend/dist ./frontend/dist

ENV PYTHONUNBUFFERED=1
# main.py resolve FRONTEND_DIST como <raiz>/frontend/dist (parents[2]).
# Mantendo backend/ e frontend/dist sob /app, o caminho bate.
CMD ["sh", "-c", "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
