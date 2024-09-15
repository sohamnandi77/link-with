import { edgeDb } from "@/server/edge-db";

export const getLinkViaEdge = async (domain: string, key: string) => {
  try {
    const response = await edgeDb.link.findFirstOrThrow({
      where: {
        domain,
        keyword: key,
      },
    });

    return response;
  } catch {
    return null;
  }
};
