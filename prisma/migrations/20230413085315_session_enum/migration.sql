/*
  Warnings:

  - You are about to drop the column `appointment` on the `Session` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SESSION_TYPE" AS ENUM ('TRAINING', 'APPOINTMENT');

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "appointment",
ADD COLUMN     "sessionType" "SESSION_TYPE" NOT NULL DEFAULT 'TRAINING';
