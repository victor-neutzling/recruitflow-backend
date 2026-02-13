import prismaClient from "@/libs/prismaClient.js";
import type { syncUserPayload } from "./auth.schema.js";

class AuthRepository {
  upsert(payload: syncUserPayload, auth0Id: string) {
    const { email, name } = payload;

    return prismaClient.user.upsert({
      where: { auth0Id },
      update: { email, name },
      create: { email, name, auth0Id },
    });
  }
  findUserId(auth0Id: string) {
    return prismaClient.user.findFirst({
      where: { auth0Id },
      select: {
        id: true,
      },
    });
  }
}

export default new AuthRepository();
