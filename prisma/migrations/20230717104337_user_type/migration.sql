/*
  Warnings:

  - The `type` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "USER_TYPE" AS ENUM ('INDIVIDUAL', 'BOOTCAMP');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "type",
ADD COLUMN     "type" "USER_TYPE" NOT NULL DEFAULT 'INDIVIDUAL';
