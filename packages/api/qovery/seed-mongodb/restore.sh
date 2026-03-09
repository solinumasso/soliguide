#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

S3_REGION="${S3_REGION:-fr-par}"
S3_HOST="${S3_HOST:-s3.$S3_REGION.scw.cloud}"
S3_HOST_BUCKET="${S3_HOST_BUCKET:-%(bucket)s.$S3_HOST}"

# Debug: Print all relevant environment variables
echo "Debugging environment variables:"
echo "  MONGODB_URI=${MONGODB_URI:-(not set)}"
echo "  S3_REGION=${S3_REGION}"
echo "  S3_HOST=${S3_HOST}"
echo "  S3_HOST_BUCKET=${S3_HOST_BUCKET}"
echo "  S3_ACCESS_KEY=${S3_ACCESS_KEY:-(not set)}"
echo "  S3_SECRET_KEY=${S3_SECRET_KEY:-(not set)}"
echo "  S3_BUCKET=${S3_BUCKET:-(not set)}"
echo "  BACKUP_FILENAME=${BACKUP_FILENAME:-(not set)}"

# skipcq: SCT-A000
S3_ACCESS_KEY="${S3_ACCESS_KEY}"
# skipcq: SCT-A000
S3_SECRET_KEY="${S3_SECRET_KEY}"
S3_BUCKET="${S3_BUCKET}"
BACKUP_FILENAME="${BACKUP_FILENAME}"

S3CMD_ARGS=("--access_key=$S3_ACCESS_KEY" "--secret_key=$S3_SECRET_KEY" "--host=$S3_HOST" "--host-bucket=$S3_HOST_BUCKET" "--region=$S3_REGION")

echo "Starting MongoDB restore process..."

# Function to wait for MongoDB to be ready
wait_for_mongodb() {
    local max_attempts=30
    local attempt=1
    local wait_seconds=5

    echo "Waiting for MongoDB to be ready..."
    while [ $attempt -le $max_attempts ]; do
        if mongosh "$MONGODB_URI" --quiet --eval "db.runCommand({ ping: 1 })" >/dev/null 2>&1; then
            echo "MongoDB is ready!"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: MongoDB not ready yet, waiting $wait_seconds seconds..."
        sleep "$wait_seconds"
        attempt=$((attempt + 1))
    done

    echo "Error: Could not connect to MongoDB after $max_attempts attempts"
    return 1
}

# Function to extract database name and verify connection
check_database() {
    # First ensure MongoDB is available
    if ! wait_for_mongodb; then
        echo "Error: Could not establish connection to MongoDB"
        exit 1
    fi

    # Extract database name from URI - use sed to handle URI parsing
    DB_NAME=$MONGODB_DATABASE

    echo "Successfully extracted database name: $DB_NAME"
    echo "Checking if database $DB_NAME has existing data..."

    # Count total documents in all collections
    DOC_COUNT=$(mongosh "$MONGODB_URI" --quiet --eval '
        db.getCollectionNames().reduce((total, collName) => {
            return total + db.getCollection(collName).countDocuments();
        }, 0)
    ')

    if [ "$DOC_COUNT" -gt 0 ]; then
        return 1  # Database has data
    else
        return 0  # Database is empty
    fi
}

# Check if database has data
if check_database; then
    echo "Database is empty. Proceeding with restore..."
else
    echo "Database contains existing data!"

    if [ "$FORCE" = "true" ]; then
        echo "FORCE is set to true. Proceeding with restore anyway..."
    else
        echo "Skipping restore to prevent data loss."
        echo "To force restore over existing data, set FORCE=true"
        exit 0
    fi
fi

# Create temporary directory for the dump
TEMP_DIR=$(mktemp -d)
# skipcq: SH-2064
trap "rm -rf ${TEMP_DIR}" EXIT
cd "$TEMP_DIR"

# Download the dump file from S3
DUMP_FILE_NAME=soliguide_db.gzip
echo "Downloading dump from S3 ${S3_BUCKET}/${BACKUP_FILENAME} to ${DUMP_FILE_NAME}..."
s3cmd "${S3CMD_ARGS[@]}" get "s3://${S3_BUCKET}/${BACKUP_FILENAME}" "./${DUMP_FILE_NAME}"

# Restore the database
echo "Restoring database..."
mongorestore --drop --uri="$MONGODB_URI" --gzip --archive="./${DUMP_FILE_NAME}"
cd -

echo "Database restore completed successfully!"
