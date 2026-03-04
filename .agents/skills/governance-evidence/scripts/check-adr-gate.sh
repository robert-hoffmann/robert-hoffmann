#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$repo_root"

python3 .agents/skills/governance-evidence/scripts/check_adr_gate.py "$@"
