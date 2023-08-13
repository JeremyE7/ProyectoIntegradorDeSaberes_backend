/*
  Warnings:

  - Added the required column `asistencia` to the `Tutoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valoracion` to the `Tutoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Persona` ADD COLUMN `firma` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Tutoria` ADD COLUMN `asistencia` INTEGER NOT NULL,
    ADD COLUMN `justificacion` VARCHAR(191) NULL,
    ADD COLUMN `observacionDocente` VARCHAR(191) NULL,
    ADD COLUMN `observacionEstudiante` VARCHAR(191) NULL,
    ADD COLUMN `tipoCantidadTutoria` VARCHAR(191) NULL,
    ADD COLUMN `tipoReunionTutoria` VARCHAR(191) NULL,
    ADD COLUMN `valoracion` INTEGER NOT NULL;
