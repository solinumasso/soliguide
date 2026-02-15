ARG BASE_IMAGE=soliguide/base:local

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS build

COPY \
  ./packages/design-system/tsconfig.json \
  ./packages/design-system/svelte.config.js \
  ./packages/design-system/vite.config.ts \
  /app/packages/design-system/
COPY ./packages/design-system/static /app/packages/design-system/static
COPY ./packages/design-system/src /app/packages/design-system/src

RUN yarn workspace @soliguide/design-system build

FROM build AS test

COPY ./packages/design-system/scripts /app/packages/design-system/scripts
COPY \
  ./packages/design-system/.gitignore \
  ./packages/design-system/.prettierignore \
  ./packages/design-system/.prettierrc \
  ./packages/design-system/eslint.config.js \
  ./packages/design-system/vitest.config.ts \
  /app/packages/design-system/

FROM caddy:2.11-alpine AS deploy

COPY --chmod=0544 packages/design-system/docker_cmd.sh /bin/docker_cmd.sh
COPY packages/design-system/Caddyfile /etc/caddy/

CMD ["/bin/docker_cmd.sh"]
