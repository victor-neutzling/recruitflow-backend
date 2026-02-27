import type { FastifyInstance } from "fastify";

import repo from "./deadline.repository.js";
import type { DeadlinePayload } from "./deadline.schema.js";

export class DeadlineService {
  constructor(private httpErrors: FastifyInstance["httpErrors"]) {}

  async getDeadlines(auth0id: string) {
    const data = await repo.findMany(auth0id);

    const normalizedData = data.map((deadline) => ({
      ...deadline,
      date: deadline.date.toISOString(),
    }));

    return { deadlines: normalizedData, count: data.length };
  }

  registerDeadline(payload: DeadlinePayload, applicationId: string) {
    return repo.create(applicationId, payload);
  }

  async deleteDeadline(auth0Id: string, deadlineId: string) {
    const data = await repo.delete(auth0Id, deadlineId);

    if (!data.count) {
      this.httpErrors.notFound();
    }

    return data;
  }
}
