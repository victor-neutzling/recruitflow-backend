import { z } from "zod";

export const deadlineBodySchema = z.object({
  label: z.string(),
  date: z.string(),
});

export const deadlineResponseSchema = z.object({
  id: z.string(),
  applicationId: z.string(),

  label: z.string(),
  date: z.string(),
});

export const getDeadlinesResponseSchema = z.object({
  deadlines: z
    .object({
      id: z.string(),
      applicationId: z.string(),
      applicationTitle: z.string(),
      label: z.string(),
      date: z.string(),
    })
    .array(),
  count: z.number(),
});

export type DeadlinePayload = z.infer<typeof deadlineBodySchema>;
export type DeadlineResponse = z.infer<typeof deadlineResponseSchema>;
