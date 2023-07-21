/*
  Warnings:

  - You are about to drop the column `registroTutoriassId` on the `Tutoria` table. All the data in the column will be lost.
  - Added the required column `registroTutoriasId` to the `Tutoria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Tutoria` DROP FOREIGN KEY `Tutoria_registroTutoriassId_fkey`;

-- AlterTable
ALTER TABLE `Tutoria` DROP COLUMN `registroTutoriassId`,
    ADD COLUMN `registroTutoriasId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_registroTutoriasId_fkey` FOREIGN KEY (`registroTutoriasId`) REFERENCES `RegistroTutorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
