/*
  Warnings:

  - You are about to drop the column `materiaId` on the `Tutoria` table. All the data in the column will be lost.
  - Added the required column `materiaIsd` to the `Tutoria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Tutoria` DROP FOREIGN KEY `Tutoria_materiaId_fkey`;

-- AlterTable
ALTER TABLE `Tutoria` DROP COLUMN `materiaId`,
    ADD COLUMN `materiaIsd` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_materiaIsd_fkey` FOREIGN KEY (`materiaIsd`) REFERENCES `Materia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
