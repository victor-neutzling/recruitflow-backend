import type { FastifyInstance } from "fastify";
import repo from "./user.repository.js";
import type { createUserPayload } from "./user.schema.js";

export class UserService {
  constructor(private fastify: FastifyInstance) {}

  registerUser(payload: createUserPayload) {
    return repo.create(payload);
  }

  async login(id: string) {
    const data = await repo.findById(id);

    if (!data) {
      throw this.fastify.httpErrors.notFound("User does not exist");
    }

    return data;
  }
}
