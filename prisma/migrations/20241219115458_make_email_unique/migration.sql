/*
  Warnings:

  - You are about to drop the column `authorId` on the `noticias` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `noticias` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "noticias" DROP CONSTRAINT "noticias_authorId_fkey";

-- AlterTable
ALTER TABLE "noticias" DROP COLUMN "authorId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
