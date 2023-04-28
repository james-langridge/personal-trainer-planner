-- Copy Session data to Workout.
INSERT INTO "Workout" ("id", "createdAt", "updatedAt", "ownerId", "status", "name", "date", "description", "videoUrl", "sessionType", "deleted")
SELECT "id", "createdAt", "updatedAt", "ownerId", "status", "name", "date", "description", "videoUrl", "sessionType", "deleted"
FROM "Session";
