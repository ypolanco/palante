#!/bin/bash
# PreToolUse hook (Bash matcher). Rewrites ONLY known low-signal, noisy
# commands (npm install/ci, next dev boot, docker pull, supabase start) to
# pipe their output through a head+tail collapse. Every other command,
# including anything touching psql/curl/tests, is left untouched.
set -euo pipefail

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"

# Hard exclusion: never rewrite anything that looks like it touches
# psql, curl, or a test runner, even if it also matches a noisy prefix
# below (e.g. `npm install && npm test`).
if printf '%s' "$cmd" | grep -qE '\b(psql|curl)\b|\bnpm (run )?test\b|\bplaywright\b|\bvitest\b|\bjest\b|\btsc\b'; then
  exit 0
fi

# Only rewrite these specific low-signal command prefixes.
if ! printf '%s' "$cmd" | grep -qE '^[[:space:]]*(npm (install|ci)\b|npx?[[:space:]]+next dev\b|npm run dev\b|npm run db:start\b|docker (pull|compose pull|image pull)\b|supabase start\b)'; then
  exit 0
fi

filter='awk -v head=20 -v tail=40 '\''
{ lines[NR] = $0 }
END {
  n = NR
  if (n <= head + tail + 1) { for (i = 1; i <= n; i++) print lines[i]; exit }
  for (i = 1; i <= head; i++) print lines[i]
  printf("... [noisy-output hook: %d lines omitted (npm install/ci, next dev, docker pull, supabase start only) ...]\n", n - head - tail)
  for (i = n - tail + 1; i <= n; i++) print lines[i]
}
'\'''

new_cmd="{ $cmd ; } 2>&1 | $filter"

jq -n --arg cmd "$new_cmd" \
  '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "allow", updatedInput: {command: $cmd}}}'
