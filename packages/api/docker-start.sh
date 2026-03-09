#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

RUN_MIGRATIONS=${RUN_MIGRATIONS:-no}

if [ "$RUN_MIGRATIONS" = "yes" ]; then
  echo "Running migrations and stopping..."
  cd dist
  node ../node_modules/migrate-mongo/bin/migrate-mongo up -f migrate-mongo-config.js
else
  echo "Running the backend wihtout migrations..."
  node --trace-warnings dist/src/app.js
fi
