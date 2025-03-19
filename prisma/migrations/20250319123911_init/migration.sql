-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('NEW', 'IN_REVIEW', 'IN_PROCESS', 'ACCEPTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "handle" VARCHAR,
    "based_in" VARCHAR,
    "project_types" TEXT[],
    "date_of_birth" VARCHAR,
    "additional_info" TEXT,
    "first_name" VARCHAR,
    "last_name" TEXT,
    "work_types" TEXT[],
    "email" TEXT NOT NULL,
    "status" "account_status" NOT NULL DEFAULT 'NEW',
    "picture" TEXT,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" SERIAL NOT NULL,
    "posted_by" UUID NOT NULL,
    "title" TEXT,
    "looking_for" TEXT,
    "date" TEXT,
    "description" TEXT,
    "place" TEXT,

    CONSTRAINT "job_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" SERIAL NOT NULL,
    "job_post" INTEGER,
    "user_id" UUID,
    "application" TEXT,
    "portfolio" TEXT,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram_account" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "verification_code" TEXT,
    "follower_count" INTEGER,
    "verified" BOOLEAN DEFAULT false,
    "sender_id" TEXT,
    "handle" TEXT NOT NULL,

    CONSTRAINT "instagram_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rights" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "rights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" UUID NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "role_rights" (
    "roleId" INTEGER NOT NULL,
    "rightId" INTEGER NOT NULL,

    CONSTRAINT "role_rights_pkey" PRIMARY KEY ("roleId","rightId")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rights_name_key" ON "rights"("name");

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_post_posted_by_fkey" FOREIGN KEY ("posted_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_post_fkey" FOREIGN KEY ("job_post") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instagram_account" ADD CONSTRAINT "instagram_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_rights" ADD CONSTRAINT "role_rights_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_rights" ADD CONSTRAINT "role_rights_rightId_fkey" FOREIGN KEY ("rightId") REFERENCES "rights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
