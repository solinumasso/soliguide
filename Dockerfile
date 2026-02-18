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

FROM node:22-slim AS base

WORKDIR /app

# Onboard minimum files for installing dependencies
COPY \
  .yarnrc.yml \
  yarn.lock \
  package.json \
  lerna.json \
  nx.json \
  /app/

COPY .yarn/releases/ /app/.yarn/releases/

COPY packages/api/package.json /app/packages/api/
COPY packages/common/package.json /app/packages/common/
COPY packages/common-angular/package.json /app/packages/common-angular/
COPY packages/design-system/package.json /app/packages/design-system/
COPY packages/frontend/package.json /app/packages/frontend/
COPY packages/icons-generator/package.json /app/packages/icons-generator/
COPY packages/location-api/package.json /app/packages/location-api/
COPY packages/maintenance/package.json /app/packages/maintenance/
COPY packages/soligare/package.json /app/packages/soligare/
COPY packages/taxonomy/package.json /app/packages/taxonomy/
COPY packages/web-app/package.json /app/packages/web-app/
COPY packages/widget/package.json /app/packages/widget/

RUN corepack enable

FROM base AS deps

RUN <<EOF
set -e
corepack enable
yarn install --immutable
yarn cache clean
EOF
