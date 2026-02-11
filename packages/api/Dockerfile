# Soliguide: Useful information for those who need it
#
# SPDX-FileCopyrightText: © 2024 Solinum
#
# SPDX-License-Identifier: AGPL-3.0-only
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
ARG \
  BASE_IMAGE=soliguide/base:local-base \
  COMMON_IMAGE=soliguide/common:local-build

# skipcq: DOK-DL3006
FROM ${COMMON_IMAGE} AS build

COPY ./packages/api/anonymization /app/packages/api/anonymization
COPY ./packages/api/tsconfig.build.json ./packages/api/tsconfig.json ./packages/api/migrate-mongo-config.ts ./packages/api/db.sh /app/packages/api/
COPY ./packages/api/resources /app/packages/api/resources
COPY ./packages/api/migrations /app/packages/api/migrations
COPY ./packages/api/src /app/packages/api/src

RUN yarn workspace @soliguide/api build

# Image for format, lint and test
FROM build AS test

COPY ./data/soliguide_db_test.gzip /app/data/
COPY \
  ./packages/api/.eslintrc.js \
  ./packages/api/.prettierignore \
  ./packages/api/jest-setup.ts \
  ./packages/api/jest.config.ts \
  /app/packages/api/
COPY ./packages/api/mocks /app/packages/api/mocks
COPY ./packages/api/e2e /app/packages/api/e2e
COPY ./packages/api/.env.test /app/packages/api/.env

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS deploy

# install packages for pdf export (libreoffice and Lato fonts)
# immediately remove temporary files
# skipcq: DOK-DL3008
RUN <<EOF
set -e
apt-get update
apt-get install --no-install-recommends -y -o Acquire::Retries=10 libreoffice libreoffice-common libreoffice-java-common fonts-lato
apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
EOF

COPY ./packages/api/docker-start.sh /app/packages/api/docker-start.sh
COPY --from=build /app/packages/common/dist /app/packages/common/dist
COPY --from=build /app/packages/api/dist /app/packages/api/dist
COPY --from=build /app/packages/api/package.json /app/packages/api/package.json

RUN <<EOF
set -e
yarn workspaces focus @soliguide/api --production
yarn cache clean
# categories.xlsx and public events files are downloaded to this directory at runtime
mkdir -p ./packages/api/dist/resources/temp-info-data
chown -R node:node ./packages/api/dist/resources
EOF

WORKDIR /app/packages/api
USER node

ENTRYPOINT ["sh", "-c"]
CMD ["./docker-start.sh"]
