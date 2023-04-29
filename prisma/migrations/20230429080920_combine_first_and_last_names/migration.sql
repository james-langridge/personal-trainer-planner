-- Alter table to add name column and remove firstName and lastName columns
ALTER TABLE "User"
ADD COLUMN "name" TEXT;

-- Combine firstName and lastName into name for existing users
UPDATE "User"
SET "name" = TRIM(CONCAT("firstName", ' ', "lastName"));

