#!/bin/sh
set -eu
cd "$(dirname "$0")/design-system"
BUNDLED="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies"
if [ -x "$BUNDLED/node/bin/node" ] && [ -x "$BUNDLED/bin/fallback/pnpm" ]; then
 export PATH="$BUNDLED/node/bin:$PATH"
 exec "$BUNDLED/bin/fallback/pnpm" dev
fi
if command -v pnpm >/dev/null 2>&1; then exec pnpm dev; fi
printf '%s\n' 'Install Node.js and pnpm, then run pnpm install and pnpm dev inside design-system/.'
exit 1
