import Fastify, { type FastifyError } from "fastify";
import "dotenv/config";

import fastifySensible from "@fastify/sensible";
import fastifyCors from "@fastify/cors";

import auth0 from "@auth0/auth0-fastify-api";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(fastifySensible);
fastify.register(fastifyCors, {
  origin: ["http://localhost:5173"],
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

fastify.get("/", (_, reply) => {
  reply.send({ ok: true });
});

fastify.get(
  "/test-protected",
  {
    preHandler: fastify.requireAuth({
      scopes: ["read:applications"],
    }),
  },
  (request, reply) => {
    reply.send({ auth: true, token: request.headers.authorization });
  },
);

async function main() {
  try {
    const host = await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`server started @ ${host}`);
  } catch (error) {
    console.log(error);
  }
}

main();
