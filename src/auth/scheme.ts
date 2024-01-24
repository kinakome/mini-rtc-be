import { z } from "zod";

export const authScheme = z.object({
  channelName: z.string(),
  memberName: z.string(),
});
