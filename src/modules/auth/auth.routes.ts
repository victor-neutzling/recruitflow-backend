import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import {
  syncUserBodySchema,
  userResponseSchema,
  type syncUserPayload,
} from "./auth.schema.js";
import { AuthService } from "./auth.service.js";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const authService = new AuthService();

  fastify.put(
    "/callback",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        body: syncUserBodySchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Body: syncUserPayload }>, reply) => {
      const user = await authService.syncUser(request.user.sub, request.body);

      reply.send(user);
    },
  );
};
