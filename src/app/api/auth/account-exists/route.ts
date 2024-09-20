import { ratelimit } from "@/lib/upstash";
import { ERROR_HTTP_STATUS } from "@/services/errors";
import { getUserByEmailEdge } from "@/services/users/get-user-by-email-edge";
import { ipAddress } from "@vercel/edge";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

// POST /api/auth/account-exists - check if an account exists for a given email
export async function POST(req: NextRequest) {
  const ip = ipAddress(req);
  const { success } = await ratelimit(8, "1 m").limit(`account-exists:${ip}`);
  if (!success) {
    return new Response("Rate limit exceeded. Please try again later.", {
      status: ERROR_HTTP_STATUS.RATE_LIMIT_EXCEEDED,
    });
  }

  const { email } = (await req.json()) as { email: string };

  const user = await getUserByEmailEdge(email);

  if (user) {
    return NextResponse.json({
      accountExists: true,
      hasPassword: !!user.password,
    });
  }

  return NextResponse.json({ accountExists: false, hasPassword: false });
}
