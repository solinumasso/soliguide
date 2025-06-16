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

DIRNAME=$(dirname "$0")
DUMP_FILE_NAME=soliguide_db.gzip
DUMP_FILE="${DIRNAME}/../../data/${DUMP_FILE_NAME}"
TEST_DUMP_FILE_NAME=soliguide_db_test.gzip
TEST_MONGODB_NAME=soliguide_test

function usage() {
  cat <<EOF
Usage: $0 {restore|dump|anonymize} [-t] [-m [light|full]]

Description:
  This script manages the backup and restore of the Soliguide database. It uses 'MONGODB_URI' environment variable.
Actions:
  restore          Restore database from backup ($DUMP_FILE). By default restore only a few collections, see options below.
  dump             Create a backup of the current database.
  anonymize        Anonymize sensitive data in the database.
Options:
  -t               Run in test context using '$TEST_MONGODB_NAME' database and '$TEST_DUMP_FILE_NAME' dump name.
Restore options:
  -m {light|full}  Restore mode to use. Either omiting large collections with 'light' or
                   restoring everything with 'full'. Default: light
  -c <name>        Restore only the collection "name"
EOF
}

if [ "$#" -lt 1 ]; then
  echo "ERROR: At least one argument required" >&2
  usage
  exit 1
fi

ACTION="$1"

if [ "${ACTION}" != dump ] && [ "${ACTION}" != restore ] && [ "${ACTION}" != anonymize ]; then
  echo "ERROR: Unknown action: $ACTION" >&2
  usage
  exit 2
fi

shift

TEST_CONTEXT=no
MODE=light
COLLECTION=
# Parse options using getopts
while getopts ":tm:c:" OPTION; do
    case "${OPTION}" in
        t)
          echo "Test mode enabled"
          TEST_CONTEXT=yes
          ;;
        m)
          if [ "${ACTION}" != restore ]; then
            echo "WARNING: Not restoring, ignoring mode $OPTARG" >&2
          fi
          MODE="${OPTARG}"
          if [ "${MODE}" != light ] && [ "${MODE}" != full ]; then
            echo "ERROR: Invalid value for -m: $OPTARG" >&2
            usage
            exit 4
          fi
          ;;
        c)
          if [ "${ACTION}" != restore ]; then
            echo "WARNING: Not restoring, ignoring collection $OPTARG" >&2
          fi
          COLLECTION="${OPTARG}"
          ;;
        \?)
          echo "ERROR: Invalid option: -$OPTARG" >&2
          usage
          exit 3
          ;;
        :)
          echo "ERROR: Invalid option: -$OPTARG requires an argument"
          usage
          exit 5
          ;;
    esac
done

# Get the .env variable if necessary
ENV_FILE="${DIRNAME}/.env"
MONGODB_URI="${MONGODB_URI:-}"
if [ -f "$ENV_FILE" ] && [ -z "${MONGODB_URI}" ]; then
  . "$ENV_FILE"
fi

if [ -z "${MONGODB_URI}" ]; then
  echo "ERROR: Provide MONGODB_URI env variable and create '$ENV_FILE'" >&2
  exit 6
fi

MONGODB_NAME=$(echo "$MONGODB_URI" | cut -d '/' -f4 | cut -d '?' -f1)

# Using mongosh directly or docker?
if [ -n "$(command -v mongosh)" ]; then
  MONGOSH_COMMAND=(mongosh)
  USING_DOCKER=no
else
  # Test whether we can use docker without sudo, fallback to sudo otherwise
  DOCKER=$( (docker ps >/dev/null 2>&1 && echo "docker") || (docker.exe ps >/dev/null 2>&1 && echo "docker.exe") || echo "sudo docker")
  MONGODB_IMAGE=$(grep 'image: mongo' <"${DIRNAME}/../../docker-compose.yml" | sed -E 's/^.+(mongo:.+)$/\1/g')
  USING_DOCKER=yes
  MONGOSH_COMMAND=(${DOCKER} run --rm --network=host -v "${DIRNAME}:/workdir:ro" "$MONGODB_IMAGE" mongosh)
fi

# Anonymization
if [ "$ACTION" = anonymize ]; then
  echo "Anonymizing database $MONGODB_NAME"
  "${MONGOSH_COMMAND[@]}" "${MONGODB_URI}" anonymization/anonymize.mongodb
  exit 0
fi
MONGODB_NAME_PROD=soliguide

if [ "$TEST_CONTEXT" = "yes" ]; then
  DUMP_FILE_NAME="$TEST_DUMP_FILE_NAME"
  # Replace MongoDB URI database name
  # skipcq: SH-2001
  MONGODB_URI=$(echo "$MONGODB_URI" | sed "s/${MONGODB_NAME}?/${TEST_MONGODB_NAME}?/")
  MONGODB_NAME="$TEST_MONGODB_NAME"
  MONGODB_NAME_PROD="$TEST_MONGODB_NAME"
fi

HOST_DUMP_FILE="${DIRNAME}/../../data/${DUMP_FILE_NAME}"
DUMP_FILE_CONTAINER="/data/soliguide/${DUMP_FILE_NAME}"

# Using mongo utils directly or docker?
if [ "$USING_DOCKER" = no ]; then
  MONGO_COMMAND=()
  DUMP_FILE="$HOST_DUMP_FILE"
else
  MONGO_COMMAND=(${DOCKER} run --rm --network=host -u mongodb -v "${DIRNAME}/../../data:/data/soliguide:ro" "$MONGODB_IMAGE")
  DUMP_FILE="$DUMP_FILE_CONTAINER"
fi

# Restore
if [ "$ACTION" = restore ]; then
  if [ ! -f "$HOST_DUMP_FILE" ]; then
    echo "ERROR: Database dump does not exists: $HOST_DUMP_FILE" >&2
    exit 7
  fi

  echo "Restoring database dump $HOST_DUMP_FILE"
  if [ -n "$COLLECTION" ]; then
    echo "Restoring only collection $COLLECTION"
    "${MONGOSH_COMMAND[@]}" "$MONGODB_URI" --eval "db.${COLLECTION}.drop()"
    "${MONGO_COMMAND[@]}" mongorestore --uri="$MONGODB_URI" --gzip --archive="$DUMP_FILE" --collection="$COLLECTION" --nsInclude="${MONGODB_NAME_PROD}.${COLLECTION}" --nsFrom="${MONGODB_NAME_PROD}.${COLLECTION}" --nsTo="${MONGODB_NAME}.${COLLECTION}"
    exit 0
  fi

  ADDITIONAL_ARGS=("")
  if [ "$MODE" != full ]; then
    ADDITIONAL_ARGS=("--nsExclude=*.log*" "--nsExclude=*.mails" "--nsExclude=*.*Campaign" "--nsExclude=*.search" "--nsExclude=*.tempServiceClosures")
  fi

  "${MONGOSH_COMMAND[@]}" "$MONGODB_URI" --eval "db.dropDatabase()"
  "${MONGO_COMMAND[@]}" mongorestore --uri="$MONGODB_URI" --gzip --archive="$DUMP_FILE" "${ADDITIONAL_ARGS[@]}" --nsInclude="${MONGODB_NAME_PROD}.*" --nsFrom="${MONGODB_NAME_PROD}.*" --nsTo="${MONGODB_NAME}.*"
  exit 0
fi

# Dump
if [ "$ACTION" = dump ]; then
  echo "Dumping database to $HOST_DUMP_FILE"
  "${MONGO_COMMAND[@]}" mongodump --uri="$MONGODB_URI" --gzip --archive > "$HOST_DUMP_FILE"
  exit 0
fi

echo "ERROR: we shouldn't arrive there. Something, somwhere went wrong" >&2
exit 42
