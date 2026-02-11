import Fastify, { type FastifyError } from "fastify";

import fastifySensible from "@fastify/sensible";
import fastifyCors from "@fastify/cors";

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

async function main() {
  try {
    const host = await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`server started @ ${host}`);
  } catch (error) {
    console.log(error);
  }
}

main();
