-- DropForeignKey
ALTER TABLE `Cuenta` DROP FOREIGN KEY `Cuenta_personaId_fkey`;

-- DropForeignKey
ALTER TABLE `Docente` DROP FOREIGN KEY `Docente_personaId_fkey`;

-- DropForeignKey
ALTER TABLE `Estudiante` DROP FOREIGN KEY `Estudiante_personaId_fkey`;

-- DropForeignKey
ALTER TABLE `Materia` DROP FOREIGN KEY `Materia_docenteId_fkey`;

-- DropForeignKey
ALTER TABLE `RegistroTutorias` DROP FOREIGN KEY `RegistroTutorias_docenteId_fkey`;

-- DropForeignKey
ALTER TABLE `Tutoria` DROP FOREIGN KEY `Tutoria_docenteId_fkey`;

-- AddForeignKey
ALTER TABLE `Cuenta` ADD CONSTRAINT `Cuenta_personaId_fkey` FOREIGN KEY (`personaId`) REFERENCES `Persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Docente` ADD CONSTRAINT `Docente_personaId_fkey` FOREIGN KEY (`personaId`) REFERENCES `Persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estudiante` ADD CONSTRAINT `Estudiante_personaId_fkey` FOREIGN KEY (`personaId`) REFERENCES `Persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroTutorias` ADD CONSTRAINT `RegistroTutorias_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materia` ADD CONSTRAINT `Materia_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
