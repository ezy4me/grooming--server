/*
  Warnings:

  - You are about to drop the column `imageId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `EmailVerificationCodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_imageId_fkey";

-- DropForeignKey
ALTER TABLE "EmailVerificationCodes" DROP CONSTRAINT "EmailVerificationCodes_userId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_imageId_fkey";

-- DropIndex
DROP INDEX "Appointment_imageId_key";

-- DropIndex
DROP INDEX "Service_imageId_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "imageId";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "imageId";

-- DropTable
DROP TABLE "EmailVerificationCodes";
