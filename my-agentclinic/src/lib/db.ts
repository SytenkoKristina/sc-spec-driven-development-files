import fs from "node:fs";
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
//
// This assumes `process.cwd()` is the project root, which holds for `next
// dev`/`next build`/`next start` (Next itself resolves `next.config.ts`,
// `.next/`, and `public/` the same way). If the app is ever started from a
// different working directory (e.g. a Docker WORKDIR or monorepo task
// runner), fail loudly here rather than silently opening/creating an empty
// database at the wrong path — use an absolute `file:` URL in that case.
function resolveSqliteUrl(databaseUrl: string) {
  const relativePath = databaseUrl.replace(/^file:/, "");
  if (path.isAbsolute(relativePath)) {
    return databaseUrl;
  }

  const prismaDir = path.join(process.cwd(), "prisma");
  if (!fs.existsSync(prismaDir)) {
    throw new Error(
      `Cannot resolve DATABASE_URL="${databaseUrl}": expected a "prisma" ` +
        `directory under process.cwd() (${process.cwd()}). If the app is ` +
        "started from a different working directory, use an absolute " +
        "file: URL instead.",
    );
  }

  return `file:${path.join(prismaDir, relativePath)}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveSqliteUrl(
      process.env.DATABASE_URL ?? "file:./dev.db",
    ),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
