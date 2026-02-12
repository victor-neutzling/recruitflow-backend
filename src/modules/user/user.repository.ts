import prismaClient from "@/libs/prismaClient.js";
import type { createUserPayload } from "./user.schema.js";

class UserRepository {
  create(payload: createUserPayload) {
    return prismaClient.user.create({
      data: payload,
    });
  }

  findById(auth0Id: string) {
    return prismaClient.user.findUnique({
      where: { auth0Id },
    });
  }
}

export default new UserRepository();
