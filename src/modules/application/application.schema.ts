import { z } from "zod";

const createApplicationBodySchema = z //serves for edit application too i believe
  .object({
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
      "reply",
      "interview",
      "offer",
      "rejected",
      "accepted",
    ]),
    columnIndex: z.number(),
    appliedAt: z.date().nullable(),
    userId: z.string(),
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

const batchEditApplicationBodySchema = z
  .object({
    id: z.string(),
    columnIndex: z.number(),
  })
  .array();

const getApplicationsResponseSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    position: z.string(),
    companyName: z.string(),
    status: z.string(),
    appliedAt: z.date().nullable(),
  })
  .array();

const getAppllicationByIdResponseSchema = z.object({
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
    "reply",
    "interview",
    "offer",
    "rejected",
    "accepted",
  ]),
  appliedAt: z.date().nullable(),
});

export type createApplicationPayload = z.infer<
  typeof createApplicationBodySchema
>;
export type batchEditApplicationPayload = z.infer<
  typeof batchEditApplicationBodySchema
>;

export type getApplicationsResponse = z.infer<
  typeof getApplicationsResponseSchema
>;

export type getApplicationByIdResponse = z.infer<
  typeof getAppllicationByIdResponseSchema
>;
