/*
  Warnings:

  - You are about to alter the column `usua_contrasenia` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "updatedBy" INTEGER,
ALTER COLUMN "usua_contrasenia" SET DATA TYPE VARCHAR(50);
