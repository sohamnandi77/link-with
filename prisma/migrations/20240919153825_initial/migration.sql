/*
  Warnings:

  - You are about to drop the column `showAnalytics` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "showAnalytics",
ADD COLUMN     "collectAnalytics" BOOLEAN NOT NULL DEFAULT false;
