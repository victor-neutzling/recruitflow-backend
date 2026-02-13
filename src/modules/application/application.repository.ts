import prismaClient from "@/libs/prismaClient.js";
import type {
  BatchEditApplicationPayload,
  CreateApplicationPayload,
} from "./application.schema.js";
import { toPrismaApplication } from "./utils/mappers.js";
class ApplicationRepository {
  create(payload: CreateApplicationPayload, userId: string) {
    return prismaClient.application.create({
      data: toPrismaApplication(payload, userId),
    });
  }
  findMany(auth0Id: string) {
    return prismaClient.application.findMany({
      where: {
        user: {
          auth0Id,
        },
      },
      orderBy: {
        columnIndex: "asc",
      },
      select: {
        id: true,
        title: true,
        appliedAt: true,
        position: true,
        companyName: true,

        columnIndex: true,
        status: true,
      },
    });
  }
  async findById(id: string, auth0Id: string) {
    return prismaClient.application.findFirst({
      where: {
        id,
        user: {
          auth0Id,
        },
      },
      select: {
        id: true,
        title: true,
        position: true,
        companyName: true,
        salary: true,
        currency: true,
        salaryType: true,
        workModel: true,
        regime: true,
        appliedAt: true,
        description: true,

        status: true,
        columnIndex: true,

        applicationLinks: true,
      },
    });
  }

  update(auth0Id: string, id: string, payload: CreateApplicationPayload) {
    return prismaClient.application.updateManyAndReturn({
      where: {
        id,
        user: {
          auth0Id,
        },
      },
      data: toPrismaApplication(payload),
    });
  }

  updateMany(auth0Id: string, payload: BatchEditApplicationPayload) {
    return prismaClient.$transaction(
      payload.map((item) =>
        prismaClient.application.updateMany({
          where: {
            id: item.id,
            user: {
              auth0Id,
            },
          },
          data: { columnIndex: item.columnIndex, status: item.status },
        }),
      ),
    );
  }

  delete(auth0Id: string, id: string) {
    return prismaClient.application.deleteMany({
      where: { id, user: { auth0Id } },
    });
  }
}

export default new ApplicationRepository();
