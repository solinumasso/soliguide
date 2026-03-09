
ARG BASE_IMAGE=soliguide/base:local

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS build

COPY ./packages/common/tsconfig.build.esm.json \
  ./packages/common/tsconfig.build.json \
  ./packages/common/tsconfig.json \
  /app/packages/common/
COPY ./packages/common/src /app/packages/common/src

RUN yarn workspace @soliguide/common build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/common/.eslintignore \
  ./packages/common/.eslintrc.json \
  ./packages/common/.prettierignore \
  ./packages/common/jest-setup.ts \
  ./packages/common/jest.config.ts \
  ./packages/common/tsconfig.spec.json \
  /app/packages/common/
