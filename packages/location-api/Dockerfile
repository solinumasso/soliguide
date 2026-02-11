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
