import { z } from "zod";

export const ReactionsSchema =
  z.object({
    thumbsUp: z.number(),
    hooray: z.number(),
    heart: z.number(),
    rocket: z.number(),
    eyes: z.number(),
  })
  .strict();

const ReactionTypeSchema = z.enum(['thumbsUp', 'hooray', 'heart', 'rocket', 'eyes']);

export const CreateReactionDataSchema =
  z.object({
    userId: z.string(),
    reaction: ReactionTypeSchema,
  })
  .strict();

export const noReactions: Reactions = { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 };

export type Reactions = z.infer<typeof ReactionsSchema>;

export type ReactionType = z.infer<typeof ReactionTypeSchema>;

export type CreateReactionData = z.infer<typeof CreateReactionDataSchema>;
