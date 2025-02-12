/*
  Warnings:

  - Made the column `createdBy` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedBy` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedBy" SET NOT NULL;
