import { z } from "zod";

export const UserSchema =
  z.object({
    id: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    name: z.string(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;
