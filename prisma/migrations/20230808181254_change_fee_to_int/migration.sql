/*
  Warnings:

  - You are about to alter the column `fee` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `fee` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "fee" SET DEFAULT 0,
ALTER COLUMN "fee" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "fee" SET DEFAULT 0,
ALTER COLUMN "fee" SET DATA TYPE INTEGER;
