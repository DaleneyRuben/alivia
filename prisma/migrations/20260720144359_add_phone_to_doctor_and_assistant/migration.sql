/*
  Warnings:

  - Added the required column `phone` to the `Assistant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "phone" TEXT NOT NULL;
