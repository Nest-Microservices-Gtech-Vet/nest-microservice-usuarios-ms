/*
  Warnings:

  - Added the required column `usua_rol` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPERADMIN', 'ADMIN');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "usua_rol" "Rol" NOT NULL;
