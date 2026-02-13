import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().min(2),
  email: z.string(),
});

export const userResponseSchema = z.object({
  id: z.string(),
  auth0Id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type createUserPayload = z.infer<typeof createUserBodySchema>;
export type userResponse = z.infer<typeof userResponseSchema>;
