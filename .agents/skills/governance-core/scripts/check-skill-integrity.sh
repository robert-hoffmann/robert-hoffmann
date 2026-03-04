#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$repo_root"

violations=0

check_forbidden() {
  local dir="$1"
  shift
  local token
  for token in "$@"; do
    if grep -RIn "$token" "$dir" >/tmp/skill-independence-hits.txt; then
      echo "Forbidden cross-domain reference '$token' found in $dir"
      cat /tmp/skill-independence-hits.txt
      violations=1
    fi
  done
}

check_forbidden ".agents/skills/governance-repository" "governance-testing" "governance-evidence"
check_forbidden ".agents/skills/governance-testing" "governance-repository" "governance-evidence"
check_forbidden ".agents/skills/governance-evidence" "governance-repository" "governance-testing"

hits="$(grep -RInE '^(governance_exception:|tdd_exception:|adr_waiver_exception:)' .agents/skills/governance-* || true)"
if [ -z "$hits" ]; then
  echo "No exception-template schema definitions found."
  violations=1
else
  bad_hits="$(printf '%s\n' "$hits" | grep -v '^\.agents/skills/governance-core/' || true)"
  if [ -n "$bad_hits" ]; then
    echo "Exception template schema definitions must exist only in governance-core."
    printf '%s\n' "$bad_hits"
    violations=1
  fi
fi

for skill in \
  .agents/skills/governance-core \
  .agents/skills/governance-repository \
  .agents/skills/governance-testing \
  .agents/skills/governance-evidence; do
  while IFS= read -r line; do
    ref="$(printf '%s' "$line" | sed -n 's/.*`\([^`]*\)`.*/\1/p')"
    [ -z "$ref" ] && continue

    if [ -f "$skill/$ref" ]; then
      continue
    fi

    abs_ref="$(cd "$skill" && realpath "$ref" 2>/dev/null || true)"
    if [ -z "$abs_ref" ] || [ ! -f "$abs_ref" ]; then
      echo "Missing reference path in $skill/SKILL.md: $ref"
      violations=1
    fi
  done < <(awk '/- Read `/{print}' "$skill/SKILL.md")
done

if [ "$violations" -ne 0 ]; then
  exit 1
fi

echo "Governance skill integrity checks passed."
