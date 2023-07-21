/*
  Warnings:

  - Added the required column `materiaIsd` to the `Tutoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tutoria` ADD COLUMN `materiaIsd` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_materiaIsd_fkey` FOREIGN KEY (`materiaIsd`) REFERENCES `Materia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
