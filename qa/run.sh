#!/usr/bin/env sh
# Browser QA: functional tests, accessibility audit (axe-core) and responsive screenshots.
# Requires: Python 3 + `pip install playwright && playwright install chromium`, and `npm i` (axe-core is a devDependency).
# Usage (from the project root):  sh qa/run.sh
set -e
echo "Building demo-mode site -> dist/ and endpoint-configured site -> dist-ep/ ..."
# The demo-mode build must ignore any form key in a local .env (variables already set win over .env files).
PUBLIC_WEB3FORMS_ACCESS_KEY= PUBLIC_FORM_ACCESS_KEY= PUBLIC_FORM_ENDPOINT= npm run build >/dev/null
PUBLIC_FORM_ENDPOINT=https://forms.test/submit PUBLIC_WEB3FORMS_ACCESS_KEY=pubkey123 npx astro build --outDir dist-ep >/dev/null
node qa/serve.mjs dist 4321 & S1=$!
node qa/serve.mjs dist-ep 4322 & S2=$!
trap 'kill $S1 $S2 2>/dev/null' EXIT
sleep 1.5
echo "== Functional tests ==";   "${PYTHON:-python3}" qa/functional.py
echo "== Accessibility (axe) =="; "${PYTHON:-python3}" qa/axe.py
echo "== Responsive screenshots + overflow check =="; "${PYTHON:-python3}" qa/screenshots.py
echo "Screenshots saved in qa/screenshots/"
