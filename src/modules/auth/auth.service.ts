import type { FastifyInstance } from "fastify";
import repo from "./auth.repository.js";
import type { createUserPayload } from "./auth.schema.js";

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async syncUser(auth0Id: string, payload: createUserPayload) {
    let user = await repo.findById(auth0Id);

    if (!user) {
      console.log("here");
      user = await repo.create(payload, auth0Id);
    }

    return user;
  }
}
