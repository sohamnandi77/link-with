/*
  Warnings:

  - You are about to drop the column `androidDeepLink` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `androidTargeting` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `geoTargeting` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `iosDeepLink` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `iosTargeting` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "androidDeepLink",
DROP COLUMN "androidTargeting",
DROP COLUMN "geoTargeting",
DROP COLUMN "iosDeepLink",
DROP COLUMN "iosTargeting",
ADD COLUMN     "android" TEXT,
ADD COLUMN     "geo" JSONB,
ADD COLUMN     "ios" TEXT;
