import express from "express";
import helmet from "helmet";
import * as dotenv from 'dotenv';
import * as path from 'path';
import apiRouter from "./api-router";
import {httpErrorHandler} from "./errors/http-error-handler";
import {createPool, closePool} from './db/pool-executor';
import {init as initSqlLoader} from './db/sql-resources-loader';

async function init(distDir: string, port: number): Promise<void>
{
   const publicResourcesDir = path.join(distDir, 'public');

   const generatedSqlDir = path.join(distDir, 'generated-sql');
   initSqlLoader(generatedSqlDir);

   createPool();
   process.once('SIGTERM', closePool).once('SIGINT',  closePool);

   const app =
      express()
         .use(express.static(publicResourcesDir))
         // CSP is off for now to allow deep links into app content, which require execution of inline scripts.
         .use(helmet({ contentSecurityPolicy: false }))
         .use(express.json())
         .use(express.urlencoded({ extended: true }))
         .use("/api", apiRouter)
         // Enable deep links into the app by serving index.html for any routes not recognized above.
         .get('/*', function (req, res) {
            res.sendFile('index.html', { root: publicResourcesDir });
         })
         .use(httpErrorHandler); // General http errors, other than 404.

   /** Run the server. */
   const server = app.listen(port, () => {
      console.log(`Listening on port ${port}`);
   });

   function exit() { server.close(); closePool(); }
   process.once('SIGTERM', exit).once('SIGINT',  exit);
}

////////////////////////////
//       STARTUP          //
////////////////////////////

if ( process.argv.length < 3 )
{
   console.error('Expected application arguments: <dist-directory> [<env-file> ...]');
   process.abort();
}

const distDir = process.argv[2];
const envFiles = process.argv.slice(3);

for (const envFile of envFiles)
   dotenv.config({ path: envFile });

const port: number = process.env.PORT ? parseInt(process.env.PORT as string, 10): 3000;

init(distDir, port);
