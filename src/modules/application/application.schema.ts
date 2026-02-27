import { z } from "zod";

export const createApplicationBodySchema = z // also serves for edit application
  .object({
    title: z.string(),
    companyName: z.string(),
    position: z.string().optional(),
    salary: z.number().optional(),
    salaryType: z.enum(["expected", "offered"]).optional(),
    currency: z.string().optional(),
    workModel: z.enum(["remote", "hybrid", "onsite"]).optional(),
    regime: z.enum(["clt", "pj", "other"]).optional(),
    description: z.string().optional(),
    status: z.enum([
      "applied",
      "interview",
      "inProgress",
      "offer",
      "rejected",
      "accepted",
    ]),
    columnIndex: z.number(),
    appliedAt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.salaryType && data.salary === null) {
        return false;
      }
      return true;
    },
    {
      message: "salary must be provided when salaryType is set",
      path: ["salary"],
    },
  );

export const batchEditApplicationBodySchema = z
  .object({
    id: z.string(),
    status: z.enum([
      "applied",
      "interview",
      "inProgress",
      "offer",
      "rejected",
      "accepted",
    ]),
    columnIndex: z.number(),
  })
  .array();

export const shortenedApplicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  position: z.string().nullable(),
  companyName: z.string().nullable(),
  appliedAt: z.string().nullable(),
  columnIndex: z.number(),
  status: z.enum([
    "applied",
    "interview",
    "inProgress",
    "offer",
    "rejected",
    "accepted",
  ]),
});

export const getApplicationsResponseSchema = z.object({
  applications: z.object({
    applied: z.array(shortenedApplicationSchema),
    interview: z.array(shortenedApplicationSchema),
    inProgress: z.array(shortenedApplicationSchema),
    offer: z.array(shortenedApplicationSchema),
    rejected: z.array(shortenedApplicationSchema),
    accepted: z.array(shortenedApplicationSchema),
  }),
  total: z.number(),
});

export const getApplicationByIdResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyName: z.string(),
  position: z.string().nullable(),
  salary: z.number().nullable(),
  salaryType: z.enum(["expected", "offered"]).nullable(),
  currency: z.string().nullable(),
  workModel: z.enum(["remote", "hybrid", "onsite"]).nullable(),
  regime: z.enum(["clt", "pj", "other"]).nullable(),
  description: z.string().nullable(),
  status: z.enum([
    "applied",
    "interview",
    "inProgress",
    "offer",
    "rejected",
    "accepted",
  ]),
  columnIndex: z.number(),
  appliedAt: z.string().nullable(),
  applicationLinks: z
    .object({
      id: z.string(),
      label: z.string().nullable(),
      url: z.string(),
    })
    .array()
    .optional(),
  deadlines: z
    .object({
      id: z.string(),
      label: z.string(),
      date: z.string(),
    })
    .array()
    .optional(),
});

export type ShortenedApplication = z.infer<typeof shortenedApplicationSchema>;

export type CreateApplicationPayload = z.infer<
  typeof createApplicationBodySchema
>;
export type BatchEditApplicationPayload = z.infer<
  typeof batchEditApplicationBodySchema
>;

export type GetApplicationsResponse = z.infer<
  typeof getApplicationsResponseSchema
>;

export type GetApplicationByIdResponse = z.infer<
  typeof getApplicationByIdResponseSchema
>;
