/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_ownerId_fkey";

-- DropTable
DROP TABLE "Session";

-- DropEnum
DROP TYPE "SESSION_STATUS";

-- DropEnum
DROP TYPE "SESSION_TYPE";
