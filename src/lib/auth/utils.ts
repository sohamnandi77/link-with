import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth/next";
import { type NextRequest } from "next/server";
import { ApiError } from "../../services/errors";

export interface Session {
  user: {
    email: string;
    id: string;
    name: string;
    image?: string;
    defaultWorkspace?: string;
  };
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getSession = async () => {
  return getServerSession(authOptions) as Promise<Session>;
};

export const getAuthTokenOrThrow = (
  req: Request | NextRequest,
  type: "Bearer" | "Basic" = "Bearer",
) => {
  const authorizationHeader = req.headers.get("Authorization");

  if (!authorizationHeader) {
    throw new ApiError({
      code: "BAD_REQUEST",
      message:
        "Misconfigured authorization header. Did you forget to add 'Bearer '?",
    });
  }

  return authorizationHeader.replace(`${type} `, "");
};
