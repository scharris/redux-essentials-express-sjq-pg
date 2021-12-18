import { getSql } from '../../db/sql-resources-loader';
import * as PostsQuery from '../../db/generated/query-result-types/all-posts-query';
import * as UsersQuery from '../../db/generated/query-result-types/users-query';
import { execSql } from '../../db/pool-executor';
import { PostsWithContext } from '../../../../client/src/data-transfer';
import { makeDTOPost } from '../posts/posts-service';
import { makeDTOUser } from '../users/users-service';

export async function getPostsWithContext(): Promise<PostsWithContext>
{
   const postsQuery = getSql(PostsQuery.sqlResourceJsonArrayRow);
   const usersQuery = getSql(UsersQuery.sqlResourceJsonArrayRow);

   const sql =
      `select\n` +
      `(${postsQuery}) as posts,\n` +
      `(${usersQuery}) as users`;

   const res = await execSql(sql, []);

   const { posts, users } = res.rows[0] as QueryRowType;

   return {
      posts: posts.map(makeDTOPost),
      users: users.map(makeDTOUser),
   };
}

type QueryRowType = {
   posts: PostsQuery.Post[],
   users: UsersQuery.User[],
};
