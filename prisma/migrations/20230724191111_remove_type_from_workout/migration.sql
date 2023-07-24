/*
  Warnings:

  - You are about to drop the column `type` on the `Workout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "type";

-- DropEnum
DROP TYPE "WORKOUT_TYPE";
