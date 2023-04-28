/*
  Warnings:

  - The `status` column on the `Workout` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Workout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
BEGIN;

-- Create new "WORKOUT_STATUS" enum type with the same values as "SESSION_STATUS"
CREATE TYPE "WORKOUT_STATUS" AS ENUM ('NOT_STARTED', 'COMPLETED');

-- Create new "WORKOUT_TYPE" enum type with the same values as "SESSION_TYPE"
CREATE TYPE "WORKOUT_TYPE" AS ENUM ('TRAINING', 'APPOINTMENT');

-- Add temporary columns with the new enum types
ALTER TABLE "Workout" ADD COLUMN "temp_status" "WORKOUT_STATUS";
ALTER TABLE "Workout" ADD COLUMN "temp_type" "WORKOUT_TYPE";

-- Copy data from the old columns to the temporary columns
UPDATE "Workout" SET "temp_status" = "status"::text::"WORKOUT_STATUS", "temp_type" = "type"::text::"WORKOUT_TYPE";

-- Drop the old columns
ALTER TABLE "Workout" DROP COLUMN "status";
ALTER TABLE "Workout" DROP COLUMN "type";

-- Rename the temporary columns to the original column names
ALTER TABLE "Workout" RENAME COLUMN "temp_status" TO "status";
ALTER TABLE "Workout" RENAME COLUMN "temp_type" TO "type";

COMMIT;

