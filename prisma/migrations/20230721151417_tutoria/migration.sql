/*
  Warnings:

  - You are about to drop the column `materiaIsd` on the `Tutoria` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tutoria` DROP FOREIGN KEY `Tutoria_materiaIsd_fkey`;

-- AlterTable
ALTER TABLE `Tutoria` DROP COLUMN `materiaIsd`;
