/*
  Warnings:

  - You are about to drop the column `showAnalytics` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "showAnalytics",
ADD COLUMN     "androidDeepLink" BOOLEAN,
ADD COLUMN     "collectAnalytics" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "iosDeepLink" BOOLEAN;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "defaultExpirationLink" TEXT,
ADD COLUMN     "usageLastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "RestrictedToken_userId_idx" ON "RestrictedToken"("userId");

-- CreateIndex
CREATE INDEX "RestrictedToken_workspaceId_idx" ON "RestrictedToken"("workspaceId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "TwoFactorConfirmation_userId_idx" ON "TwoFactorConfirmation"("userId");

-- CreateIndex
CREATE INDEX "User_defaultWorkspace_idx" ON "User"("defaultWorkspace");

-- CreateIndex
CREATE INDEX "Workspace_usageLastChecked_idx" ON "Workspace"("usageLastChecked" ASC);
