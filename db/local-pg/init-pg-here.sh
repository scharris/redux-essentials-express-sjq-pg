#!/bin/bash
set -e

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "expected arguments: <database name>"

DBNAME="$1"

SCRIPT_DIR=$(dirname ${BASH_SOURCE:-$0})

echo Initializing a new Postgres server instance with database \"$DBNAME\" on port $PGPORT.

mkdir pg-data

# Initialize the database cluster (no databases yet) with superuser "postgres".
initdb -D "$SCRIPT_DIR/pg-data" -U postgres

# Start the cluster so we can create databases, users etc.
./start-pg

# Create the application user.
createuser -U postgres -p "$PGPORT" --echo "$DBNAME"

# Create the application database.
createdb -U postgres -p "$PGPORT" --owner "$DBNAME" "$DBNAME"

# Create application schema and set it as sole enty on the user's search path.
# ( It's desirable to have the schema named for the application (as opposed to "public")
#   when trying to stay similar to Oracle setups. )
psql -U "$DBNAME" --dbname "$DBNAME" -p "$PGPORT" --echo-all \
  -c "create schema $DBNAME authorization $DBNAME;" \
  -c "alter role $DBNAME set search_path to $DBNAME;"
 
