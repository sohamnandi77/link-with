import { type NextRequest, NextResponse } from "next/server";

import { getUserViaToken } from "@/middlewares/utils/get-user-via-token";
import { parse } from "@/middlewares/utils/parse";
import NewLinkMiddleware from "./new-link";
import WorkspacesMiddleware from "./workspace";

export default async function AppMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);
  const user = await getUserViaToken(req);

  console.log("user", user);

  // if there's no user and the path isn't /login or /register, redirect to /login
  if (
    !user &&
    path !== "/login" &&
    path !== "/register" &&
    !path.startsWith("/auth/reset-password/")
  ) {
    return NextResponse.redirect(
      new URL(
        `/login${path === "/" ? "" : `?next=${encodeURIComponent(fullPath)}`}`,
        req.url,
      ),
    );

    // if there's a user
  } else if (user) {
    if (path === "/new") {
      return NewLinkMiddleware(req, user);
    }
    /* Onboarding redirects
        - User was created less than a day ago
        - User is not invited to a workspace (redirect straight to the workspace)
        - The path does not start with /onboarding
        - The user has not completed the onboarding step
      */
    // if (
    //   new Date(user.createdAt).getTime() > Date.now() - 60 * 60 * 24 * 1000 &&
    //   // !isWorkspaceInvite &&
    //   !path.startsWith("/onboarding")
    // ) {
    //   return NextResponse.redirect(new URL(`/onboarding/welcome`, req.url));
    // }

    if (
      ["/", "/login", "/register", "/settings", "/upgrade"].includes(path) ||
      path.startsWith("/settings/")
    ) {
      return WorkspacesMiddleware(req, user);
    }
  }

  // otherwise, rewrite the path to /app
  return NextResponse.rewrite(new URL(`/app${fullPath}`, req.url));
}
