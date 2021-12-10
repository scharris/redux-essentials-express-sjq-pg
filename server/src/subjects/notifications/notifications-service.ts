import { getSql as sql } from '../../db/sql-resources-loader';
import * as NotificationsQuery from '../../db/generated/query-result-types/notifications-query';
import { execSql } from '../../db/pool-executor';
import { Notification as DTONotification } from '../../../../client/src/data-transfer';

export async function getNotifications(): Promise<DTONotification[]>
{
   const res = await execSql(sql(NotificationsQuery.sqlResourceJsonObjectRows), []);

   return res.rows.map(row => makeDTONotification(row.json));
}

export function makeDTONotification(notfn: NotificationsQuery.Notification): DTONotification
{
   return {
      ...notfn,
      id: notfn.id.toString(),
      date: notfn.created,
      user: notfn.userId.toString(),
   };
}
