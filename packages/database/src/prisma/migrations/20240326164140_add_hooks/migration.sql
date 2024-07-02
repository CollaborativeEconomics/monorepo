-- CreateTable
CREATE TABLE "hooks" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orgId" VARCHAR(255) NOT NULL,
    "triggerName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hooks_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "actions" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hookId" UUID NOT NULL,
    "actionDefinition" JSONB NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_hookId_fkey" FOREIGN KEY ("hookId") REFERENCES "hooks"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
