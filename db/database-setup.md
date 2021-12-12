# Running Postgres via Docker
If you can run Docker on your local machine, then the easiest way to get a running database with test
data is to run the `init-pg-docker` script for PowerShell or a unix shell:

```
db/init-pg-docker
```

This will create a container running Postgres database as a "daemon" or background process that runs
independently of your current shell. You should be able to see the running container via `docker ps`.
After the container has been started, you can close your shell and the container will continue running.

While container `reduxblog-pg` started as above is running, you can run a `psql` Postgres command line
client within it via:

```
docker exec -it reduxblog-pg psql -U reduxblog
```

This will allow you to enter database queries and commands.  For example: `\d` to list
tables/views/sequences, and `select * from post;` to query table `post`. You can exit by entering
`exit` or via ctrl-d. Changes to the data will be persisted until the container is stopped.

If you have other database access tools, you can use the following connection information to connect
to the database:
  - Via jdbc via url: `jdbc:postgresql://localhost:5433/reduxblog`
  - With connection parameters:
    - host: localhost
    - port: 5433
    - user: reduxblog
    - database: reduxblog
    - password: (ignored)

To stop and remove the container:
```
docker rm -vf reduxblog-pg
```

# Running Postgres locally

Scripts have been provided to easily run Postgres locally, so long as Postgres executables are
available on your PATH environment variable, or else you have Nix installed to run Nix shell
which can easily provide these.

```
cd db
nix-shell # or otherwise make sure Postgres executables (initdb, pg_ctl, psql etc) are on your PATH
```

Then in Nix's bash shell started above or in any shell with Postgres executables on your PATH:
```
./init-pg-local.sh
```

You should see a page or so of output which ends with something like:
```
ALTER ROLE
CREATE TABLE
CREATE TABLE
...
INSERT 0 3
INSERT 0 5
INSERT 0 3
INSERT 0 3
INSERT 0 6
```

Try accessing the application database via:

```console
psql -U reduxblog
# select * from post;
# \q
```
