/*
  Warnings:

  - A unique constraint covering the columns `[rolId]` on the table `Cuenta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rolId` to the `Cuenta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cuenta` ADD COLUMN `rolId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cuenta_rolId_key` ON `Cuenta`(`rolId`);

-- AddForeignKey
ALTER TABLE `Cuenta` ADD CONSTRAINT `Cuenta_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
