import "dotenv/config";

import Fastify, { type FastifyError } from "fastify";

import fastifySensible from "@fastify/sensible";
import fastifyCors from "@fastify/cors";

import auth0 from "@auth0/auth0-fastify-api";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { applicationRoutes } from "./modules/application/application.routes.js";
import { applicationLinkRoutes } from "./modules/application-link/application-link.routes.js";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(fastifySensible);

fastify.register(fastifyCors, {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  fastify.log.error("auth0 domain or audience missing from .env file.");

  process.exit(1);
}

await fastify.register(auth0, {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
});

fastify.setErrorHandler((error: FastifyError, request, reply) => {
  request.log.error(error);

  const statusCode = error.statusCode ?? 500;

  reply.status(statusCode).send({
    statusCode,
    error: error.name ?? "Error",
    message: statusCode === 500 ? "Internal server error" : error.message,
  });
});

fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(applicationRoutes, { prefix: "/applications" });
fastify.register(applicationLinkRoutes, {
  prefix: "/applications/:applicationId/links",
});

async function main() {
  try {
    const host = await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`server started @ ${host}`);
  } catch (error) {
    console.log(error);
  }
}

main();
