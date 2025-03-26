-- CreateTable
CREATE TABLE "work_items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "link_to" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "work_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
