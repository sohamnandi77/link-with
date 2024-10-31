import { APP_DOMAIN_ROUTE } from "@/constants/config";
import { type UserProps } from "@/lib/types";
import { getDefaultWorkspaceEdge } from "@/middlewares/utils/get-default-workspace-edge";
import { parse } from "@/middlewares/utils/parse";
import { NextResponse, type NextRequest } from "next/server";

export default async function NewLinkMiddleware(
  req: NextRequest,
  user: UserProps,
) {
  const { fullPath } = parse(req);

  const defaultWorkspace = await getDefaultWorkspaceEdge(user);

  const searchParams = new URL(fullPath, APP_DOMAIN_ROUTE).searchParams;

  if (defaultWorkspace) {
    return NextResponse.redirect(
      new URL(
        `/${defaultWorkspace}?newLink=${searchParams.get("link") ?? true}${searchParams.has("domain") ? `&newLinkDomain=${searchParams.get("domain")}` : ""}`,
        req.url,
      ),
    );
  } else {
    return NextResponse.redirect(
      new URL(`/workspaces?newWorkspace=true`, req.url),
    );
  }
}
