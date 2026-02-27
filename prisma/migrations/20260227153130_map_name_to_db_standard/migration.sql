/*
  Warnings:

  - You are about to drop the `Deadline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deadline" DROP CONSTRAINT "Deadline_applicationId_fkey";

-- DropTable
DROP TABLE "Deadline";

-- CreateTable
CREATE TABLE "deadlines" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deadlines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
