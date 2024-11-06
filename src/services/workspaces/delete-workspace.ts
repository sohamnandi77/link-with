import { SHORT_DOMAIN } from "@/constants/config";
import { env } from "@/env";
import { storage } from "@/lib/storage";
import { type WorkspaceProps } from "@/lib/types";
import { db } from "@/server/db";
import { waitUntil } from "@vercel/functions";

export async function deleteWorkspace(
  workspace: Pick<WorkspaceProps, "id" | "slug" | "logo">,
) {
  // const [customDomains] =
  await Promise.all([
    // db.domain.findMany({
    //   where: {
    //     workspaceId: workspace.id,
    //   },
    //   select: {
    //     slug: true,
    //   },
    // }),
    db.link.findMany({
      where: {
        workspaceId: workspace.id,
        domain: {
          in: [SHORT_DOMAIN],
        },
      },
      select: {
        id: true,
        domain: true,
        keyword: true,
        originalLink: true,
        tags: {
          select: {
            tagId: true,
          },
        },
        proxy: true,
        ogImage: true,
        workspaceId: true,
        createdAt: true,
      },
    }),
  ]);

  const response = await db.workspaceUsers.deleteMany({
    where: {
      workspaceId: workspace.id,
    },
  });

  waitUntil(
    (async () => {
      // const linksByDomain: Record<string, string[]> = {};
      // defaultDomainLinks.forEach(async (link) => {
      //   const { domain, key } = link;

      //   if (!linksByDomain[domain]) {
      //     linksByDomain[domain] = [];
      //   }
      //   linksByDomain[domain].push(key.toLowerCase());
      // });

      // const pipeline = redis.pipeline();

      // Object.entries(linksByDomain).forEach(([domain, links]) => {
      //   pipeline.hdel(domain.toLowerCase(), ...links);
      // });

      // delete all domains, links, and uploaded images associated with the workspace
      // await Promise.allSettled([
      // ...customDomains.map(({ slug }) => deleteDomainAndLinks(slug)),
      // delete all default domain links from redis
      // pipeline.exec(),
      // record deletes in Tinybird for default domain links
      // recordLink(
      //   defaultDomainLinks.map((link) => ({
      //     link_id: link.id,
      //     domain: link.domain,
      //     keyword: link.key,
      //     url: link.url,
      //     tag_ids: link.tags.map((tag) => tag.tagId),
      //     workspace_id: link.workspaceId,
      //     created_at: link.createdAt,
      //     deleted: true,
      //   })),
      // ),
      // remove all images from R2
      // ...defaultDomainLinks.map(({ id, image }) =>
      //   image?.startsWith(`${env.STORAGE_BASE_URL}/images/${id}`)
      //     ? storage.delete(image.replace(`${env.STORAGE_BASE_URL}/`, ""))
      //     : Promise.resolve(),
      // ),
      // ]);

      await Promise.allSettled([
        // delete workspace logo if it's a custom logo stored in R2
        workspace.logo &&
          workspace.logo.startsWith(
            `${env.STORAGE_BASE_URL}/logos/${workspace.id}`,
          ) &&
          storage.delete(
            workspace.logo.replace(`${env.STORAGE_BASE_URL}/`, ""),
          ),
        // if they have a Stripe subscription, cancel it
        // workspace.stripeId && cancelSubscription(workspace.stripeId),
        // set the referral link to `/deleted/[slug]`
        // workspace.referralLinkId &&
        //   dub.links.update(workspace.referralLinkId, {
        //     kwyword: `/deleted/${workspace.slug}-${workspace.id}`,
        //     archived: true,
        //     identifier: `/deleted/${workspace.slug}-${workspace.id}`,
        //   }),
        // delete the workspace
        db.workspace.delete({
          where: {
            slug: workspace.slug,
          },
        }),
        db.user.updateMany({
          where: {
            defaultWorkspace: workspace.slug,
          },
          data: {
            defaultWorkspace: null,
          },
        }),
      ]);
    })(),
  );

  return response;
}
