/*
  Warnings:

  - Added the required column `docenteId` to the `Tutoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tutoria` ADD COLUMN `docenteId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
