#!/usr/bin/env bash

set -euo pipefail

FAST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${FAST_DIR}"

PYTHON="${PYTHON:-python3}"
VENV_DIR="${FAST_DIR}/.venv"

if [ ! -d "${VENV_DIR}" ]; then
	echo "==> FastAPI: membuat virtual environment"
	${PYTHON} -m venv "${VENV_DIR}"
fi

# shellcheck disable=SC1091
source "${VENV_DIR}/bin/activate"

echo "==> FastAPI: install dependencies"
pip install --quiet -r requirements.txt

echo "==> FastAPI: syntax check"
python -m compileall -q main.py

if [ -f ".env" ] && grep -q "^BACKEND_URL=" .env; then
	echo "==> FastAPI: BACKEND_URL terkonfigurasi"
else
	echo "WARN: BACKEND_URL belum diset di fast/.env (diperlukan saat deploy terpisah)"
fi

if [ ! -f "best.pt" ]; then
	echo "WARN: best.pt tidak ditemukan di fast/ (diperlukan saat runtime, bukan untuk compile check)"
else
	echo "==> FastAPI: model best.pt ditemukan"
fi

echo "==> FastAPI checks passed"
