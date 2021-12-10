export interface Reactions
{
   thumbsUp: number;
   hooray: number;
   heart: number;
   rocket: number;
   eyes: number;
}

export interface NewReactionData
{
   postId: string,
   userId: string,
   reaction: ReactionType
}

export const noReactions = { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 };

export type ReactionType = keyof Reactions;
