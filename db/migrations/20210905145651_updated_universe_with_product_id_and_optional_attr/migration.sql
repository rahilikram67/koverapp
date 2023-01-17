/*
  Warnings:

  - You are about to drop the column `retrievedDate` on the `ProductAssetValue` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Universe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductAssetValue" DROP COLUMN "retrievedDate",
ADD COLUMN     "retrievalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "currency" SET DEFAULT E'SGD';

-- AlterTable
ALTER TABLE "Universe" ADD COLUMN     "productId" TEXT NOT NULL,
ALTER COLUMN "variant" DROP NOT NULL,
ALTER COLUMN "manufactureDate" DROP NOT NULL,
ALTER COLUMN "manufactureDateStr" DROP NOT NULL;
