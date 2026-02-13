import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import {
  createUserBodySchema,
  userResponseSchema,
  type createUserPayload,
} from "./auth.schema.js";
import { AuthService } from "./auth.service.js";

export const authRoutes: FastifyPluginAsync = async (fastify, options) => {
  const authService = new AuthService(fastify);

  fastify.post(
    "/callback",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        response: {
          200: userResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Body: createUserPayload }>, reply) => {
      const user = await authService.syncUser(request.user.sub, request.body);

      reply.send(user);
    },
  );
};
