import { z } from "zod";

export const syncUserBodySchema = z.object({
  name: z.string().min(2),
  email: z.string(),
});

export const userResponseSchema = z.object({
  id: z.string(),
  auth0Id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type syncUserPayload = z.infer<typeof syncUserBodySchema>;
export type userResponse = z.infer<typeof userResponseSchema>;
