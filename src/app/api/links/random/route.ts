import { getSearchParams } from "@/lib/functions/urls";
import { domainKeySchema } from "@/schema/links";
import { handleAndReturnErrorResponse } from "@/services/errors";
import { getRandomKey } from "@/services/links/get-random-key";
import { ratelimitOrThrow } from "@/services/utils/rate-limit-or-throw";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/links/random – get a random available link key for a given domain
export const GET = async (req: NextRequest) => {
  try {
    const searchParams = getSearchParams(req.url);
    const { domain } = domainKeySchema
      .pick({ domain: true })
      .parse(searchParams);

    await ratelimitOrThrow(req, "links-random");

    const response = await getRandomKey({ domain });
    return NextResponse.json(response);
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
};
