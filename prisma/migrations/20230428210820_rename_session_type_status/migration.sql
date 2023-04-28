-- Up
ALTER TABLE "Workout" RENAME COLUMN "sessionType" TO "type";

-- Down
ALTER TABLE "Workout" RENAME COLUMN "type" TO "sessionType";
