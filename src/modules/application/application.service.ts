import type { FastifyInstance } from "fastify";
import repo from "./application.repository.js";
import type {
  BatchEditApplicationPayload,
  CreateApplicationPayload,
  GetApplicationByIdResponse,
  GetApplicationsResponse,
  ShortenedApplication,
} from "./application.schema.js";

type groupedApplications = {
  applied: ShortenedApplication[];
  interview: ShortenedApplication[];
  inProgress: ShortenedApplication[];
  offer: ShortenedApplication[];
  rejected: ShortenedApplication[];
  accepted: ShortenedApplication[];
};

const applicationStatuses = [
  "applied",
  "interview",
  "inProgress",
  "offer",
  "rejected",
  "accepted",
];

export class ApplicationService {
  constructor(private httpErrors: FastifyInstance["httpErrors"]) {}

  async registerApplication(payload: CreateApplicationPayload, userId: string) {
    const data = await repo.create(payload, userId);

    const normalizedData = {
      ...data,
      ...(data.appliedAt && { appliedAt: data.appliedAt?.toISOString() }),
      applicationLinks: [],
    };

    return normalizedData;
  }

  async getApplications(auth0Id: string, search?: string) {
    const data = await repo.findMany(auth0Id, search);

    const normalizedData: ShortenedApplication[] = data.map((item) => ({
      ...item,
      appliedAt: item.appliedAt
        ? item.appliedAt instanceof Date
          ? item.appliedAt.toISOString()
          : item.appliedAt
        : null,
    })) as ShortenedApplication[];

    const grouped: groupedApplications = {
      applied: [],
      interview: [],
      inProgress: [],
      offer: [],
      rejected: [],
      accepted: [],
    };

    normalizedData.forEach((item) => {
      if (grouped[item.status as keyof groupedApplications]) {
        grouped[item.status as keyof groupedApplications].push(item);
      }
    });

    return { applications: grouped, total: data.length };
  }

  async getApplicationById(applicationId: string, auth0Id: string) {
    const data = await repo.findById(applicationId, auth0Id);

    if (!data) {
      throw this.httpErrors.notFound();
    }

    const normalizedData = {
      ...data,
      ...(data.appliedAt && { appliedAt: data.appliedAt?.toISOString() }),
    };

    return normalizedData;
  }

  async editApplication(
    auth0Id: string,
    applicationId: string,
    payload: CreateApplicationPayload,
  ) {
    const [data] = await repo.update(auth0Id, applicationId, payload);

    if (!data) {
      throw this.httpErrors.notFound();
    }

    const normalizedData = {
      ...data,
      ...(data.appliedAt && { appliedAt: data.appliedAt?.toISOString() }),
    };

    return normalizedData;
  }

  reorderApplicationCards(
    auth0Id: string,
    payload: BatchEditApplicationPayload,
  ) {
    if (!payload.length) {
      throw this.httpErrors.badRequest("payload should not be empty");
    }

    return repo.updateMany(auth0Id, payload);
  }

  async moveApplicationForward(auth0Id: string, applicationId: string) {
    const applications = await this.getApplications(auth0Id);
    const application = await repo.findById(applicationId, auth0Id);

    if (!application) {
      throw this.httpErrors.notFound("application not found");
    }

    if (application.status === "accepted") {
      throw this.httpErrors.badRequest("application already at last stage");
    }
    applicationStatuses.some((status, index) => {
      if (application.status === status) {
        const column =
          applications.applications[
            applicationStatuses[
              index
            ] as keyof GetApplicationsResponse["applications"]
          ];

        application.status = applicationStatuses[index + 1]!;
        application.columnIndex = column.length;
        return true;
      }
      return false;
    });

    const [data] = await repo.update(auth0Id, applicationId, {
      title: application.title,
      columnIndex: application.columnIndex,
      companyName: application.companyName,
      status: application.status as ShortenedApplication["status"],
      appliedAt: application.appliedAt?.toISOString(),
      currency: application.currency!,
      description: application.description!,
      position: application.position!,
      regime: (application.regime as GetApplicationByIdResponse["regime"])!,
      salary: application.salary!,
      salaryType:
        (application.salaryType as GetApplicationByIdResponse["salaryType"])!,
      workModel:
        (application.workModel as GetApplicationByIdResponse["workModel"])!,
    });

    const normalizedData = {
      ...data,
      ...(data?.appliedAt && { appliedAt: data.appliedAt?.toISOString() }),
      applicationLinks: [],
    };

    return normalizedData;
  }

  async deleteApplication(auth0Id: string, applicationId: string) {
    const data = await repo.delete(auth0Id, applicationId);

    if (!data.count) {
      throw this.httpErrors.notFound();
    }

    return data;
  }
}
