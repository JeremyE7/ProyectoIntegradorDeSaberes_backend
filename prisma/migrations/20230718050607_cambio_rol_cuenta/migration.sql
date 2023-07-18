/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Rol_nombre_key` ON `Rol`(`nombre`);
