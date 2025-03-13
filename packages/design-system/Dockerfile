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
ARG BASE_IMAGE=soliguide/base:local

# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS build

COPY ./packages/design-system/.storybook /app/packages/design-system/.storybook
COPY \
  ./packages/design-system/tsconfig.json \
  ./packages/design-system/svelte.config.js \
  ./packages/design-system/vite.config.ts \
  /app/packages/design-system/
COPY ./packages/design-system/static /app/packages/design-system/static
COPY ./packages/design-system/src /app/packages/design-system/src

RUN yarn workspace @soliguide/design-system build && \
  yarn workspace @soliguide/design-system storybook:build

FROM build AS test

COPY ./packages/design-system/scripts /app/packages/design-system/scripts
COPY \
  ./packages/design-system/.gitignore \
  ./packages/design-system/.prettierignore \
  ./packages/design-system/.prettierrc \
  ./packages/design-system/eslint.config.js \
  ./packages/design-system/vitest.config.ts \
  /app/packages/design-system/


# skipcq: DOK-DL3006
FROM ${BASE_IMAGE} AS deploy

RUN <<EOF
set -e
yarn workspaces focus @soliguide/design-system --production
yarn cache clean
EOF

WORKDIR /app/packages/design-system
USER node

ENTRYPOINT ["sh", "-c"]
CMD ["yarn workspace @soliguide/design-system storybook"]