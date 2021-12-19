import { z } from "zod";
import { UserSchema } from './user';
import { CommentSchema } from './comment';
import { ReactionsSchema } from './reactions';

export const PostSchema =
  z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    user: z.string(),
    date: z.string(),
    comments: z.array(CommentSchema),
    reactions: ReactionsSchema,
 })
 .strict();

export const PostsWithContextSchema =
  z.object({
    posts: z.array(PostSchema),
    users: z.array(UserSchema),
  })
  .strict();

export const CreatePostDataSchema =
  z.object({
    title: z.string(),
    content: z.string(),
    user: z.string(),
  })
  .strict();

export const CreatedPostDataSchema =
  z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    user: z.string(),
    date: z.string(),
  })
  .strict();

export const UpdatePostDataSchema =
  z.object({
    title: z.string(),
    content: z.string(),
  })
  .strict();

export type Post = z.infer<typeof PostSchema>;

export type PostsWithContext = z.infer<typeof PostsWithContextSchema>;

export type CreatePostData = z.infer<typeof CreatePostDataSchema>;

export type CreatedPostData = z.infer<typeof CreatedPostDataSchema>;

export type UpdatePostData = z.infer<typeof UpdatePostDataSchema>;
