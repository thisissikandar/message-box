import { z } from "zod";


export const messageAcceptSchema = z.object({
  acceptMessages: z.boolean(),
});
