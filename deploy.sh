#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

resolve_workspace() {
	local name="$1"
	local path="${ROOT_DIR}/${name}"

	if [ -d "${path}" ] && [ -f "${path}/package.json" ]; then
		echo "${path}"
		return 0
	fi

	if [ "${name}" = "express" ] && [ -f "${ROOT_DIR}/package.json" ]; then
		echo "${ROOT_DIR}"
		return 0
	fi

	echo ""
}

run_express_workspace() {
	local workspace_path

	workspace_path="$(resolve_workspace "express")"

	if [ -z "${workspace_path}" ]; then
		echo "==> Skip express (workspace tidak ditemukan)"
		return 0
	fi

	echo "==> Running Express checks in ${workspace_path}"
	pushd "${workspace_path}" >/dev/null

	if [ -f ".env" ]; then
		set -a
		# shellcheck disable=SC1091
		source ".env"
		set +a
	fi

	if [ -z "${INTERNAL_API_SECRET:-}" ]; then
		echo "ERROR: INTERNAL_API_SECRET belum diset. Tambahkan ke express/.env"
		exit 1
	fi

	if [ -z "${ML_SERVICE_URL:-}" ]; then
		export ML_SERVICE_URL="http://localhost:8000"
		echo "INFO: ML_SERVICE_URL default ke http://localhost:8000"
	fi

	if [ ! -f "node_modules/.bin/prettier" ]; then
		echo "==> Installing Express dependencies..."
		npm install
	fi

	npm run format
	npm run lint
	npm run build
	npm run test

	popd >/dev/null
}

run_fast_workspace() {
	local fast_path="${ROOT_DIR}/fast"

	if [ ! -f "${fast_path}/main.py" ]; then
		echo "==> Skip fast (main.py tidak ditemukan)"
		return 0
	fi

	echo "==> Running FastAPI checks in ${fast_path}"
	pushd "${fast_path}" >/dev/null

	if [ -f ".env" ]; then
		set -a
		# shellcheck disable=SC1091
		source ".env"
		set +a
	fi

	chmod +x check.sh
	./check.sh

	popd >/dev/null
}

run_express_workspace
run_fast_workspace

echo ""
echo "All checks passed for express and fast."
