# Enabling query generation in an enclosing project

This folder is a self-contained project which can be used from an enclosing project to
generate SQL/JSON queries and source code for the corresponding query result types in
Java and/or TypesScript languages. The below describes how to incorporate this
capability into any project to enable query generation. Any build system which is able
to call npm scripts and Maven (`mvn`) and `java` from JDK 11+ should be able to generate
queries via these instructions.

## Instructions

- Clone or copy this project's folder into your project. From here we'll assume the folder
  is named `query-gen/` at the top level of your project, but this can be adjusted to suit.

- Initialize the query-gen project:
  ```
  (cd query-gen && npm i)
  ```
  This step only needs to be performed once to install npm dependencies.

  - Generate database metadata

    Add a script or manually-triggered step to your build process to perform the following whenever
    database metadata needs to be updated to reflect changes in the database:
    ```console
    query-gen/scripts/generate-dbmd.sh <jdbc-props> <pg|mysql|ora>
    ```
    If on Windows, call `query-gen/scripts/generated-dbmd.ps1` with the same arguments via PowerShell.

    Here `<jdbc-props>` is the path to a properties file with JDBC connection information for
    the database to be examined. The expected format of the jdbc properties file is:
    ```
    jdbc.driverClassName=...
    jdbc.url=...
    jdbc.username=...
    jdbc.password=...
    ```

    The metadata files are generated at `query-gen/dbmd/dbmd.json` and
    `query-gen/dbmd/relations-metadata.ts`, which is where they are expected to be for the query
    generator. It's good to glance at its contents when you're getting started just to make sure
    that the tool found the tables and views you expected it to.

- Define application queries

  Edit `query-gen/query-specs.ts` to define application queries. Any tables, views and fields used in
  the queries must exist in the database metadata, so database metadata should be generated before
  proceeding to query generation.

- Generate SQL and source files representing query result types:

  To generate SQL and matching TypeScript result types:

  ```
  npm run --prefix query-gen gen-queries -- --sqlDir=../gen-sql --tsQueriesDir=../gen-types
  ```
