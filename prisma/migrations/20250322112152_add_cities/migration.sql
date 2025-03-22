-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "cityName" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_cityName_countryName_key" ON "cities"("cityName", "countryName");
