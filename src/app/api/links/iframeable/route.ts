import { isIframeable } from "@/lib/functions/is-iframeable";
import { getDomainQuerySchema, getUrlQuerySchema } from "@/schema/links";
import { handleAndReturnErrorResponse } from "@/services/errors";
import { ratelimitOrThrow } from "@/services/utils/rate-limit-or-throw";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { url, domain } = getUrlQuerySchema.and(getDomainQuerySchema).parse({
      url: req.nextUrl.searchParams.get("url"),
      domain: req.nextUrl.searchParams.get("domain"),
    });

    await ratelimitOrThrow(req, "iframeable");

    const iframeable = await isIframeable({ url, requestDomain: domain });

    return NextResponse.json({ iframeable });
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
}
