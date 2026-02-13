import type { FastifyInstance } from "fastify";
import repo from "./application.repository.js";
import type {
  BatchEditApplicationPayload,
  CreateApplicationPayload,
} from "./application.schema.js";

export class ApplicationService {
  constructor(private httpErrors: FastifyInstance["httpErrors"]) {}

  async registerApplication(payload: CreateApplicationPayload, userId: string) {
    const data = await repo.create(payload, userId);

    const normalizedData = {
      ...data,
      ...(data.appliedAt && { appliedAt: data.appliedAt?.toISOString() }),
    };

    return normalizedData;
  }

  async getApplications(auth0Id: string) {
    const data = await repo.findMany(auth0Id);

    const normalizedData = data.map((item) => ({
      ...item,
      ...(item.appliedAt && { appliedAt: item.appliedAt?.toISOString() }),
    }));

    return normalizedData;
  }

  async getApplicationById(applicationId: string, auth0Id: string) {
    const data = await repo.findById(applicationId, auth0Id);

    if (!data) {
      throw this.httpErrors.notFound();
    }

    const normalizedData = {
      ...data,
      ...(data.appliedAt && { appliedAt: data.appliedAt?.toISOString() }),
    };

    return normalizedData;
  }

  async editApplication(
    auth0Id: string,
    applicationId: string,
    payload: CreateApplicationPayload,
  ) {
    const [data] = await repo.update(auth0Id, applicationId, payload);

    if (!data) {
      throw this.httpErrors.notFound();
    }

    const normalizedData = {
      ...data,
      ...(data.appliedAt && { appliedAt: data.appliedAt?.toISOString() }),
    };

    return normalizedData;
  }

  reorderApplicationCards(
    auth0Id: string,
    payload: BatchEditApplicationPayload,
  ) {
    if (!payload.length) {
      throw this.httpErrors.badRequest("payload should not be empty");
    }

    return repo.updateMany(auth0Id, payload);
  }

  async deleteApplication(auth0Id: string, applicationId: string) {
    const data = await repo.delete(auth0Id, applicationId);

    if (!data.count) {
      throw this.httpErrors.notFound();
    }

    return data;
  }
}
