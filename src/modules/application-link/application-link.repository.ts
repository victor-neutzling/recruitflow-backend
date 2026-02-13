import prismaClient from "@/libs/prismaClient.js";
import type { ApplicationLinkPayload } from "./application-link.schema.js";

class ApplicationLinkRepository {
  create(applicationId: string, payload: ApplicationLinkPayload) {
    return prismaClient.applicationLink.create({
      data: {
        ...(payload.label && { label: payload.label }),
        url: payload.url,
        applicationId: applicationId,
      },
    });
  }

  update(
    auth0Id: string,
    applicationLinkId: string,
    applicationId: string,
    payload: ApplicationLinkPayload,
  ) {
    return prismaClient.applicationLink.updateManyAndReturn({
      where: {
        id: applicationLinkId,
        applicationId: applicationId,
        application: {
          user: {
            auth0Id,
          },
        },
      },
      data: {
        ...(payload.label && { label: payload.label }),
        url: payload.url,
      },
    });
  }

  delete(auth0Id: string, applicationLinkId: string) {
    return prismaClient.applicationLink.deleteMany({
      where: {
        id: applicationLinkId,
        application: {
          user: {
            auth0Id,
          },
        },
      },
    });
  }
}

export default new ApplicationLinkRepository();
