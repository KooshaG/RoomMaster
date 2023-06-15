/*
  Warnings:

  - You are about to drop the column `expires_in` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "expires_in",
ADD COLUMN     "expires_at" INTEGER;
