#!/bin/sh
DBDIR="$(cd "$(dirname "$0")"; pwd)";

docker build -t reduxblog-pg "$DBDIR"

docker run -d --name reduxblog-pg --rm -p 127.0.0.1:5433:5432 --shm-size=256MB  reduxblog-pg

# While container 'reduxblog-pg' started as above is running, you can run a
# psql client within the container via:
#    docker exec -it reduxblog-pg psql -U reduxblog
# This will allow you to enter database queries and commands.
# reduxblog=# select * from post;
# Type ctrl-d or "exit" to exit psql and return to your shell.
#
# Or connect from the host
#  - with jdbc via url:
#    jdbc:postgresql://localhost:5433/reduxblog
#  - or with connection parameters:
#    host: localhost
#    port: 5433
#    user: reduxblog
#    database: reduxblog
#    (password is ignored)

# To stop and remove the container:
# docker rm -vf reduxblog-pg
