#!/usr/bin/env sh


set -o errexit
set -o pipefail
set -o nounset

# Show JSON configuration
caddy adapt --config /etc/caddy/Caddyfile

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
