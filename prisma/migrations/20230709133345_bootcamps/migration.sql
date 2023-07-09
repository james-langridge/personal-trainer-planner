/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Workout_ownerId_id_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'regular',
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "Bootcamp" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "videoUrl" TEXT,

    CONSTRAINT "Bootcamp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BootcampToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BootcampToUser_AB_unique" ON "_BootcampToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BootcampToUser_B_index" ON "_BootcampToUser"("B");

-- AddForeignKey
ALTER TABLE "_BootcampToUser" ADD CONSTRAINT "_BootcampToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Bootcamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BootcampToUser" ADD CONSTRAINT "_BootcampToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
