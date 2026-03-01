import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { ApplicationService } from "./application.service.js";
import {
  createApplicationBodySchema,
  getApplicationsResponseSchema,
  getApplicationByIdResponseSchema,
  type CreateApplicationPayload,
  batchEditApplicationBodySchema,
  type BatchEditApplicationPayload,
} from "./application.schema.js";
import { AuthService } from "../auth/auth.service.js";

export const applicationRoutes: FastifyPluginAsync = async (fastify) => {
  const applicationService = new ApplicationService(fastify.httpErrors);
  const authService = new AuthService();

  fastify.get(
    "/",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        response: {
          200: getApplicationsResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          search?: string;
          salaryMin?: string;
          salaryMax?: string;
          workModel?: string;
          regime?: string;
          appliedFrom?: string;
          appliedTo?: string;
        };
      }>,
      reply,
    ) => {
      const {
        search,
        appliedFrom,
        appliedTo,
        regime,
        salaryMax,
        salaryMin,
        workModel,
      } = request.query;

      const applications = await applicationService.getApplications(
        request.user.sub,
        search,
        salaryMin,
        salaryMax,
        workModel,
        regime,
        appliedFrom,
        appliedTo,
      );

      reply.send(applications);
    },
  );
  fastify.get(
    "/:id",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        response: {
          200: getApplicationByIdResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const application = await applicationService.getApplicationById(
        request.params.id,
        request.user.sub,
      );

      reply.send(application);
    },
  );

  fastify.post(
    "/",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        body: createApplicationBodySchema,
        response: {
          201: getApplicationByIdResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: CreateApplicationPayload }>,
      reply,
    ) => {
      const userId = await authService.getUserId(request.user.sub);

      console.log(userId);

      if (!userId) {
        throw fastify.httpErrors.notFound();
      }

      const application = await applicationService.registerApplication(
        request.body,
        userId.id,
      );

      reply.code(201).send(application);
    },
  );
  fastify.put(
    "/:id",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        response: {
          200: getApplicationByIdResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: CreateApplicationPayload;
        Params: { id: string };
      }>,
      reply,
    ) => {
      const application = await applicationService.editApplication(
        request.user.sub,
        request.params.id,
        request.body,
      );

      reply.send(application);
    },
  );

  fastify.patch<{
    Params: { id: string };
  }>(
    "/moveforward/:id",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        response: {
          200: getApplicationByIdResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const application = await applicationService.moveApplicationForward(
        request.user.sub,
        request.params.id,
      );

      reply.send(application);
    },
  );

  fastify.patch(
    "/",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        body: batchEditApplicationBodySchema,
      },
    },
    async (
      request: FastifyRequest<{ Body: BatchEditApplicationPayload }>,
      reply,
    ) => {
      await applicationService.reorderApplicationCards(
        request.user.sub,
        request.body,
      );

      reply.code(204).send();
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.requireAuth() },

    async (request, reply) => {
      await applicationService.deleteApplication(
        request.user.sub,
        request.params.id,
      );

      reply.code(204).send();
    },
  );
};
