import type { FastifyInstance } from "fastify";
import applicationRepository from "./application.repository.js";
import type { createApplicationPayload } from "./application.schema.js";

export class ApplicationService {
  constructor(private fastify: FastifyInstance) {}

  registerApplication(auth0Id: string, payload: createApplicationPayload) {
    return applicationRepository.create(payload);
  }
}
