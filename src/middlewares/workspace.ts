import { type UserProps } from "@/lib/types";
import { getDefaultWorkspaceEdge } from "@/middlewares/utils/get-default-workspace-edge";
import { parse } from "@/middlewares/utils/parse";
import { type NextRequest, NextResponse } from "next/server";

export default async function WorkspacesMiddleware(
  req: NextRequest,
  user: UserProps,
) {
  const { path, searchParamsString } = parse(req);

  const defaultWorkspace = await getDefaultWorkspaceEdge(user);

  if (defaultWorkspace) {
    let redirectPath = path;
    if (["/", "/login", "/register"].includes(path)) {
      redirectPath = "";
    }
    return NextResponse.redirect(
      new URL(
        `/${defaultWorkspace}${redirectPath}${searchParamsString}`,
        req.url,
      ),
    );
  } else {
    return NextResponse.redirect(new URL("/workspaces", req.url));
  }
}
