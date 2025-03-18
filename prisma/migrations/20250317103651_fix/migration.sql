/*
  Warnings:

  - You are about to drop the `ClientAppointment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClientAppointment" DROP CONSTRAINT "ClientAppointment_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "ClientAppointment" DROP CONSTRAINT "ClientAppointment_clientId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clientId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ClientAppointment";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
