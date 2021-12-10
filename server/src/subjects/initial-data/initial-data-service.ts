import { getSql } from '../../db/sql-resources-loader';
import * as PostsQuery from '../../db/generated/query-result-types/all-posts-query';
import * as UsersQuery from '../../db/generated/query-result-types/users-query';
import * as NotfsQuery from '../../db/generated/query-result-types/notifications-query';
import { execSql } from '../../db/pool-executor';
import { InitialData } from '../../../../client/src/data-transfer';
import { makeDTOPost } from '../posts/posts-service';
import { makeDTOUser } from '../users/users-service';
import { makeDTONotification } from '../notifications/notifications-service';

export async function getInitialData(): Promise<InitialData>
{
   const postsQuery = getSql(PostsQuery.sqlResourceJsonArrayRow);
   const usersQuery = getSql(UsersQuery.sqlResourceJsonArrayRow);
   const notfsQuery = getSql(NotfsQuery.sqlResourceJsonArrayRow);

   const sql =
      `select\n` +
      `(${postsQuery}) as posts,\n` +
      `(${usersQuery}) as users,\n` +
      `(${notfsQuery}) as notfs`;

   const res = await execSql(sql, []);

   const { posts, users, notfs } = res.rows[0] as QueryRowType;

   return {
      posts: posts.map(makeDTOPost),
      users: users.map(makeDTOUser),
      notifications: notfs.map(makeDTONotification),
   };
}

type QueryRowType = {
   posts: PostsQuery.Post[],
   users: UsersQuery.User[],
   notfs: NotfsQuery.Notification[],
};
