# Building and running the app for development

## Clone the project

```git clone -b db-postgres https://github.com/scharris/ts-react-express-skeleton.git```

Enter your github username and password when prompted.

Change directory into the project directory:
```cd ts-react-express-skeleton```

## Start the database

This step requires Docker to be installed and on your path. Start a command line shell, and test
that the `docker` command is found by entering:

     docker ps

You should see a (possibly empty) listing
of containers with column names starting with `CONTAINER ID`.

Change directory to the `server` subdirectory of the project:

```cd server```

Note: In the below, npm scripts are being used for convenience. See the `scripts` section of
`server/package.json` to see the commands that are actually being run by these scripts if you
need to troubleshoot them or are curious.

Now start the database in a Docker container via:

    npm run start-db

If this works properly, you should get output with last line ending with a long string of hexidecimal
digits, which is the identifier of the container that was started. Verify by running `docker ps` again,
which should now show a container with name name `reduxblog-pg` in the last column. The database is running
in the background within this container.

Now as a test, connect to the database via the `psql` command line client for Postgres:

    npm run psql

You should be met with a `reduxblog=#` prompt at which you can enter SQL commands. The psql command
is being run within the same container in which the database itself is running.

Enter a query:

```select * from post;```

You should see a result set with a few rows. This is the example data for the application.

Quit to exit the psql process within the container and return to your command shell:

```\q```

Note: The database remains running in the background and needs to be running for the application
to work. If you want to stop and remove the database container, for example after modifying table
definitions in which case you want to rebuild the database's Docker image, then run the following:

    docker rm -vf reduxblog-pg

The `vf` options tell docker to remove any associated volumes and to remove the container even if it
currently running (ie. "force" removal). You will need to restart the database container as above
before running the application.

## Install npm dependencies

From the top-level project directory, install npm dependencies for both client and server:

```
cd client
npm install
cd ../server
npm install
```

It's not unusual for these commands to fail because of timeouts when they are run initially, in
which case just run the failing command again until it succeeds. Also the warning on non-MacOS
systems about package `fsevents` is normal.


## Build complete client/server package
Now within the server directory we can build and start the full application, with the server
providing static resources for the client app to the browser, and also the backend api services
needed by the app:
```
# ( in server/ )
npm run build
```

When the build is complete, the combined client/server
package will be contained in the `dist` directory.

## Run the app (production style)
```
# ( in server/ )
npm run start
```

This runs an app that has been built with the `npm run build` already. Open your browser to
`localhost:3001/` to try the app. Use the links in the top bar to navigate between pages of the
app.

## Build and run the app via one command (production style)
We can build and run with one command via:
```
npm run build-start
```
This simply runs the `build` and `start` npm scripts described above in sequence. When it's
finished and ready for requests it will print `Listening on port 3001`. The build is necessary
whenever source code changes are made because of the required TypeScript compilation step.

## Running in development mode
The above build and run steps perform a complete build of the application, which can be a slow
process when making frequent changes in development environment. This is similar to how the app
would be run in production but is not well suited for development. For development purposes,
especially when working on the client side of the application, it can helpful to run two node
instances. One node instance runs the server side/api as usual, with another node instance to
serve the changing client resources to the browser with "live reloading" for these changed resources.

To run the app this way for development, first run the server as usual:

```
# terminal 1, in `server/`
npm run build-start
```
When the server is ready, it will print
`Listening on port 3001`.

Then in another shell, run a separate nodejs instance for the client with live reloading:
```
# terminal 2, in `client/`
npm run start
```

Open the browser to `localhost:3000`. The app should function as before, but any changes made to client
resource files (e.g. javascript, stylesheets) should be instantly reflected in the client user interface
in the browser, without having to wait for a rebuild and restart of the entire project.

A shortcut to do the above two commands from a single terminal is:
```npm run dev```
