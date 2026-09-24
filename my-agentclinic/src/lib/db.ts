import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Next.js bundles this module into .next's own directory tree, which breaks
// Prisma's default resolution of a relative sqlite `file:` URL (it resolves
// relative to the bundled file's location, not the project root). Resolve an
// absolute path from `DATABASE_URL` ourselves so it works under both `next
// dev` and `next build`.
function resolveSqliteUrl(databaseUrl: string) {
  const relativePath = databaseUrl.replace(/^file:/, "");
  if (path.isAbsolute(relativePath)) {
    return databaseUrl;
  }
  return `file:${path.join(process.cwd(), "prisma", relativePath)}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveSqliteUrl(process.env.DATABASE_URL ?? "file:./dev.db"),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
