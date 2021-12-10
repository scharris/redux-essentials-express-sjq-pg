import * as fs from 'fs';
import * as path from 'path';

const sqlsByFileName: { [sqlFileName: string]: string } = {};

/**
 * Load sql resources from the given directory, which can then be fetched by the application
 * via the exported getSql function.  If minimizeSql is true, then SQL lines are trimmed and
 * all comments are removed when the SQL is loaded, else only top level (unindented) comment
 * lines are removed, and indentation and indented comments are retained.
 */
export function init(sqlDir: string, minimizeSql: boolean = true)
{
   if ( !fs.existsSync(sqlDir) )
      throw new Error(`Generated SQL files directory was not found at ${sqlDir}.`)

   for (const entry of fs.readdirSync(sqlDir))
   {
      if ( entry.match(/\.sql$/i) )
      {
         sqlsByFileName[entry] =
            fs.readFileSync(path.join(sqlDir, entry), 'utf-8')
            .split(/\r?\n/)
            .map(line => minimizeSql ? line.trim(): line)
            .filter(line => !line.startsWith('--'))
            .join('\n');
      }
   }

   console.log(`Read ${Object.keys(sqlsByFileName).length} generated SQL query entries.`);
}

export function getSql(sqlFileName: string): string
{
   const sql = sqlsByFileName[sqlFileName];
   if ( !sql ) throw new Error(`SQL resource '${sqlFileName}' was not found.`);
   else return sql;
}
