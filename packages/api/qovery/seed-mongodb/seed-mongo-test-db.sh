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
MAX_RETRY_ATTEMPTS=30
RETRY_DELAY_SECONDS=5
MAX_RESTORE_ATTEMPTS=3

# Function to sanitize MongoDB URI for logging (hide password)
sanitize_uri() {
    local uri=$1
    # Replace password with ***
    echo "$uri" | sed -E 's/:([^:@]+)@/:***@/g'
}

# Function to extract database name from URI
extract_db_name() {
    local uri=$1
    # Extract database name from URI (after last / and before ?)
    echo "$uri" | sed -E 's|.*/([^/?]+)(\?.*)?$|\1|'
}

# Function to extract host from URI
extract_host() {
    local uri=$1
    # Extract host:port from URI
    echo "$uri" | sed -E 's|mongodb://([^@]+@)?([^/]+).*|\2|'
}

echo "=========================================="
echo "MongoDB Test Database Restore"
echo "=========================================="
echo "Script configuration:"
echo "  Max connection attempts: $MAX_RETRY_ATTEMPTS"
echo "  Retry delay: ${RETRY_DELAY_SECONDS}s"
echo "  Connection timeout: $((MAX_RETRY_ATTEMPTS * RETRY_DELAY_SECONDS))s total"
echo ""
echo "Environment variables:"
echo "  MONGODB_INTERNAL_URL: ${MONGODB_INTERNAL_URL:-(not set)}"
echo ""

# Validate MONGODB_INTERNAL_URL is set
if [ -z "${MONGODB_INTERNAL_URL:-}" ]; then
    echo "Error: MONGODB_INTERNAL_URL environment variable is not set"
    exit 1
fi

# Clean and prepare MongoDB URI
MONGODB_INTERNAL_URL="${MONGODB_INTERNAL_URL%/admin}/soliguide"

# Extract and display connection info for debugging
DB_NAME=$(extract_db_name "$MONGODB_INTERNAL_URL")
DB_HOST=$(extract_host "$MONGODB_INTERNAL_URL")
SANITIZED_URI=$(sanitize_uri "$MONGODB_INTERNAL_URL")

echo "MongoDB connection details:"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  URI (sanitized): $SANITIZED_URI"
echo ""
echo "Dump file: ${DUMP_FILE}"
echo "=========================================="
echo ""

# Check dump file exists
if [ ! -f "$DUMP_FILE" ]; then
    echo "Error: Dump file not found at $DUMP_FILE"
    echo "Please verify the file path and try again."
    exit 1
fi

echo "Dump file size: $(du -h "$DUMP_FILE" | cut -f1)"
echo ""

# Function to wait for MongoDB to be ready (aligned with restore.sh)
wait_for_mongodb() {
    local attempt=1

    echo "Waiting for MongoDB to be ready..."
    while [ $attempt -le $MAX_RETRY_ATTEMPTS ]; do
        if mongosh "$MONGODB_INTERNAL_URL" --quiet --eval "db.runCommand({ ping: 1 })" 2>&1; then
            echo "✓ MongoDB is ready!"
            return 0
        fi
        echo "Attempt $attempt/$MAX_RETRY_ATTEMPTS: MongoDB not ready yet, waiting ${RETRY_DELAY_SECONDS}s..."
        sleep "$RETRY_DELAY_SECONDS"
        attempt=$((attempt + 1))
    done

    echo "Error: Could not connect to MongoDB after $MAX_RETRY_ATTEMPTS attempts ($((MAX_RETRY_ATTEMPTS * RETRY_DELAY_SECONDS))s total)"
    echo ""
    echo "Possible issues:"
    echo "  - MongoDB is not running"
    echo "  - Incorrect MONGODB_INTERNAL_URL"
    echo "  - Network connectivity issues"
    echo "  - Authentication failure"
    return 1
}

# Wait for MongoDB to be ready
if ! wait_for_mongodb; then
    exit 1
fi

echo ""
echo "Dropping existing database '$DB_NAME'..."
if mongosh "$MONGODB_INTERNAL_URL" --quiet --eval "db.dropDatabase()"; then
    echo "✓ Database dropped successfully"
else
    echo "Warning: Could not drop database (it may not exist yet)"
fi

echo ""
echo "Restoring database from $DUMP_FILE..."
echo "This may take several minutes depending on the dump size..."
echo ""

# Restore with retry logic
restore_attempt=1
restore_success=false

while [ $restore_attempt -le $MAX_RESTORE_ATTEMPTS ]; do
    echo "Restore attempt $restore_attempt/$MAX_RESTORE_ATTEMPTS..."

    if mongorestore --uri="$MONGODB_INTERNAL_URL" --gzip --archive="$DUMP_FILE" --verbose; then
        restore_success=true
        break
    else
        echo "✗ Restore attempt $restore_attempt failed"

        if [ $restore_attempt -lt $MAX_RESTORE_ATTEMPTS ]; then
            echo "Waiting ${RETRY_DELAY_SECONDS}s before retry..."
            sleep "$RETRY_DELAY_SECONDS"
        fi

        restore_attempt=$((restore_attempt + 1))
    fi
done

if [ "$restore_success" = false ]; then
    echo ""
    echo "=========================================="
    echo "✗ Database restore FAILED after $MAX_RESTORE_ATTEMPTS attempts"
    echo "=========================================="
    exit 1
fi

echo ""
echo "Verifying restore..."
DOC_COUNT=$(mongosh "$MONGODB_INTERNAL_URL" --quiet --eval '
    db.getCollectionNames().reduce((total, collName) => {
        const count = db.getCollection(collName).countDocuments();
        print(collName + ": " + count + " documents");
        return total + count;
    }, 0)
' | tail -1)

echo ""
echo "=========================================="
echo "✓ Database restore completed successfully!"
echo "=========================================="
echo "Database: $DB_NAME"
echo "Total documents restored: $DOC_COUNT"
echo "=========================================="

exit 0
