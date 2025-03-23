/*
  Warnings:

  - You are about to drop the column `cityName` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `countryName` on the `cities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[city_name,country_name]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city_name` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_name` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cities_cityName_countryName_key";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "cityName",
DROP COLUMN "countryName",
ADD COLUMN     "city_name" TEXT NOT NULL,
ADD COLUMN     "country_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cities_cityName_countryName_key" ON "cities"("city_name", "country_name");
