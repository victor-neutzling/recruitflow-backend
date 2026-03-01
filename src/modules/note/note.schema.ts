import { z } from "zod";

export const noteBodySchema = z.object({
  text: z.string(),
  date: z.string(),
});

export const noteResponseSchema = z.object({
  id: z.string(),
  applicationId: z.string(),

  text: z.string(),
  date: z.string(),
});

export type NotePayload = z.infer<typeof noteBodySchema>;
export type NoteResponse = z.infer<typeof noteResponseSchema>;
