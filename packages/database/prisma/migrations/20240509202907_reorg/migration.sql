-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "categoryId" UUID;

-- AlterTable
ALTER TABLE "storymedia" ADD COLUMN     "mime" VARCHAR(60);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "wallet" DROP NOT NULL;

-- CreateTable
CREATE TABLE "cronjobs" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cron" VARCHAR(200) NOT NULL,
    "status" INTEGER NOT NULL,
    "result" JSONB NOT NULL,

    CONSTRAINT "cronjobs_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "initiatives"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
