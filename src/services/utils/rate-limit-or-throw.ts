import { ratelimit } from "@/lib/upstash";
import { ipAddress } from "@vercel/edge";
import { getToken } from "next-auth/jwt";
import { type NextRequest } from "next/server";
import { env } from "process";
import { ApiError } from "../errors";

export const ratelimitOrThrow = async (
  req: NextRequest,
  identifier?: string,
) => {
  // Rate limit if user is not logged in
  const session = await getToken({
    req,
    secret: env.NEXTAUTH_SECRET,
  });
  if (!session?.email) {
    const ip = ipAddress(req);
    const { success } = await ratelimit().limit(
      `${identifier ?? "ratelimit"}:${ip}`,
    );
    if (!success) {
      throw new ApiError({
        code: "RATE_LIMIT_EXCEEDED",
        message: "Rate limit exceeded. Please try again later.",
      });
    }
  }
};
