/*
  Warnings:

  - The required column `id` was added to the `ProjectInvite` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "Link_archived_idx";

-- DropIndex
DROP INDEX "Link_clicks_idx";

-- DropIndex
DROP INDEX "Link_createdAt_idx";

-- DropIndex
DROP INDEX "Link_domain_idx";

-- DropIndex
DROP INDEX "Link_lastClicked_idx";

-- DropIndex
DROP INDEX "Link_password_idx";

-- DropIndex
DROP INDEX "Link_proxy_idx";

-- DropIndex
DROP INDEX "Link_userId_idx";

-- DropIndex
DROP INDEX "Link_workspaceId_idx";

-- DropIndex
DROP INDEX "LinkTag_linkId_idx";

-- DropIndex
DROP INDEX "LinkTag_tagId_idx";

-- DropIndex
DROP INDEX "ProjectInvite_workspaceId_idx";

-- DropIndex
DROP INDEX "RestrictedToken_userId_idx";

-- DropIndex
DROP INDEX "RestrictedToken_workspaceId_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- DropIndex
DROP INDEX "Tag_workspaceId_idx";

-- DropIndex
DROP INDEX "TwoFactorConfirmation_userId_idx";

-- DropIndex
DROP INDEX "User_defaultWorkspace_idx";

-- DropIndex
DROP INDEX "Workspace_usageLastChecked_idx";

-- DropIndex
DROP INDEX "WorkspaceUsers_workspaceId_idx";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "utmReferral" TEXT;

-- AlterTable
ALTER TABLE "ProjectInvite" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProjectInvite_pkey" PRIMARY KEY ("id");
