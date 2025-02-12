-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "updatedBy" INTEGER,
ALTER COLUMN "usua_email" DROP NOT NULL;
