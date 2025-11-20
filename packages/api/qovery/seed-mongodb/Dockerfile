# Soliguide: Useful information for those who need it
#
# SPDX-FileCopyrightText: © 2025 Solinum
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
FROM mongo:7.0

# Install required tools
RUN apt-get update &&\
  apt-get install --no-install-recommends -y s3cmd=2.2.0-1 &&\
  rm -rf /var/lib/apt/lists/*

# Create script directory
WORKDIR /scripts

# Copy db.sh script from packages/api/
COPY --chmod=0544 --chown=mongodb:mongodb packages/api/db.sh /scripts/db.sh

# Copy data folder containing test dumps from repo root
COPY --chown=mongodb:mongodb data /data

# Switch to mongodb user
USER mongodb

# Set the script as the entry point with restore action and test context
ENTRYPOINT ["/scripts/db.sh"]
CMD ["restore", "-t"]
