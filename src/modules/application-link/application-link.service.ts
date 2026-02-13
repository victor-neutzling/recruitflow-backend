import type { ApplicationLinkPayload } from "./application-link.schema.js";
import repo from "./application-link.repository.js";
import type { FastifyInstance } from "fastify";

export class ApplicationLinkService {
  constructor(private httpErrors: FastifyInstance["httpErrors"]) {}

  registerLink(payload: ApplicationLinkPayload, applicationId: string) {
    return repo.create(applicationId, payload);
  }

  async editLink(
    payload: ApplicationLinkPayload,
    applicationLinkId: string,
    applicationId: string,
    auth0Id: string,
  ) {
    const [data] = await repo.update(
      auth0Id,
      applicationLinkId,
      applicationId,
      payload,
    );

    if (!data) {
      throw this.httpErrors.notFound();
    }

    return data;
  }

  async deleteLink(auth0Id: string, applicationLinkId: string) {
    const data = await repo.delete(auth0Id, applicationLinkId);

    if (!data.count) {
      throw this.httpErrors.notFound();
    }

    return data;
  }
}
