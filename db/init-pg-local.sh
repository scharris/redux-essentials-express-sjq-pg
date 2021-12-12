#!/bin/sh
set -e
(cd local-pg && ./init-pg-here.sh reduxblog)
psql -U reduxblog -f create-schema-objects.sql
psql -U reduxblog -f create-test-data.sql

