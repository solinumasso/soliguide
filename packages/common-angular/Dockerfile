
ARG COMMON_IMAGE=soliguide/common:local-build

# skipcq: DOK-DL3006
FROM ${COMMON_IMAGE} AS build

COPY ./packages/common-angular/angular.json \
  ./packages/common-angular/ng-package.json \
  ./packages/common-angular/tsconfig.json \
  ./packages/common-angular/tsconfig.lib.json \
  ./packages/common-angular/tsconfig.lib.prod.json \
  /app/packages/common-angular/
COPY ./packages/common-angular/src /app/packages/common-angular/src

RUN --mount=type=cache,target=/app/packages/common-angular/.angular/cache \
  yarn workspace @soliguide/common-angular build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/common-angular/.editorconfig \
  ./packages/common-angular/.eslintrc.js \
  ./packages/common-angular/.prettierignore \
  ./packages/common-angular/jest.config.ts \
  ./packages/common-angular/setup-jest.ts \
  ./packages/common-angular/tsconfig.spec.json \
  /app/packages/common-angular/
