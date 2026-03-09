

ARG \
  BASE_IMAGE=soliguide/base:local-base \
  COMMON_IMAGE=soliguide/common:local-build \
  DESIGN_SYSTEM_IMAGE=soliguide/design-system:local-build

# skipcq: DOK-DL3006
FROM ${COMMON_IMAGE} AS common

# skipcq: DOK-DL3006
FROM ${DESIGN_SYSTEM_IMAGE} AS build

COPY --from=common /app/packages/common/dist /app/packages/common/dist

COPY \
  ./packages/web-app/tsconfig.json \
  ./packages/web-app/svelte.config.js \
  ./packages/web-app/vite.config.ts \
  ./packages/web-app/.gitignore \
  /app/packages/web-app/
COPY ./packages/web-app/static /app/packages/web-app/static
COPY ./packages/web-app/src /app/packages/web-app/src

RUN yarn workspace @soliguide/web-app build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/web-app/.prettierignore \
  ./packages/web-app/.prettierrc \
  ./packages/web-app/eslint.config.js \
  ./packages/web-app/playwright.config.ts \
  ./packages/web-app/vitest.config.ts \
  /app/packages/web-app/
COPY ./packages/web-app/web-tests /app/packages/web-app/web-tests

# Install prerequisites of integration tests
RUN yarn workspace @soliguide/web-app playwright install --with-deps

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS deploy

COPY --from=build /app/packages/common/dist /app/packages/common/dist
COPY --from=build /app/packages/design-system/dist /app/packages/design-system/dist
COPY --from=build /app/packages/web-app/.svelte-kit /app/packages/web-app/.svelte-kit
COPY --from=build /app/packages/web-app/build /app/packages/web-app/build

RUN <<EOF
set -e
yarn workspaces focus @soliguide/web-app --production
yarn cache clean
EOF

WORKDIR /app/packages/web-app/
USER node

CMD ["node", "build"]
