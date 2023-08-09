/*
  Warnings:

  - You are about to drop the column `docenteId` on the `Materia` table. All the data in the column will be lost.
  - Added the required column `docenteIds` to the `Materia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Materia` DROP FOREIGN KEY `Materia_docenteId_fkey`;

-- AlterTable
ALTER TABLE `Materia` DROP COLUMN `docenteId`,
    ADD COLUMN `docenteIds` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Materia` ADD CONSTRAINT `Materia_docenteIds_fkey` FOREIGN KEY (`docenteIds`) REFERENCES `Docente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
