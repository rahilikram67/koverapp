/*
  Warnings:

  - Made the column `currency` on table `Mapping` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mapping" ALTER COLUMN "currency" SET NOT NULL;
