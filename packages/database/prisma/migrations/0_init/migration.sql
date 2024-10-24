-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('Arbitrum', 'Avalanche', 'Base', 'Binance', 'Celo', 'EOS', 'Ethereum', 'Filecoin', 'Flare', 'Optimism', 'Polygon', 'Stellar', 'XDC', 'XRPL');

-- CreateEnum
CREATE TYPE "CreditType" AS ENUM ('None', 'Carbon', 'Plastic', 'Biodiversity');

-- CreateTable
CREATE TABLE "accounts" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "access_token" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "scope" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMPTZ(6),
    "token_type" VARCHAR(255),
    "type" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "id_token" VARCHAR(255),
    "session_state" VARCHAR(255),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "color" VARCHAR(20),
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "slug" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR(255) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "credits" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "providerId" UUID NOT NULL,
    "initiativeId" UUID NOT NULL,
    "type" "CreditType" NOT NULL,
    "description" TEXT NOT NULL,
    "currency" VARCHAR(20) NOT NULL,
    "value" INTEGER NOT NULL,
    "start" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish" TIMESTAMPTZ(6),
    "filled" BOOLEAN NOT NULL DEFAULT false,
    "current" INTEGER DEFAULT 0,
    "goal" INTEGER DEFAULT 0,

    CONSTRAINT "credits_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "donations" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" UUID NOT NULL,
    "chapterId" UUID,
    "initiativeId" UUID,
    "userId" UUID,
    "paytype" VARCHAR(20),
    "network" VARCHAR(20),
    "wallet" VARCHAR(255),
    "amount" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "usdvalue" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "asset" VARCHAR(255),
    "issuer" VARCHAR(255),
    "status" INTEGER NOT NULL DEFAULT 0,
    "categoryId" UUID,
    "chain" "Chain",

    CONSTRAINT "donations_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "initiatives" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "slug" VARCHAR(255) NOT NULL,
    "organizationId" UUID NOT NULL,
    "chapterId" UUID,
    "categoryId" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "defaultAsset" VARCHAR(255) NOT NULL,
    "imageUri" VARCHAR(255),
    "start" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish" TIMESTAMPTZ(6),
    "tag" INTEGER NOT NULL,
    "contractnft" VARCHAR(255),
    "wallet" VARCHAR(255),
    "country" VARCHAR(255),
    "donors" INTEGER NOT NULL DEFAULT 0,
    "institutions" INTEGER NOT NULL DEFAULT 0,
    "goal" INTEGER NOT NULL DEFAULT 0,
    "received" INTEGER NOT NULL DEFAULT 0,
    "lastmonth" INTEGER NOT NULL DEFAULT 0,
    "contractcredit" VARCHAR(255),

    CONSTRAINT "initiatives_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "initiativetiers" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" UUID,
    "chapterId" UUID,
    "initiativeId" UUID,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "asset" VARCHAR(255),
    "currency" VARCHAR(255),
    "issuer" VARCHAR(255),
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "initiativetiers_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "nft_data" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donorAddress" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "initiativeId" UUID,
    "metadataUri" VARCHAR(255) NOT NULL,
    "imageUri" VARCHAR(255) NOT NULL,
    "coinNetwork" VARCHAR(20),
    "coinLabel" VARCHAR(20),
    "coinSymbol" VARCHAR(20),
    "coinValue" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "usdValue" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "tokenId" VARCHAR(255) NOT NULL,
    "offerId" VARCHAR(255),
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "nft_data_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "slug" VARCHAR(255) NOT NULL,
    "EIN" VARCHAR(20),
    "country" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(255),
    "mailingAddress" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40),
    "email" VARCHAR(100) NOT NULL,
    "url" VARCHAR(255),
    "categoryId" UUID,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "donors" INTEGER NOT NULL DEFAULT 0,
    "institutions" INTEGER NOT NULL DEFAULT 0,
    "received" INTEGER NOT NULL DEFAULT 0,
    "lastmonth" INTEGER NOT NULL DEFAULT 0,
    "twitter" VARCHAR(255),
    "facebook" VARCHAR(255),
    "goal" INTEGER DEFAULT 0,
    "background" VARCHAR(255),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "providers" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "apiUrl" VARCHAR(255) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "expires" TIMESTAMPTZ(6),
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "stories" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" UUID NOT NULL,
    "initiativeId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "amount" INTEGER NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "tokenId" VARCHAR(255),
    "metadata" VARCHAR(255),

    CONSTRAINT "stories_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "storymedia" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "storyId" UUID NOT NULL,
    "media" VARCHAR(255) NOT NULL,

    CONSTRAINT "storypics_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "users" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "api_key" VARCHAR(255),
    "api_key_enabled" BOOLEAN DEFAULT false,
    "email" VARCHAR(100),
    "emailVerified" BOOLEAN DEFAULT false,
    "image" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "wallet" VARCHAR(255) NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "userwallets" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "address" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "chain" "Chain" NOT NULL,

    CONSTRAINT "userwallets_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "identifier" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "initiativeId" UUID,
    "address" VARCHAR(255) NOT NULL,
    "chain" "Chain" NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "artworks" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "tokenId" VARCHAR(255) NOT NULL,
    "authorId" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "categoryId" UUID,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "artwork" VARCHAR(255) NOT NULL,
    "metadata" VARCHAR(255) NOT NULL,
    "media" VARCHAR(255) NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "royalties" INTEGER NOT NULL DEFAULT 0,
    "forsale" BOOLEAN NOT NULL DEFAULT false,
    "copies" INTEGER NOT NULL DEFAULT 0,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "tags" VARCHAR(255),

    CONSTRAINT "artworks_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "collections" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactive" BOOLEAN NOT NULL DEFAULT false,
    "curated" BOOLEAN NOT NULL DEFAULT false,
    "authorId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "taxon" VARCHAR(255) NOT NULL,
    "nftcount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "offers" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" INTEGER NOT NULL DEFAULT 0,
    "artworkId" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "beneficiaryId" UUID,
    "buyerId" UUID,
    "sellerId" UUID NOT NULL,
    "offerId" VARCHAR(255) NOT NULL,
    "tokenId" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "royalties" INTEGER NOT NULL DEFAULT 0,
    "wallet" VARCHAR(255) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "settings" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(40) NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "initiatives_tag_key" ON "initiatives"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "nft_data_tokenId_key" ON "nft_data"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_api_key_key" ON "users"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "settings_name_key" ON "settings"("name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "initiatives"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiativetiers" ADD CONSTRAINT "initiativetiers_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "initiatives"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_data" ADD CONSTRAINT "nft_data_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "initiatives"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_data" ADD CONSTRAINT "nft_data_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nft_data" ADD CONSTRAINT "nft_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "initiatives"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userwallets" ADD CONSTRAINT "userwallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "initiatives"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "organizations"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artworks"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "organizations"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

