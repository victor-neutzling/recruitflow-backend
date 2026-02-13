import prismaClient from "@/libs/prismaClient.js";
import type { createUserPayload } from "./auth.schema.js";

class AuthRepository {
  create(payload: createUserPayload, auth0Id: string) {
    const { email, name } = payload;

    return prismaClient.user.create({
      data: { email, name, auth0Id },
    });
  }

  findById(auth0Id: string) {
    return prismaClient.user.findUnique({
      where: { auth0Id },
    });
  }
}

export default new AuthRepository();
