/*
  Warnings:

  - Added the required column `active` to the `job_postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `available_slots` to the `job_postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `job_postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closes_on` to the `job_postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creative_lead_id` to the `job_postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `job_postings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_postings" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "available_slots" INTEGER NOT NULL,
ADD COLUMN     "client_id" INTEGER NOT NULL,
ADD COLUMN     "closes_on" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creative_lead_id" UUID NOT NULL,
ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "requirements" TEXT[];

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "headquarters" TEXT NOT NULL,
    "employees" TEXT NOT NULL,
    "industry" TEXT,
    "linkedin" TEXT,
    "wikipedia" TEXT,
    "x" TEXT,
    "image" TEXT NOT NULL,
    "website" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_post_client_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_creative_lead_id_fkey" FOREIGN KEY ("creative_lead_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
