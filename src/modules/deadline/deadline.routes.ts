import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { DeadlineService } from "./deadline.service.js";
import {
  deadlineBodySchema,
  deadlineResponseSchema,
  getDeadlinesResponseSchema,
  type DeadlinePayload,
} from "./deadline.schema.js";

export const deadlineRoutes: FastifyPluginAsync = async (fastify) => {
  const deadlineService = new DeadlineService(fastify.httpErrors);

  fastify.get(
    "/",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        response: { 200: getDeadlinesResponseSchema },
      },
    },
    async (request: FastifyRequest, reply) => {
      const deadlines = await deadlineService.getDeadlines(request.user.sub);

      reply.code(200).send(deadlines);
    },
  );

  fastify.post(
    "/:applicationId",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        body: deadlineBodySchema,
        response: {
          201: deadlineResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { applicationId: string };
        Body: DeadlinePayload;
      }>,
      reply,
    ) => {
      const deadline = await deadlineService.registerDeadline(
        request.body,
        request.params.applicationId,
      );

      const parsedDeadline = { ...deadline, date: deadline.date.toISOString() };

      reply.code(201).send(parsedDeadline);
    },
  );

  fastify.delete<{
    Params: { applicationId: string; deadlineId: string };
  }>(
    "/:deadlineId",
    { preHandler: fastify.requireAuth() },
    async (request, reply) => {
      await deadlineService.deleteDeadline(
        request.user.sub,
        request.params.deadlineId,
      );

      reply.code(204).send();
    },
  );
};
