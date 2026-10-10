#!/usr/bin/env bash
set -euo pipefail

deny() {                                        # helper: print a deny decision as JSON, then exit 0
  jq -n --arg r "$1" '{permissionDecision:"deny", permissionDecisionReason:$r}'
  exit 0                                        # exit 0: the decision travels in the JSON on stdout
}

INPUT="$(cat)"                                  # Copilot sends the tool call as JSON on stdin
TOOL="$(echo "$INPUT" | jq -r '.toolName')"     # e.g. "bash", "edit", "create", "view"
ARGS="$(echo "$INPUT" | jq -r '.toolArgs')"     # toolArgs is itself a JSON STRING...
CMD="$(echo "$ARGS" | jq -r '.command // empty')"   # ...so parse it again to get the shell command

if [ "$TOOL" = "bash" ]; then
  case "$CMD" in
    *"git push"*)  deny "Direct push is blocked. Open a pull request instead." ;;
    *"rm -rf"*)    deny "Recursive delete is blocked." ;;
    *"curl "*|*"wget "*) deny "Network downloads from the agent are blocked." ;;   # limits exfiltration
  esac
fi
# printing nothing and exiting 0 = allow
