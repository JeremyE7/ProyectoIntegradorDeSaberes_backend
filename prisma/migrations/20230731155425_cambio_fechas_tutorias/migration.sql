/*
  Warnings:

  - You are about to drop the column `duracion` on the `Tutoria` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Tutoria` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Tutoria` DROP COLUMN `duracion`,
    DROP COLUMN `fecha`,
    ADD COLUMN `fechaFinalizacion` DATETIME(3) NULL,
    ADD COLUMN `fechaInicio` DATETIME(3) NULL;
