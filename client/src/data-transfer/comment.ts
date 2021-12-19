import { z } from "zod";

export const CommentSchema =
  z.object({
    id: z.string(),
    content: z.string(),
    userId: z.number(),
    created: z.string(),
  })
  .strict();

export type Comment = z.infer<typeof CommentSchema>;
