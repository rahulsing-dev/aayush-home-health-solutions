#!/usr/bin/env sh
# Browser QA: functional tests, accessibility audit (axe-core) and responsive screenshots.
# Requires: Python 3 + `pip install playwright && playwright install chromium`, and `npm i` (axe-core is a devDependency).
# Usage (from the project root):  sh qa/run.sh
set -e
echo "Building demo-mode site -> dist/ and endpoint-configured site -> dist-ep/ ..."
npm run build >/dev/null
PUBLIC_FORM_ENDPOINT=https://forms.test/submit PUBLIC_FORM_ACCESS_KEY=pubkey123 npx astro build --outDir dist-ep >/dev/null
node qa/serve.mjs dist 4321 & S1=$!
node qa/serve.mjs dist-ep 4322 & S2=$!
trap 'kill $S1 $S2 2>/dev/null' EXIT
sleep 1.5
echo "== Functional tests ==";   python3 qa/functional.py
echo "== Accessibility (axe) =="; python3 qa/axe.py
echo "== Responsive screenshots + overflow check =="; python3 qa/screenshots.py
echo "Screenshots saved in qa/screenshots/"
