import { z } from "zod";

export const NotificationSchema =
  z.object({
    id: z.string(),
    date: z.string(),
    message: z.string(),
    user: z.string(),
    read: z.boolean().optional(),
    isNew: z.boolean().optional(),
  })
  .strict();

export type Notification = z.infer<typeof NotificationSchema>;
