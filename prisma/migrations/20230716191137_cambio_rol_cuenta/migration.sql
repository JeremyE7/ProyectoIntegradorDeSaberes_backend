/*
  Warnings:

  - You are about to drop the column `rolId` on the `Cuenta` table. All the data in the column will be lost.
  - Added the required column `rol_id` to the `Cuenta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Cuenta` DROP FOREIGN KEY `Cuenta_rolId_fkey`;

-- AlterTable
ALTER TABLE `Cuenta` DROP COLUMN `rolId`,
    ADD COLUMN `rol_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Cuenta` ADD CONSTRAINT `Cuenta_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
