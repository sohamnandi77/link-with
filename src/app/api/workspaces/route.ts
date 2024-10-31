import { FREE_WORKSPACES_LIMIT } from "@/constants/client-config";
import { env } from "@/env";
import { withSession } from "@/lib/auth/with-session";
import { isStored, storage } from "@/lib/storage";
import { createWorkspaceSchema, WorkspaceSchema } from "@/schema/workspaces";
import { db } from "@/server/db";
import { ApiError } from "@/services/errors";
import { checkIfUserExists } from "@/services/users/check-If-user-exists";
import { getWorkspacesWithMemberDetails } from "@/services/workspaces/get-workspaces-with-members-details";
import { waitUntil } from "@vercel/functions";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// GET /api/workspaces - get all projects for the current user
export const GET = withSession(async ({ session }) => {
  const workspaces = await getWorkspacesWithMemberDetails(session.user.id);
  return NextResponse.json(
    workspaces.map((workspace) => ({ ...workspace, id: `ws_${workspace.id}` })),
  );
});

// POST /api/workspaces - create a new workspace
export const POST = withSession(async ({ req, session }) => {
  if (!session.user.id) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to create a workspace.",
    });
  }

  const userExists = await checkIfUserExists(session.user.id);

  if (!userExists) {
    throw new ApiError({
      code: "NOT_FOUND",
      message: "Session expired. Please log in again.",
    });
  }

  const freeWorkspaces = await db.workspace.count({
    where: {
      plan: "FREE",
      users: {
        some: {
          userId: session.user.id,
          role: "ADMIN",
        },
      },
    },
  });

  if (freeWorkspaces >= FREE_WORKSPACES_LIMIT) {
    throw new ApiError({
      code: "LIMIT_EXCEEDED",
      message: `You can only create up to ${FREE_WORKSPACES_LIMIT} free workspaces. Additional workspaces require a paid plan.`,
    });
  }

  const { name, slug, logo } = await createWorkspaceSchema.parseAsync(
    await req.json(),
  );

  try {
    const workspaceResponse = await db.workspace.create({
      data: {
        name,
        slug,
        logo: logo && !isStored(logo) ? null : logo,
        users: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
        inviteCode: nanoid(24),
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
      include: {
        users: {
          where: {
            userId: session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    // if the user has no default workspace, set the new workspace as the default
    if (session.user.defaultWorkspace === null) {
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          defaultWorkspace: workspaceResponse.slug,
        },
      });
    }

    const uploadUrlKey = `logos/${workspaceResponse.id}_${nanoid(7)}`;
    const uploadedLogoUrl = `${env.STORAGE_BASE_URL}/${uploadUrlKey}`;

    waitUntil(
      Promise.all([
        // Upload image to R2 and update the link with the uploaded image URL when
        // proxy is enabled and image is set and not stored in R2
        ...(logo && !isStored(logo)
          ? [
              // upload image to R2
              storage.upload(uploadUrlKey, logo),
              // update the null image we set earlier to the uploaded image URL
              db.workspace.update({
                where: {
                  id: workspaceResponse.id,
                },
                data: {
                  logo: uploadedLogoUrl,
                },
              }),
            ]
          : []),
      ]),
    );

    return NextResponse.json(
      WorkspaceSchema.parse({
        ...workspaceResponse,
        logo:
          logo && !isStored(logo) ? uploadedLogoUrl : workspaceResponse.logo,
        id: `ws_${workspaceResponse.id}`,
      }),
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ("code" in error && (error as { code?: unknown }).code === "P2002") {
        throw new ApiError({
          code: "CONFLICT",
          message: "A workspace with this slug already exists.",
        });
      }

      throw new ApiError({
        code: "UNPROCESSABLE_ENTITY",
        message: error.message,
      });
    }

    throw new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }
});
