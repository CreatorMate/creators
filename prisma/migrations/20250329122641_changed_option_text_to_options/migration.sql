/*
  Warnings:

  - You are about to drop the column `option_text` on the `field_options` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "field_options" DROP COLUMN "option_text",
ADD COLUMN     "options" TEXT[];
