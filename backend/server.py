"""Entrypoint de producao.

Le a porta de $PORT (injetada pelo Railway) em Python, evitando depender de
expansao de variavel pelo shell no comando de start do container.
"""
import os

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
