/*
  Warnings:

  - The values [BOOTCAMP] on the enum `WORKOUT_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WORKOUT_TYPE_new" AS ENUM ('APPOINTMENT', 'TRAINING');
ALTER TABLE "Workout" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Workout" ALTER COLUMN "type" TYPE "WORKOUT_TYPE_new" USING ("type"::text::"WORKOUT_TYPE_new");
ALTER TYPE "WORKOUT_TYPE" RENAME TO "WORKOUT_TYPE_old";
ALTER TYPE "WORKOUT_TYPE_new" RENAME TO "WORKOUT_TYPE";
DROP TYPE "WORKOUT_TYPE_old";
ALTER TABLE "Workout" ALTER COLUMN "type" SET DEFAULT 'TRAINING';
COMMIT;
