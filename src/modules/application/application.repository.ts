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
  findMany(
    auth0Id: string,
    search?: string,
    salaryMin?: number,
    salaryMax?: number,
    workModel?: string,
    regime?: string,
    appliedFrom?: Date,
    appliedTo?: Date,
  ) {
    return prismaClient.application.findMany({
      where: {
        user: {
          auth0Id,
        },

        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { position: { contains: search, mode: "insensitive" } },
            { companyName: { contains: search, mode: "insensitive" } },
          ],
        }),

        ...(salaryMin !== undefined || salaryMax !== undefined
          ? {
              salary: {
                ...(salaryMin !== undefined && { gte: salaryMin }),
                ...(salaryMax !== undefined && { lte: salaryMax }),
              },
            }
          : {}),

        ...(workModel && { workModel }),

        ...(regime && { regime }),

        ...(appliedFrom || appliedTo
          ? {
              appliedAt: {
                ...(appliedFrom && { gte: appliedFrom }),
                ...(appliedTo && { lte: appliedTo }),
              },
            }
          : {}),
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
