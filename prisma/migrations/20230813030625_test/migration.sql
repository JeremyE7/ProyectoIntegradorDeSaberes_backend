-- DropForeignKey
ALTER TABLE `Tutoria` DROP FOREIGN KEY `Tutoria_materiaId_fkey`;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
