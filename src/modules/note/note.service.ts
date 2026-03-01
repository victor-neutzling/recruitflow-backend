import type { FastifyInstance } from "fastify";

import repo from "./note.repository.js";
import type { NotePayload } from "./note.schema.js";

export class NoteService {
  constructor(private httpErrors: FastifyInstance["httpErrors"]) {}

  registerNote(payload: NotePayload, applicationId: string) {
    return repo.create(applicationId, payload);
  }

  async deleteNote(auth0Id: string, noteId: string) {
    const data = await repo.delete(auth0Id, noteId);

    if (!data.count) {
      this.httpErrors.notFound();
    }

    return data;
  }
}
