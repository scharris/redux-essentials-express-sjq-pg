import { getSql as sql } from '../../db/sql-resources-loader';
import * as UsersQuery from '../../db/generated/query-result-types/users-query';
import { execSql } from '../../db/pool-executor';
import { User as DTOUser } from '../../../../client/src/data-transfer';

export async function getUsers(): Promise<DTOUser[]>
{
   const res = await execSql(sql(UsersQuery.sqlResourceJsonObjectRows), []);

   return res.rows.map(row => makeDTOUser(row.json));
}

export function makeDTOUser(user: UsersQuery.User): DTOUser
{
   return {
      ...user,
      id: user.id.toString(),
      lastName: user.lastName || '',
      name: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
   };
}
