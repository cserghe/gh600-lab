#!/usr/bin/env bash
set -euo pipefail                 # stop on any error, unset variable or failed pipe
status=0
for f in "$@"; do                 # every report passed as an argument
  if ! grep -q "^Status: complete$" "$f"; then   # required closing line missing?
    echo "::error file=$f::Report is partial or malformed"   # red annotation in the Actions UI
    status=1
  fi
done
exit $status                      # non-zero exit fails the job: downstream never sees a partial artefact
