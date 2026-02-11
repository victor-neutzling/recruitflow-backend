-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "auth0_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "position" TEXT,
    "salary" DOUBLE PRECISION,
    "salaryType" TEXT,
    "currency" TEXT,
    "work_model" TEXT,
    "regime" TEXT,
    "description" TEXT,
    "applied_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_links" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "label" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "application_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "users"("auth0_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_links" ADD CONSTRAINT "application_links_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
