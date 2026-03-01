import prismaClient from "@/libs/prismaClient.js";
import type { NotePayload } from "./note.schema.js";

class NoteRepository {
  create(applicationId: string, payload: NotePayload) {
    return prismaClient.note.create({
      data: {
        date: new Date(payload.date),
        text: payload.text,
        applicationId,
      },
    });
  }

  delete(auth0Id: string, payloadId: string) {
    return prismaClient.note.deleteMany({
      where: {
        id: payloadId,
        application: {
          user: {
            auth0Id,
          },
        },
      },
    });
  }
}

export default new NoteRepository();
