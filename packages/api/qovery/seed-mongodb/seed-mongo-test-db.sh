#!/bin/bash
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
set -o errexit
set -o pipefail
set -o nounset

DUMP_FILE="/data/soliguide_db_test.gzip"

echo "=========================================="
echo "MongoDB Test Database Restore"
echo "=========================================="
echo "MONGODB_INTERNAL_URL: ${MONGODB_INTERNAL_URL:-(not set)}"
echo "MONGODB_INTERNAL_URL_CLEANED: ${MONGODB_INTERNAL_URL%/admin}"
echo "Dump file: ${DUMP_FILE}"
echo "=========================================="
echo ""


MONGODB_INTERNAL_URL="${MONGODB_INTERNAL_URL%/admin}/soliguide"

# Validate MONGODB_INTERNAL_URL is set
if [ -z "${MONGODB_INTERNAL_URL}" ]; then
    echo "Error: MONGODB_INTERNAL_URL environment variable is not set"
    exit 1
fi

# Check dump file exists
if [ ! -f "$DUMP_FILE" ]; then
    echo "Error: Dump file not found at $DUMP_FILE"
    exit 1
fi

echo "Waiting for MongoDB to be ready..."
max_attempts=10
attempt=1
while [ $attempt -le $max_attempts ]; do
    if mongosh "$MONGODB_INTERNAL_URL" --quiet --eval "db.runCommand({ ping: 1 })" >/dev/null 2>&1; then
        echo "MongoDB is ready!"
        break
    fi
    echo "Attempt $attempt/$max_attempts: Waiting for MongoDB..."
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "Error: Could not connect to MongoDB after $max_attempts attempts"
    exit 1
fi

echo "Dropping existing data..."
mongosh "$MONGODB_INTERNAL_URL" --quiet --eval "db.dropDatabase()"

echo "Restoring database from $DUMP_FILE..."
mongorestore --uri="$MONGODB_INTERNAL_URL" --gzip --archive="$DUMP_FILE"

echo ""
echo "=========================================="
echo "Database restore completed successfully!"
echo "=========================================="

exit 0
