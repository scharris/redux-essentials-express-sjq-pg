import { getSql as sql } from '../../db/sql-resources-loader';
import * as PostQuery from '../../db/generated/query-result-types/post-query';
import * as AllPostsQuery from '../../db/generated/query-result-types/all-posts-query';
import {
   verifiedTableName,
   verifiedFieldNames,
   Schema_reduxblog as schema
} from '../../db/generated/relations-metadata';
import { execSql } from '../../db/pool-executor';
import {
   Post as DTOPost,
   NewPostData,
   CreatedPostData,
   UpdatedPostData,
   Comment as DTOComment,
   Reactions as DTOReactions,
   NewReactionData,
} from '../../../../client/src/data-transfer';

export async function getPosts(): Promise<DTOPost[]>
{
   const res = await execSql(sql(AllPostsQuery.sqlResourceJsonObjectRows), []);

   return res.rows.map(row => makeDTOPost(row.json));
}

export async function getPost(id: number): Promise<DTOPost | null>
{
   const res = await execSql(sql(PostQuery.sqlResource), [id]);

   switch (res.rows.length)
   {
      case 0: return null;
      case 1: return makeDTOPost(res.rows[0].json);
      default: throw new Error(`Got more than one post result for fetch of post with id ${id}.`)
   }
}

export async function createPost(newPostData: NewPostData): Promise<CreatedPostData>
{
   const now = new Date().toISOString();

   const post = verifiedTableName(schema, 'post');
   const {title, content, user_id, created} = verifiedFieldNames(schema.post);

   const res = await execSql(
      `insert into ${post}(${title}, ${content}, ${user_id}, ${created}) values($1,$2,$3,$4) ` +
      'returning id',
      [newPostData.title, newPostData.content, +newPostData.user, now]
   );

   if ( res.rowCount !== 1 )
      throw new Error('Expected one row to be modified when creating Post.');

   return {
      ...newPostData,
      id: res.rows[0].id,
      date: now,
   };
}

export async function updatePost(postId: number, postData: UpdatedPostData): Promise<void>
{
   const post = verifiedTableName(schema, 'post');
   const {id, title, content} = verifiedFieldNames(schema.post);

   const res = await execSql(
      `update ${post} set ${title} = $1, ${content} = $2 where ${id} = $3`,
      [postData.title, postData.content, postId]
   );

   if ( res.rowCount !== 1 )
      throw new Error('Expected one row to be modified when creating Post.');
}

export async function addReaction(newReactionData: NewReactionData): Promise<boolean>
{
   const reaction = verifiedTableName(schema, 'reaction');
   const {post_id, user_id, reaction_type} = verifiedFieldNames(schema.reaction);

   const res = await execSql(
      `insert into ${reaction}(${post_id}, ${user_id}, ${reaction_type}) values($1, $2, $3) ` +
      'on conflict do nothing',
      [newReactionData.postId, newReactionData.userId, newReactionData.reaction]
   );

   if ( res.rowCount > 1 )
      throw new Error('Expected result count of 0 or 1 when adding post reaction.');

   return res.rowCount == 1;
}


export async function removePost(postId: number): Promise<void>
{
   const post = verifiedTableName(schema, 'post');
   const {id} = verifiedFieldNames(schema.post);

   const res = await execSql(`delete from ${post} where ${id} = $1`, [postId]);

   if ( res.rowCount !== 1 )
      throw new Error('Expected one row to be modified when deleting a Post, instead got ' + res.rowCount + ".");
}


export function makeDTOPost(post: PostQuery.Post): DTOPost
{
   return {
      ...post,
      id: post.id.toString(),
      user: post.userId.toString(),
      comments: post.comments.map(makeDTOComment),
      reactions: makeDTOReaction(post.reactions),
   };
}

function makeDTOComment(comment: PostQuery.Comment): DTOComment
{
   return {
      ...comment,
      id: comment.id.toString()
   };
}

function makeDTOReaction(reactions: PostQuery.Reaction[]): DTOReactions
{
   let res: DTOReactions = { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 };

   for ( const reaction of reactions )
   {
      switch (reaction.reactionType )
      {
         case 'thumbsUp': ++res.thumbsUp; break;
         case 'hooray': ++res.hooray; break;
         case 'heart': ++res.heart; break;
         case 'rocket': ++res.rocket; break;
         case 'eyes': ++res.eyes; break;
         default:
            console.log(`Received invalid reaction type from database: '${reaction.reactionType}'.`);
      }
   }

   return res;
}
