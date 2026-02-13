import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { ApplicationLinkService } from "./application-link.service.js";
import {
  applicationLinkBodySchema,
  applicationLinkResponseSchema,
  type ApplicationLinkPayload,
} from "./application-link.schema.js";

export const applicationLinkRoutes: FastifyPluginAsync = async (fastify) => {
  const applicationLinkService = new ApplicationLinkService(fastify.httpErrors);

  fastify.post(
    "/",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        body: applicationLinkBodySchema,
        response: {
          201: applicationLinkResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { applicationId: string };
        Body: ApplicationLinkPayload;
      }>,
      reply,
    ) => {
      const applicationLink = await applicationLinkService.registerLink(
        request.body,
        request.params.applicationId,
      );

      reply.code(201).send(applicationLink);
    },
  );

  fastify.put(
    "/:applicationLinkId",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        body: applicationLinkBodySchema,
        response: {
          200: applicationLinkResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { applicationId: string; applicationLinkId: string };
        Body: ApplicationLinkPayload;
      }>,
      reply,
    ) => {
      const applicationLink = await applicationLinkService.editLink(
        request.body,
        request.params.applicationLinkId,
        request.params.applicationId,
        request.user.sub,
      );

      reply.code(201).send(applicationLink);
    },
  );

  fastify.delete<{
    Params: { applicationId: string; applicationLinkId: string };
  }>(
    "/:applicationLinkId",
    {
      preHandler: fastify.requireAuth(),
    },
    async (request, reply) => {
      await applicationLinkService.deleteLink(
        request.user.sub,
        request.params.applicationLinkId,
      );

      reply.code(204).send();
    },
  );
};
