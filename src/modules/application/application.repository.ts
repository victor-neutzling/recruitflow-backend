import prismaClient from "@/libs/prismaClient.js";
import type {
  batchEditApplicationPayload,
  createApplicationPayload,
} from "./application.schema.js";
class ApplicationRepository {
  create(payload: createApplicationPayload) {
    return prismaClient.application.create({
      data: payload,
    });
  }
  findMany(userId: string) {
    return prismaClient.application.findMany({
      where: {
        userId,
      },
    });
  }
  findById(id: string) {
    return prismaClient.application.findFirst({
      where: {
        id,
      },
    });
  }

  edit(id: string, payload: createApplicationPayload) {
    return prismaClient.application.update({
      where: { id },
      data: payload,
    });
  }

  editMany(payload: batchEditApplicationPayload) {
    return prismaClient.$transaction(
      payload.map((item) =>
        prismaClient.application.update({
          where: { id: item.id },
          data: { columnIndex: item.columnIndex },
        }),
      ),
    );
  }

  delete(id: string) {
    return prismaClient.application.delete({ where: { id } });
  }
}

export default new ApplicationRepository();
