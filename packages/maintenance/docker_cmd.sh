#!/usr/bin/env sh

set -o errexit
set -o pipefail
set -o nounset

# Clever Cloud default variable
CC_REVERSE_PROXY_IPS="${CC_REVERSE_PROXY_IPS:-}"
# Take $TRUSTED_PROXIES or CC_REVERSE_PROXY_IPS if not set
TRUSTED_PROXIES="${TRUSTED_PROXIES:-$CC_REVERSE_PROXY_IPS}"

export TRUSTED_PROXIES=${TRUSTED_PROXIES//,/ }

# Show JSON configuration
caddy adapt --config /etc/caddy/Caddyfile

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
