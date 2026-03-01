import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { NoteService } from "./note.service.js";
import {
  noteBodySchema,
  noteResponseSchema,
  type NotePayload,
} from "./note.schema.js";

export const noteRoutes: FastifyPluginAsync = async (fastify) => {
  const noteService = new NoteService(fastify.httpErrors);

  fastify.post(
    "/:applicationId",
    {
      preHandler: fastify.requireAuth(),
      schema: {
        body: noteBodySchema,
        response: {
          201: noteResponseSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { applicationId: string };
        Body: NotePayload;
      }>,
      reply,
    ) => {
      const note = await noteService.registerNote(
        request.body,
        request.params.applicationId,
      );

      const parsedNote = { ...note, date: note.date.toISOString() };

      reply.code(201).send(parsedNote);
    },
  );

  fastify.delete<{
    Params: { applicationId: string; noteId: string };
  }>(
    "/:noteId",
    { preHandler: fastify.requireAuth() },
    async (request, reply) => {
      await noteService.deleteNote(request.user.sub, request.params.noteId);

      reply.code(204).send();
    },
  );
};
