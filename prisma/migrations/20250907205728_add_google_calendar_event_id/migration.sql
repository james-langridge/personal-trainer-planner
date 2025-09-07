-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "googleCalendarEventId" TEXT;

-- AlterTable
ALTER TABLE "_BootcampToUser" ADD CONSTRAINT "_BootcampToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BootcampToUser_AB_unique";
