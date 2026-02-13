import { z } from "zod";

export const applicationLinkBodySchema = z.object({
  label: z.string().optional(),
  url: z.string(),
});

export const applicationLinkResponseSchema = z.object({
  id: z.string(),
  applicationId: z.string(),

  label: z.string().nullable(),
  url: z.string(),
});

export type ApplicationLinkPayload = z.infer<typeof applicationLinkBodySchema>;
export type ApplicationLinkResponse = z.infer<
  typeof applicationLinkResponseSchema
>;
