-- CreateTable
CREATE TABLE `_EstudianteToTutoria` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EstudianteToTutoria_AB_unique`(`A`, `B`),
    INDEX `_EstudianteToTutoria_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_EstudianteToTutoria` ADD CONSTRAINT `_EstudianteToTutoria_A_fkey` FOREIGN KEY (`A`) REFERENCES `Estudiante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EstudianteToTutoria` ADD CONSTRAINT `_EstudianteToTutoria_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tutoria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
