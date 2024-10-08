import { truncate } from "@/lib/functions/truncate";
import { getParamsFromURL } from "@/lib/functions/urls";
import { type ProcessedLinkProps } from "@/lib/types";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { combineTagIds } from "../utils/combine-tag-ids";
import { transformLink } from "./transform-link";
import { updateLinksUsage } from "./update-links-usage";

export async function createLink(link: ProcessedLinkProps) {
  const {
    keyword,
    originalLink,
    expiredLinkByDate,
    ogTitle,
    ogDescription,
    geo,
  } = link;

  const combinedTagIds = combineTagIds(link);

  const { utmSource, utmMedium, utmCampaign, utmTerm, utmContent } =
    getParamsFromURL(originalLink);

  const { tagNames, userId, ...rest } = link;

  const response = await db.link.create({
    data: {
      ...rest,
      keyword,
      ogTitle: truncate(ogTitle, 120),
      ogDescription: truncate(ogDescription, 240),
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      expiredLinkByDate: expiredLinkByDate ? new Date(expiredLinkByDate) : null,
      geo: geo ?? Prisma.JsonNull,
      userId: userId!,
      createdBy: userId!,
      updatedBy: userId!,

      tags: {
        ...(tagNames?.length && link.workspaceId
          ? {
              create: tagNames.map((tagName) => ({
                tag: {
                  connect: {
                    name_workspaceId: {
                      name: tagName,
                      workspaceId: link.workspaceId!,
                    },
                  },
                },
                name: tagName,
                createdBy: userId!,
                updatedBy: userId!,
              })),
            }
          : {}),
        ...(combinedTagIds && combinedTagIds.length > 0
          ? {
              createMany: {
                data: combinedTagIds.map((tagId) => ({
                  tagId,
                  name: "",
                  createdBy: userId!,
                  updatedBy: userId!,
                })),
              },
            }
          : {}),
      },
    },
    include: {
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });

  if (link.workspaceId) {
    await updateLinksUsage({
      workspaceId: link.workspaceId,
      increment: 1,
    });
  }

  return {
    ...transformLink(response),
  };
}
