

// The types defined in this file correspond to results of the following generated SQL queries.
export const sqlResource = "post-query.sql";


// query parameters


// Below are types representing the result data for the generated query, with top-level type first.
export interface Post
{
  id: number;
  userId: number;
  title: string;
  content: string;
  date: string;
  comments: Comment[];
  reactions: Reaction[];
}

export interface Comment
{
  id: number;
  content: string;
  userId: number;
  created: string;
}

export interface Reaction
{
  userId: number;
  reactionType: string;
}
