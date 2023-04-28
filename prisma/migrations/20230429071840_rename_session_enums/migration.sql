/*
  Warnings:

  - Made the column `status` on table `Workout` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Workout` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED',
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'TRAINING';
