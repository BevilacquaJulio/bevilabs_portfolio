#!/usr/bin/env bash
set -e

: "${MYSQL_HOST:?Defina MYSQL_HOST no .env}"
: "${MYSQL_PORT:?Defina MYSQL_PORT no .env}"

echo "Aguardando banco de dados em ${MYSQL_HOST}:${MYSQL_PORT}..."
python - <<'PY'
import os
import socket
import sys
import time

host = os.environ["MYSQL_HOST"]
port = int(os.environ["MYSQL_PORT"])

for _ in range(60):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("Banco de dados disponível.")
            break
    except OSError:
        time.sleep(2)
else:
    sys.exit("Banco de dados não respondeu a tempo.")
PY

echo "Iniciando aplicação..."
echo "Atenção: o schema deve já existir (execute backend/sql/*.sql manualmente antes do primeiro deploy)."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
