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

# For some reason we need jest.config.ts and mocks for typescript compilation
COPY ./packages/frontend/angular.json \
  ./packages/frontend/jest.config.ts \
  ./packages/frontend/tsconfig.app.json \
  ./packages/frontend/tsconfig.json \
  ./packages/frontend/tsconfig.spec.json \
  /app/packages/frontend/
COPY ./packages/frontend/mocks /app/packages/frontend/mocks
COPY ./packages/frontend/src /app/packages/frontend/src

RUN yarn workspace @soliguide/frontend build

# Image for format, lint and test
FROM build AS test

COPY \
  ./packages/frontend/.editorconfig \
  ./packages/frontend/.eslintrc.js \
  ./packages/frontend/.prettierignore \
  ./packages/frontend/jest-global-mocks.ts \
  ./packages/frontend/setup-jest.ts \
  /app/packages/frontend/

FROM caddy:2.9-alpine AS deploy

COPY --chmod=0544 packages/frontend/docker_cmd.sh /bin/docker_cmd.sh
COPY packages/frontend/Caddyfile /etc/caddy/

COPY --from=build /app/packages/frontend/dist/soliguide/ /srv/
COPY --from=build /app/packages/frontend/package.json /tmp/package.json

# Generate version.json from package.json
RUN echo "{\"version\":\"$(grep -oP '(?<="version": ")[^"]*' /tmp/package.json)\"}" > /srv/assets/version.json && \
  rm /tmp/package.json

# Add go template for default language. Angular breaks this if we put it in the original index.prod.html
RUN sed 's/<html lang="fr">/<html lang="{{ placeholder "soliguide_language" }}">/g' < /srv/index.html > /srv/index.html.tmp && \
  mv /srv/index.html.tmp /srv/index.html

# Replace variables in sitemap
RUN sed -e 's|{{SOLIGUIDE_API_URL}}|'"${SOLIGUIDE_API_URL}"'|g' \
  -e 's|{{BUILD_DATE}}|'"$(date +%Y-%m-%d)"'|g' \
  < /srv/assets/sitemaps/sitemap.fr.xml > /srv/assets/sitemaps/sitemap.fr.xml.tmp && \
  mv /srv/assets/sitemaps/sitemap.fr.xml.tmp /srv/assets/sitemaps/sitemap.fr.xml

CMD ["/bin/docker_cmd.sh"]
