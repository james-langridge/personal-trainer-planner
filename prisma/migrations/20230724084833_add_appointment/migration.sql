-- CreateEnum
CREATE TYPE "APPOINTMENT_STATUS" AS ENUM ('NOT_ATTENDED', 'ATTENDED');

-- CreateTable
CREATE TABLE "Appointment" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "APPOINTMENT_STATUS" NOT NULL DEFAULT 'NOT_ATTENDED',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "videoUrl" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
