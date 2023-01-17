/*
  Warnings:

  - Added the required column `apiKey` to the `Bestbuy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smtpHost` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smtpPassword` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smtpPort` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smtpUsername` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Source" AS ENUM ('BEST_BUY', 'HARRODS');

-- AlterTable
ALTER TABLE "Bestbuy" ADD COLUMN     "apiKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "smtpHost" TEXT NOT NULL,
ADD COLUMN     "smtpPassword" TEXT NOT NULL,
ADD COLUMN     "smtpPort" INTEGER NOT NULL,
ADD COLUMN     "smtpUsername" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductAssetValue" (
    "id" SERIAL NOT NULL,
    "retrievedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetValue" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "conversionRate" DOUBLE PRECISION,
    "convertedAssetValue" DOUBLE PRECISION,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "universeId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Universe" (
    "id" SERIAL NOT NULL,
    "underwriterClassId" TEXT NOT NULL,
    "categories" TEXT[],
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "variant" TEXT NOT NULL,
    "manufactureDate" TIMESTAMP(3) NOT NULL,
    "manufactureDateStr" TEXT NOT NULL,
    "source" "Source" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mapping" (
    "id" SERIAL NOT NULL,
    "underwriterClassId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "manufactureDate" TEXT NOT NULL,
    "assetValue" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "mappedTo" "Source" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductAssetValue" ADD FOREIGN KEY ("universeId") REFERENCES "Universe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
