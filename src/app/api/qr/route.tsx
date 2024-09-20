import { getSearchParams } from "@/lib/functions/urls";
import { QRCodeSVG } from "@/lib/qr";
import { getQRCodeQuerySchema } from "@/schema/qr";
import { handleAndReturnErrorResponse } from "@/services/errors";
import { ratelimitOrThrow } from "@/services/utils/rate-limit-or-throw";
import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    await ratelimitOrThrow(req, "qr");

    const params = getSearchParams(req.url);
    const { url, size, level, fgColor, bgColor, includeMargin } =
      getQRCodeQuerySchema.parse(params);

    return new ImageResponse(
      QRCodeSVG({
        value: url,
        size,
        level,
        includeMargin,
        fgColor,
        bgColor,
        // imageSettings: {
        //   src: logo,
        //   height: size / 4,
        //   width: size / 4,
        //   excavate: true,
        // },
      }),
      {
        width: size,
        height: size,
      },
    );
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
}
