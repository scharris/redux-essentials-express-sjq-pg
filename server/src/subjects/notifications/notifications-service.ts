import { getSql } from '../../db/sql-resources-loader';
import * as NotificationsQuery from '../../db/generated/query-result-types/notifications-query';
import { execSql } from '../../db/pool-executor';
import { Notification as DTONotification } from '../../../../client/src/data-transfer';

export async function getNotifications(): Promise<DTONotification[]>
{
   const res = await execSql(getSql(NotificationsQuery.sqlResourceJsonObjectRows), []);

   return res.rows.map(row => makeDTONotification(row.json));
}

export function makeDTONotification(notif: NotificationsQuery.Notification): DTONotification
{
   return {
      ...notif,
      id: notif.id.toString(),
      date: notif.created,
      user: notif.userId.toString(),
   };
}
