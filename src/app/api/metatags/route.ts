import { getUrlQuerySchema } from "@/schema/links";
import { handleAndReturnErrorResponse } from "@/services/errors";
import { ratelimitOrThrow } from "@/services/utils/rate-limit-or-throw";
import { NextResponse, type NextRequest } from "next/server";
import { getMetaTags } from "./utils";

export async function GET(req: NextRequest) {
  try {
    await ratelimitOrThrow(req, "metatags");

    const { url } = getUrlQuerySchema.parse({
      url: req.nextUrl.searchParams.get("url"),
    });

    const metatags = await getMetaTags(url);
    return NextResponse.json(
      {
        ...metatags,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
