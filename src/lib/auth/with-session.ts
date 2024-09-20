import { TOKEN_PREFIX } from "@/constants/config";
import { db } from "@/server/db";
import { ApiError, handleAndReturnErrorResponse } from "@/services/errors";
import { type AxiomRequest, withAxiom } from "next-axiom";
import { getSearchParams } from "../functions/urls";
import { ratelimit } from "../upstash";
import { hashToken } from "./hash-token";
import { getSession, type Session } from "./utils";

type WithSessionHandler = ({
  req,
  params,
  searchParams,
  session,
}: {
  req: Request;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  session: Session;
}) => Promise<Response>;

export const withSession = (handler: WithSessionHandler) =>
  withAxiom(
    async (
      req: AxiomRequest,
      { params = {} }: { params: Record<string, string> | undefined },
    ) => {
      try {
        let session: Session | null;
        let headers = {};
        let token;

        const authorizationHeader = req.headers.get("Authorization");
        if (authorizationHeader) {
          if (!authorizationHeader.includes("Bearer ")) {
            throw new ApiError({
              code: "BAD_REQUEST",
              message:
                "Misconfigured authorization header. Did you forget to add 'Bearer '?",
            });
          }
          const apiKey = authorizationHeader.replace("Bearer ", "");
          const isRestrictedToken = apiKey?.startsWith(TOKEN_PREFIX);

          const { success, limit, reset, remaining } = await ratelimit(
            600,
            "1 m",
          ).limit(apiKey);

          headers = {
            "Retry-After": reset.toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          };

          if (!success) {
            return new Response("Too many requests.", {
              status: 429,
              headers,
            });
          }

          const hashedKey = await hashToken(apiKey);
          if (isRestrictedToken) {
            token = await db.restrictedToken.findUnique({
              where: {
                hashedKey,
              },
              select: {
                ...(isRestrictedToken && {
                  scopes: true,
                  rateLimit: true,
                  workspaceId: true,
                  expires: true,
                }),
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    defaultWorkspace: true,
                  },
                },
              },
            });
          }

          if (!token?.user) {
            throw new ApiError({
              code: "UNAUTHORIZED",
              message: "Unauthorized: Invalid API key.",
            });
          }

          if (token.expires && token.expires < new Date()) {
            throw new ApiError({
              code: "UNAUTHORIZED",
              message: "Unauthorized: Access token expired.",
            });
          }

          if (isRestrictedToken) {
            await db.restrictedToken.update({
              where: {
                hashedKey,
              },
              data: {
                lastUsed: new Date(),
              },
            });
          }

          session = {
            user: {
              id: token.user.id,
              name: token.user.name ?? "",
              email: token.user.email ?? "",
              image: token.user.image ?? "",
              defaultWorkspace: token.user.defaultWorkspace ?? "",
            },
          };
        } else {
          session = await getSession();
          if (!session?.user.id) {
            throw new ApiError({
              code: "UNAUTHORIZED",
              message: "Unauthorized: Login required.",
            });
          }
        }

        if (!session) {
          throw new ApiError({
            code: "UNAUTHORIZED",
            message: "Unauthorized: Default workspace not set.",
          });
        }

        const searchParams = getSearchParams(req.url);
        return await handler({ req, params, searchParams, session });
      } catch (error) {
        req.log.error(error as string);
        return handleAndReturnErrorResponse(error);
      }
    },
  );
