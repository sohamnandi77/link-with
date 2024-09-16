import { edgeDb } from "@/server/edge-db";

export const getLinkViaEdge = async (domain: string, keyword: string) => {
  try {
    const response = await edgeDb.link.findFirstOrThrow({
      where: {
        domain,
        keyword,
      },
    });

    return response;
  } catch {
    return null;
  }
};
