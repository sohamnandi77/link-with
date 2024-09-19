import { env } from "@/env";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const createPrismaEdgeClient = () => {
  const connectionString = `${env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // omit: {
    //   user: { password: true },
    //   restrictedToken: { hashedKey: true },
    // },
  });
};

const globalForPrisma = globalThis as unknown as {
  prismaEdge: ReturnType<typeof createPrismaEdgeClient> | undefined;
};

export const edgeDb = globalForPrisma.prismaEdge ?? createPrismaEdgeClient();

if (env.NODE_ENV !== "production") globalForPrisma.prismaEdge = edgeDb;
