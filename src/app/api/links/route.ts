import { withWorkspace } from "@/lib/auth/with-workspace";
import { getSearchParamsWithArray } from "@/lib/functions/urls";
import { ratelimit } from "@/lib/upstash";
import {
  createLinkBodySchema,
  getLinksQuerySchemaExtended,
} from "@/schema/links";
import { ApiError } from "@/services/errors";
import { createLink } from "@/services/links/create-link";
import { getLinksForWorkspace } from "@/services/links/get-links-for-workspace";
import { processLink } from "@/services/links/process-link";
import { parseRequestBody } from "@/services/utils/parse-request-body";
import { throwIfLinksUsageExceeded } from "@/services/utils/usage-checks";
import { NextResponse } from "next/server";

// GET /api/links – get all links for a workspace
export const GET = withWorkspace(
  async ({ req, headers, workspace }) => {
    const searchParams = getSearchParamsWithArray(req.url);

    const {
      domain,
      tagIds,
      search,
      sort,
      page,
      pageSize,
      userId,
      showArchived,
      withTags,
      includeUser,
    } = getLinksQuerySchemaExtended.parse(searchParams);

    if (!workspace) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Workspace not found",
      });
    }

    const response = await getLinksForWorkspace({
      workspaceId: workspace?.id,
      domain,
      tagIds,
      search,
      sort,
      page,
      pageSize,
      userId,
      showArchived,
      withTags,
      includeUser,
    });

    return NextResponse.json(response, { headers });
  },
  {
    requiredPermissions: ["LINKS_READ"],
  },
);

// POST /api/links – create a new link
export const POST = withWorkspace(
  async ({ req, headers, session, workspace }) => {
    if (workspace) {
      throwIfLinksUsageExceeded(workspace);
    }
    if (!session) {
      const ip = req.headers.get("x-forwarded-for") ?? "";
      const { success } = await ratelimit(10, "1 d").limit(ip);

      if (!success) {
        throw new ApiError({
          code: "RATE_LIMIT_EXCEEDED",
          message:
            "Rate limited – you can only create up to 10 links per day without an account.",
        });
      }
    }

    const body = createLinkBodySchema.parse(await parseRequestBody(req));

    const { link, error, code } = await processLink({
      payload: body,
      workspace,
      ...(session && { userId: session?.user.id }),
    });

    if (error != null) {
      throw new ApiError({
        code: code!,
        message: error,
      });
    }

    try {
      const response = await createLink(link);

      return NextResponse.json(response, { headers });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ("code" in error && error.code === "P2002") {
          throw new ApiError({
            code: "CONFLICT",
            message: "A link with this externalId already exists.",
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
  },
  {
    allowAnonymous: true,
    requiredPermissions: ["LINKS_CREATE"],
  },
);
