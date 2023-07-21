/*
  Warnings:

  - You are about to drop the column `materiaIsd` on the `Tutoria` table. All the data in the column will be lost.
  - You are about to drop the column `registroTutoriasId` on the `Tutoria` table. All the data in the column will be lost.
  - Added the required column `materiaId` to the `Tutoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registroTutoriassId` to the `Tutoria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Tutoria` DROP FOREIGN KEY `Tutoria_materiaIsd_fkey`;

-- DropForeignKey
ALTER TABLE `Tutoria` DROP FOREIGN KEY `Tutoria_registroTutoriasId_fkey`;

-- AlterTable
ALTER TABLE `Tutoria` DROP COLUMN `materiaIsd`,
    DROP COLUMN `registroTutoriasId`,
    ADD COLUMN `materiaId` INTEGER NOT NULL,
    ADD COLUMN `registroTutoriassId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_registroTutoriassId_fkey` FOREIGN KEY (`registroTutoriassId`) REFERENCES `RegistroTutorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
