ARG \
  BASE_IMAGE=soliguide/base:local-base \
  COMMON_IMAGE=soliguide/common:local-build

# skipcq: DOK-DL3006
FROM ${COMMON_IMAGE} AS api

COPY ./packages/api/anonymization /app/packages/api/anonymization
COPY ./packages/api/tsconfig.build.json \
  ./packages/api/tsconfig.json \
  ./packages/api/migrate-mongo-config.ts \
  /app/packages/api/
COPY ./packages/api/resources /app/packages/api/resources
COPY ./packages/api/src /app/packages/api/src

RUN yarn workspace @soliguide/api build

FROM api AS build

COPY ./packages/public-api/nest-cli.json \
  ./packages/public-api/tsconfig.build.json \
  ./packages/public-api/tsconfig.json \
  /app/packages/public-api/
COPY ./packages/public-api/src /app/packages/public-api/src

RUN yarn workspace @soliguide/public-api build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/public-api/.prettierignore \
  ./packages/public-api/eslint.config.js \
  ./packages/public-api/vitest.config.ts \
  ./packages/public-api/vitest.e2e.config.ts \
  /app/packages/public-api/

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS deploy

COPY --from=build /app/packages/common/dist /app/packages/common/dist
COPY --from=build /app/packages/api/dist /app/packages/api/dist
COPY --from=build /app/packages/public-api/dist /app/packages/public-api/dist
# OpenAPI specifications are loaded from the version source directories at runtime.
COPY --from=build /app/packages/public-api/src/versions /app/packages/public-api/src/versions

RUN <<EOF
set -e
yarn workspaces focus @soliguide/public-api --production
yarn cache clean
EOF

WORKDIR /app/packages/public-api
USER node

CMD ["node", "dist/src/main"]
