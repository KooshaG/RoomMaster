/*
  Warnings:

  - A unique constraint covering the columns `[eid]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eid` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "eid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_eid_key" ON "Room"("eid");
