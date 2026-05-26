

ARG COMMON_ANGULAR_IMAGE=soliguide/common-angular:local-build

# skipcq: DOK-DL3006
FROM ${COMMON_ANGULAR_IMAGE} AS build

# For some reason we need jest.config.ts and mocks for typescript compilation
COPY ./packages/backoffice/angular.json \
  ./packages/backoffice/jest.config.ts \
  ./packages/backoffice/tsconfig.app.json \
  ./packages/backoffice/tsconfig.json \
  ./packages/backoffice/tsconfig.spec.json \
  /app/packages/backoffice/
COPY ./packages/backoffice/mocks /app/packages/backoffice/mocks
COPY ./packages/backoffice/src /app/packages/backoffice/src

RUN yarn workspace @soliguide/backoffice build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/backoffice/.editorconfig \
  ./packages/backoffice/.eslintrc.js \
  ./packages/backoffice/.prettierignore \
  ./packages/backoffice/jest-global-mocks.ts \
  ./packages/backoffice/setup-jest.ts \
  /app/packages/backoffice/

FROM caddy:2.9-alpine AS deploy

COPY --chmod=0544 packages/backoffice/docker_cmd.sh /bin/docker_cmd.sh
COPY packages/backoffice/caddy /etc/caddy

COPY --from=build /app/packages/backoffice/dist/backoffice/ /srv/
COPY --from=build /app/packages/backoffice/package.json /tmp/package.json

# Generate version.json from package.json
RUN echo "{\"version\":\"$(grep -oP '(?<="version": ")[^"]*' /tmp/package.json)\"}" > /srv/assets/version.json && \
  rm /tmp/package.json

CMD ["/bin/docker_cmd.sh"]
