/*
  Warnings:

  - You are about to drop the column `portfolio` on the `job_applications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[job_post,user_id]` on the table `job_applications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('PENDING', 'DENIED', 'CANCELLED', 'HIRED');

-- AlterTable
ALTER TABLE "job_applications" DROP COLUMN "portfolio",
ADD COLUMN     "status" "application_status" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "job_applications_work_items" (
    "job_applications_id" INTEGER NOT NULL,
    "work_items_id" INTEGER NOT NULL,

    CONSTRAINT "job_applications_work_items_pkey" PRIMARY KEY ("job_applications_id","work_items_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_job_post_user_id_key" ON "job_applications"("job_post", "user_id");

-- AddForeignKey
ALTER TABLE "job_applications_work_items" ADD CONSTRAINT "job_applications_work_items_work_items_id_fkey" FOREIGN KEY ("work_items_id") REFERENCES "work_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications_work_items" ADD CONSTRAINT "job_applications_work_items_job_applications_id_fkey" FOREIGN KEY ("job_applications_id") REFERENCES "job_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
