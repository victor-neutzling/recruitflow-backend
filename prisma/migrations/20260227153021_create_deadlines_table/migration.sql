-- CreateTable
CREATE TABLE "Deadline" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
