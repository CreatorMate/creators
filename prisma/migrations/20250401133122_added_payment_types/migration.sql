/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `instagram_account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "payment_type" AS ENUM ('BUDGET', 'HOURLY', 'DAILY');

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "job_postings" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payment_type" "payment_type" NOT NULL DEFAULT 'BUDGET',
ADD COLUMN     "videos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gear" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "visibility" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "instagram_account_handle_key" ON "instagram_account"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");
