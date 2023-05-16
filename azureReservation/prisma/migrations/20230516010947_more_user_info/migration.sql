/*
  Warnings:

  - A unique constraint covering the columns `[loginUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastRequestTime" TIMESTAMP(3),
ADD COLUMN     "loginPassword" TEXT,
ADD COLUMN     "loginUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_loginUsername_key" ON "User"("loginUsername");
