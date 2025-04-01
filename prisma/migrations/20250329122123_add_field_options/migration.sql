-- CreateTable
CREATE TABLE "field_options" (
    "id" TEXT NOT NULL,
    "field_key" TEXT NOT NULL,
    "options" TEXT[],
    CONSTRAINT "field_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "field_options_field_key_key" ON "field_options"("field_key");

-- CreateIndex
CREATE INDEX "field_options_field_key_idx" ON "field_options"("field_key");
