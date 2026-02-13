import type { FastifyInstance } from "fastify";
import repo from "./auth.repository.js";
import type { syncUserPayload } from "./auth.schema.js";

export class AuthService {
  async syncUser(auth0Id: string, payload: syncUserPayload) {
    return repo.upsert(payload, auth0Id);
  }

  async getUserId(auth0Id: string) {
    return repo.findUserId(auth0Id);
  }
}
