
FROM caddy:2.9-alpine AS base

COPY packages/maintenance/docker_cmd.sh /bin/docker_cmd.sh
COPY packages/maintenance/maintenance.html /srv/maintenance.html

FROM base AS frontend

COPY packages/maintenance/Caddyfile.general packages/maintenance/Caddyfile.site packages/maintenance/Caddyfile.snippets /etc/caddy/
COPY packages/maintenance/Caddyfile.frontend /etc/caddy/Caddyfile

CMD ["/bin/docker_cmd.sh"]

FROM base AS widget

COPY packages/maintenance/Caddyfile.general packages/maintenance/Caddyfile.site packages/maintenance/Caddyfile.snippets /etc/caddy/
COPY packages/maintenance/Caddyfile.widget /etc/caddy/Caddyfile


CMD ["/bin/docker_cmd.sh"]
