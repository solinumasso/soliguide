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

# Create the restore script with fixed sleep command
COPY --chmod=0544 --chown=mongodb:mongodb restore.sh /scripts/restore.sh

# Switch to mongodb user
USER mongodb

# Set the script as the entry point
ENTRYPOINT ["/scripts/restore.sh"]
