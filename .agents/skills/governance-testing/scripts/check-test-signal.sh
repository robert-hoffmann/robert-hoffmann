#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$repo_root"

python3 .agents/skills/governance-testing/scripts/check_test_signal.py "$@"
