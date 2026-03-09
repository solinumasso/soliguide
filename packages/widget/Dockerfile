
ARG COMMON_ANGULAR_IMAGE=soliguide/common-angular:local-build

# skipcq: DOK-DL3006
FROM ${COMMON_ANGULAR_IMAGE} AS build

COPY \
  ./packages/widget/angular.json \
  ./packages/widget/tsconfig.app.json \
  ./packages/widget/tsconfig.json \
  /app/packages/widget/
COPY ./packages/widget/src /app/packages/widget/src

RUN yarn workspace @soliguide/widget build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/widget/.editorconfig \
  ./packages/widget/.eslintrc.js \
  ./packages/widget/.prettierignore \
  ./packages/widget/jest-global-mocks.ts \
  ./packages/widget/jest.config.ts \
  ./packages/widget/setup-jest.ts \
  ./packages/widget/tsconfig.spec.json \
  /app/packages/widget/

FROM caddy:2.9-alpine AS deploy

COPY --chmod=0544 packages/widget/docker_cmd.sh /bin/docker_cmd.sh
COPY packages/widget/Caddyfile /etc/caddy/

COPY --from=build /app/packages/widget/dist/widget/ /srv/

CMD ["/bin/docker_cmd.sh"]
