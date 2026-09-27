/*
  Warnings:

  - Added the required column `longDescription` to the `Ailment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longDescription` to the `Therapy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "cancelledAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ailment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "therapyId" TEXT NOT NULL,
    CONSTRAINT "Ailment_therapyId_fkey" FOREIGN KEY ("therapyId") REFERENCES "Therapy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ailment" ("description", "id", "name", "therapyId") SELECT "description", "id", "name", "therapyId" FROM "Ailment";
DROP TABLE "Ailment";
ALTER TABLE "new_Ailment" RENAME TO "Ailment";
CREATE UNIQUE INDEX "Ailment_name_key" ON "Ailment"("name");
CREATE UNIQUE INDEX "Ailment_therapyId_key" ON "Ailment"("therapyId");
CREATE TABLE "new_Therapy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL
);
INSERT INTO "new_Therapy" ("description", "id", "name") SELECT "description", "id", "name" FROM "Therapy";
DROP TABLE "Therapy";
ALTER TABLE "new_Therapy" RENAME TO "Therapy";
CREATE UNIQUE INDEX "Therapy_name_key" ON "Therapy"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
