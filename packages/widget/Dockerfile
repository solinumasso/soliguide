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

FROM caddy:2.10-alpine AS deploy

COPY --chmod=0544 packages/widget/docker_cmd.sh /bin/docker_cmd.sh
COPY packages/widget/Caddyfile /etc/caddy/

COPY --from=build /app/packages/widget/dist/widget/ /srv/

CMD ["/bin/docker_cmd.sh"]
