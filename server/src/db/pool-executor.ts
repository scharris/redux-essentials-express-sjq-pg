import Pool from 'pg-pool';
import {Client, QueryConfig, QueryResult} from 'pg';


let connPool: Pool<Client> | null = null;

function pool(): Pool<Client>
{
   if ( !connPool )
      throw new Error('Attempt to use connection pool before it has been initialized.');
   return connPool;
}

export function createPool(): void
{
   const env = process.env;

   if ( !env.DB_DATABASE || !env.DB_USER || !env.DB_PASSWORD )
      throw new Error("One or more required database connection values are not defined.");

   connPool = new Pool({
      database: env.DB_DATABASE,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      host: env.DB_HOST || 'localhost',
      port: parseInt(env.DB_PORT as string, 10) || 5432,
      ssl:  env.DB_USE_SSL ? env.DB_USE_SSL.toLowerCase() !== 'false' : true,
      max: parseInt(env.DB_POOL_MAX_SIZE as string, 10) || 2, // set higher for prod
      connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
   });

   connPool.on('error', (err, client) => {
      console.error('pg-pool: Encountered unexpected error on idle client', err)
   });
}

export async function closePool(): Promise<void>
{
   console.log('\nClosing database connection pool.');
   await pool().end();
}

/** Do a query using the shared connection pool, returning the connection when completed. */
export async function execSql(sql: string | QueryConfig, params: any[]): Promise<QueryResult>
{
   try
   {
      return await pool().query(sql, params);
   }
   catch(e)
   {
      console.error(`Error executing query: `, e, '\nsql: ', sql, ' params: ', params);
      throw e;
   }
}
