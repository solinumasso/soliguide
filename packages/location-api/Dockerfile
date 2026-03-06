ARG COMMON_IMAGE=soliguide/common:local-build
ARG BASE_IMAGE=soliguide/base:local-base

# skipcq: DOK-DL3006
FROM ${COMMON_IMAGE} AS build

COPY ./packages/location-api/nest-cli.json \
  ./packages/location-api/tsconfig.build.json \
  ./packages/location-api/tsconfig.json \
  /app/packages/location-api/
COPY ./packages/location-api/src /app/packages/location-api/src
COPY ./packages/location-api/resources /app/packages/location-api/resources

RUN yarn workspace @soliguide/location-api build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/location-api/.prettierignore \
  ./packages/location-api/.eslintignore \
  ./packages/location-api/.eslintrc.js \
  /app/packages/location-api/

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS deploy

RUN <<EOF
set -e
yarn workspaces focus @soliguide/location-api --production
yarn cache clean
EOF

COPY --from=build /app/packages/common/dist /app/packages/common/dist
COPY --from=build /app/packages/location-api/dist /app/packages/location-api/dist
COPY --from=build /app/packages/location-api/resources /app/packages/location-api/resources
COPY --from=build /app/packages/location-api/package.json /app/packages/location-api/package.json

WORKDIR /app/packages/location-api
USER node

CMD ["node", "dist/main"]
