import prismaClient from "@/libs/prismaClient.js";
import type { createUserPayload, userResponse } from "./user.schema.js";

class UserRepository {
  async create(payload: createUserPayload) {
    const data: userResponse = await prismaClient.user.create({
      data: payload,
    });

    return data;
  }

  async findById(auth0Id: string) {
    const data: userResponse = await prismaClient.user.findUnique({
      where: { auth0Id },
    });

    return data;
  }
}

export default new UserRepository();
