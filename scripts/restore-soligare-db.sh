#!/usr/bin/env bash
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

set -o errexit
set -o pipefail
set -o nounset

echo "##############################################################################################"
echo "#"
echo "# USAGE:"
echo "#"
echo "# $0 --db=dev | --db=test | --db=analytics"
echo "#"
echo "##############################################################################################"

DIRNAME=$(dirname "$0")

DB_TO_RESTORE="${1#*=}"

if [ "${DB_TO_RESTORE}" != "test" ] && [ "${DB_TO_RESTORE}" != "dev" ]; then
  echo "" >&2
  echo "##############################################################################################" >&2
  echo "# [ERROR] Provide the database to restore: dev|test|analytics" >&2
  echo "##############################################################################################" >&2
  exit 1
fi

# Get the .env variable if necessary
POSTGRES_EXTERNAL_URI="${POSTGRES_EXTERNAL_URI:-}"
if [ -f "${DIRNAME}/../packages/soligare/.env" ] && [ -z "${POSTGRES_EXTERNAL_URI}" ]; then
  . "${DIRNAME}/../packages/soligare/.env"
fi

if [ -z "${POSTGRES_EXTERNAL_URI}" ]; then
  echo "" >&2
  echo "##############################################################################################" >&2
  echo "# [ERROR] Provide POSTGRES_EXTERNAL_URI env variable and create ${DIRNAME}/../packages/soligare/.env" >&2
  echo "##############################################################################################" >&2
  exit 2
fi

DUMP_FILE_NAME=soligare_db.sql.gz

if [ "${DB_TO_RESTORE}" = "test" ]; then
  # Replace PostgreSQL URI database name
  # skipcq: SH-2001
  POSTGRES_EXTERNAL_URI=postgres://postgres:postgres@localhost:5432/postgres
  DUMP_FILE_NAME=soligare_db_test.sql.gz
fi

DUMP_FILE="${DIRNAME}/../data/soligare/${DUMP_FILE_NAME}"
DUMP_FILE_CONTAINER="/data/soligare/${DUMP_FILE_NAME}"

# Test whether we can use docker without sudo, fallback to sudo otherwise
DOCKER=$(docker ps >/dev/null 2>&1 && echo "docker" || echo "sudo docker")

if test -f "$DUMP_FILE"; then
  echo ""
  echo "##############################################################################################"
  echo "# Restoring database #"
  echo "##############################################################################################"
  echo ""

  ${DOCKER} exec -t soligare-postgres pg_restore --clean --if-exists --dbname="${POSTGRES_EXTERNAL_URI}" "${DUMP_FILE_CONTAINER}"

  echo ""
  echo "##############################################################################################"
  echo "# [SUCCESS] Database sucessfully restored √ #"
  echo "##############################################################################################"
  echo ""
else
  echo "" >&2
  echo "##############################################################################################" >&2
  echo "# [ERROR] Database dump does not exists: $DUMP_FILE" >&2
  echo "##############################################################################################" >&2
  echo "" >&2
  exit 3
fi
