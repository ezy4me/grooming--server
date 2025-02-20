/*
  Warnings:

  - The `image` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;
