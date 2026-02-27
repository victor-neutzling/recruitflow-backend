import prismaClient from "@/libs/prismaClient.js";
import type { DeadlinePayload } from "./deadline.schema.js";

class DeadlineRepository {
  findMany(auth0Id: string) {
    return prismaClient.deadline.findMany({
      select: {
        application: {
          select: {
            title: true,
          },
        },
        applicationId: true,
        date: true,
        id: true,
        label: true,
      },
      where: {
        application: {
          user: {
            auth0Id,
          },
        },
      },
      orderBy: { date: "asc" },
    });
  }

  create(applicationId: string, payload: DeadlinePayload) {
    return prismaClient.deadline.create({
      data: {
        date: new Date(payload.date),
        label: payload.label,
        applicationId,
      },
    });
  }

  delete(auth0Id: string, payloadId: string) {
    return prismaClient.deadline.deleteMany({
      where: {
        id: payloadId,
        application: {
          user: {
            auth0Id,
          },
        },
      },
    });
  }
}

export default new DeadlineRepository();
