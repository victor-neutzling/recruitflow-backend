import type { CreateApplicationPayload } from "../application.schema.js";

export function toPrismaApplication(
  payload: CreateApplicationPayload,
  userId?: string,
) {
  return {
    ...payload,

    ...(userId && { userId }),

    position: payload.position ?? null,
    salary: payload.salary ?? null,
    salaryType: payload.salaryType ?? null,
    currency: payload.currency ?? null,
    workModel: payload.workModel ?? null,
    regime: payload.regime ?? null,
    description: payload.description ?? null,
    appliedAt: payload.appliedAt ?? null,
  };
}
