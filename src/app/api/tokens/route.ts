import { TOKEN_PREFIX } from "@/constants/config";
import { getCurrentPlan } from "@/constants/pricing";
import { hashToken } from "@/lib/auth/hash-token";
import { withWorkspace } from "@/lib/auth/with-workspace";
import { validateScopesForRole } from "@/lib/rbac/permissions";
import { createTokenSchema, tokenSchema } from "@/schema/token";
import { db } from "@/server/db";
import { ApiError } from "@/services/errors";
import { parseRequestBody } from "@/services/utils/parse-request-body";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// GET /api/tokens - get all tokens for a workspace
export const GET = withWorkspace(
  async ({ workspace }) => {
    if (!workspace) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Workspace not found.",
      });
    }

    const tokens = await db.restrictedToken.findMany({
      where: {
        workspaceId: workspace.id,
      },
      select: {
        id: true,
        name: true,
        scopes: true,
        lastUsed: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [{ lastUsed: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json(tokenSchema.array().parse(tokens));
  },
  {
    requiredPermissions: ["TOKENS_READ"],
  },
);

// POST /api/tokens – create a new token for a workspace
export const POST = withWorkspace(
  async ({ req, session, workspace }) => {
    if (!session?.user) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Unauthorized: Login required.",
      });
    }
    if (!workspace) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Workspace not found.",
      });
    }

    const { name, scopes } = createTokenSchema.parse(
      await parseRequestBody(req),
    );

    const { role } = await db.workspaceUsers.findUniqueOrThrow({
      where: {
        userId_workspaceId: {
          userId: session?.user.id ?? "",
          workspaceId: workspace?.id ?? "",
        },
      },
      select: {
        role: true,
      },
    });

    // Only workspace owners can create machine users
    if (role !== "ADMIN") {
      throw new ApiError({
        code: "FORBIDDEN",
        message: "Only workspace owners can create machine users.",
      });
    }

    if (!validateScopesForRole(scopes ?? [], role)) {
      throw new ApiError({
        code: "UNPROCESSABLE_ENTITY",
        message: "Some of the given scopes are not available for your role.",
      });
    }

    // Create token
    const token = `${TOKEN_PREFIX}${nanoid(24)}`;
    const hashedKey = await hashToken(token);

    await db.restrictedToken.create({
      data: {
        name,
        hashedKey,
        userId: session?.user.id ?? "",
        workspaceId: workspace?.id ?? "",
        rateLimit: getCurrentPlan(workspace.plan).limits.api,
        scopes:
          scopes && scopes.length > 0 ? [...new Set(scopes)].join(" ") : null,
      },
    });

    return NextResponse.json({ token });
  },
  {
    requiredPermissions: ["TOKENS_CREATE"],
  },
);
