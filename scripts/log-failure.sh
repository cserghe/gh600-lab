#!/usr/bin/env bash
# Lab 6 hook script for the "postToolUseFailure" event (see .github/hooks/policy.json).
# Copilot sends the failed tool call as JSON on stdin; we append it as ONE line to
# logs/tool-failures.jsonl (JSON Lines: one JSON object per line) for later review.
set -euo pipefail

mkdir -p logs                                   # logs/ is git-ignored: runtime evidence, not source
# JSON strings cannot contain raw newlines, so deleting newline characters keeps the JSON valid
# and squeezes a pretty-printed payload onto a single line.
tr -d '\n\r' >> logs/tool-failures.jsonl
echo >> logs/tool-failures.jsonl                # terminate the line
# print nothing and exit 0: a logging hook must never change the agent's behaviour
