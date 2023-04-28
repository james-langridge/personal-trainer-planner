/*
  Warnings:

  - You are about to drop the column `sessionType` on the `Workout` table. All the data in the column will be lost.
  - The `status` column on the `Workout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Workout"
RENAME COLUMN "sessionType" TO "type";
