#!/usr/bin/env bash
# Opens Codex in this folder. It reads AGENTS.md, which holds the whole brief.
cd "$(dirname "$0")"
exec codex "$@"
