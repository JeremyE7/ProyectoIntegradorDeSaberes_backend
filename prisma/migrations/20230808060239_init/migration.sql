/*
  Warnings:

  - You are about to drop the column `docenteIds` on the `Materia` table. All the data in the column will be lost.
  - Added the required column `docenteId` to the `Materia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Materia` DROP FOREIGN KEY `Materia_docenteIds_fkey`;

-- AlterTable
ALTER TABLE `Materia` DROP COLUMN `docenteIds`,
    ADD COLUMN `docenteId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Materia` ADD CONSTRAINT `Materia_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
