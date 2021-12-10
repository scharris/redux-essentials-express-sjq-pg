import { Comment } from './comment';
import { Reactions } from './reaction';

export interface Post
{
   id: string;
   title: string;
   content: string;
   user: string;
   date: string;
   comments: Comment[];
   reactions: Reactions;
}

export interface NewPostData
{
   title: string;
   content: string;
   user: string;
}

export interface CreatedPostData
{
   id: string;
   title: string;
   content: string;
   user: string;
   date: string;
}

export interface UpdatedPostData
{
   title: string;
   content: string;
}
