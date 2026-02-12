import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import {
  createUserBodySchema,
  userResponseSchema,
  type createUserPayload,
} from "./user.schema.js";
import { UserService } from "./user.service.js";

export const userRoutes: FastifyPluginAsync = async (fastify, options) => {
  const userService = new UserService(fastify);

  fastify.get(
    "/login/:id",
    {
      schema: {
        response: {
          "200": userResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const data = await userService.login(request.params.id);

      reply.send(data);
    },
  );

  fastify.post(
    "/register",
    {
      schema: {
        body: createUserBodySchema,

        response: {
          "200": userResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Body: createUserPayload }>, reply) => {
      const data = await userService.registerUser(request.body);

      reply.send(data);
    },
  );
};
