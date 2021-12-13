#!/bin/sh
set -e

DBNAME=${1:-reduxblog}
echo Creating database named $DBNAME
SCRIPT_DIR=$(dirname ${BASH_SOURCE:-$0})
PG_LOCAL_DIR=$SCRIPT_DIR/local-pg

[ -n "${PGPORT}" ] || (echo "PGPORT environment variable is not set, aborting." && exit 1)
[ ! -d "$PG_LOCAL_DIR"/pg-data ] || (echo "Data directory already exists, aborting." && exit 1);

"$PG_LOCAL_DIR"/init-pg-here.sh "$DBNAME"
psql -U "$DBNAME" -f "$SCRIPT_DIR"/create-schema-objects.sql
psql -U "$DBNAME" -f "$SCRIPT_DIR"/create-test-data.sql

echo
echo "New Postgres database is available on port $PGPORT."
echo
