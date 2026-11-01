#!/usr/bin/env bash
# Builds the client review copy (noindex) and publishes it to the gh-pages
# branch, which GitHub Pages serves at https://jonnybravo247.github.io/.
# Usage (from Website/): bash scripts/deploy-review.sh
set -euo pipefail
cd "$(dirname "$0")/.."
NEXT_PUBLIC_REVIEW=1 NEXT_PUBLIC_SITE_URL=https://jonnybravo247.github.io npm run build
touch out/.nojekyll   # Pages must not run Jekyll, or the _next/ folder is dropped
REMOTE=$(git remote get-url origin)
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Review build $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTE" gh-pages
rm -rf .git
echo "Published. Live in a minute or two at https://jonnybravo247.github.io/"
