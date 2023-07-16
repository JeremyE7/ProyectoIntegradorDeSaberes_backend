/*
  Warnings:

  - You are about to alter the column `clave` on the `Cuenta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Cuenta` MODIFY `clave` INTEGER NOT NULL;
