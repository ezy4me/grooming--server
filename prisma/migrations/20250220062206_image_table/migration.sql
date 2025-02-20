/*
  Warnings:

  - You are about to drop the column `image` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "image",
ADD COLUMN     "imageId" INTEGER;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "image",
ADD COLUMN     "imageId" INTEGER;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "image",
ADD COLUMN     "imageId" INTEGER;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "buffer" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_imageId_key" ON "Appointment"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_imageId_key" ON "Employee"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_imageId_key" ON "Service"("imageId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
