
ARG \
  BASE_IMAGE=soliguide/base:local-base \
  COMMON_IMAGE=soliguide/common:local-build

# skipcq: DOK-DL3006
FROM ${COMMON_IMAGE} AS build

COPY \
  ./packages/soligare/nest-cli.json \
  ./packages/soligare/tsconfig.build.json \
  ./packages/soligare/tsconfig.json \
  /app/packages/soligare/
COPY ./packages/soligare/src /app/packages/soligare/src

RUN yarn workspace @soliguide/soligare build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/soligare/.eslintrc.js \
  ./packages/soligare/.prettierignore \
  ./packages/soligare/.prettierrc \
  /app/packages/soligare/
COPY ./packages/soligare/test /app/packages/soligare/test

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS deploy

RUN <<EOF
set -e
yarn workspaces focus @soliguide/soligare --production
yarn cache clean
EOF

COPY --from=build /app/packages/common/dist /app/packages/common/dist
COPY --from=build /app/packages/soligare/dist /app/packages/soligare/dist

WORKDIR /app/packages/soligare
USER node

CMD ["node", "dist/main"]
