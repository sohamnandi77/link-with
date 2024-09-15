import { parse } from "@/middlewares/utils/parse";
import { type NextRequest, NextResponse } from "next/server";
import NewLinkMiddleware from "./new-link";
import { getUserViaToken } from "./utils/get-user-via-token";
import WorkspacesMiddleware from "./workspace";

export default async function AppMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);
  const user = await getUserViaToken(req);

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
    } else if (
      ["/", "/login", "/register", "/settings", "/upgrade"].includes(path) ||
      path.startsWith("/settings/")
    ) {
      return WorkspacesMiddleware(req, user);
    }
  }

  // otherwise, rewrite the path to /app
  return NextResponse.rewrite(new URL(`/app${fullPath}`, req.url));
}
