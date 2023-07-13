-- CreateTable
CREATE TABLE `Persona` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `identificacion` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Persona_externalId_key`(`externalId`),
    UNIQUE INDEX `Persona_identificacion_key`(`identificacion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuenta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `clave` VARCHAR(191) NOT NULL,
    `personaId` INTEGER NOT NULL,

    UNIQUE INDEX `Cuenta_externalId_key`(`externalId`),
    UNIQUE INDEX `Cuenta_correo_key`(`correo`),
    UNIQUE INDEX `Cuenta_personaId_key`(`personaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rol_externalId_key`(`externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Docente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `personaId` INTEGER NOT NULL,

    UNIQUE INDEX `Docente_externalId_key`(`externalId`),
    UNIQUE INDEX `Docente_personaId_key`(`personaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estudiante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `ciclo` VARCHAR(191) NOT NULL,
    `paralelo` VARCHAR(191) NOT NULL,
    `carrera` VARCHAR(191) NOT NULL,
    `personaId` INTEGER NOT NULL,

    UNIQUE INDEX `Estudiante_externalId_key`(`externalId`),
    UNIQUE INDEX `Estudiante_personaId_key`(`personaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroTutorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `periodoAcademico` VARCHAR(191) NOT NULL,
    `docenteId` INTEGER NOT NULL,

    UNIQUE INDEX `RegistroTutorias_externalId_key`(`externalId`),
    UNIQUE INDEX `RegistroTutorias_docenteId_key`(`docenteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tutoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `fecha` VARCHAR(191) NOT NULL,
    `duracion` DATETIME(3) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `nombreTutoria` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `registroTutoriasId` INTEGER NOT NULL,
    `materiaId` INTEGER NOT NULL,

    UNIQUE INDEX `Tutoria_externalId_key`(`externalId`),
    UNIQUE INDEX `Tutoria_registroTutoriasId_key`(`registroTutoriasId`),
    UNIQUE INDEX `Tutoria_materiaId_key`(`materiaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `docenteId` INTEGER NOT NULL,

    UNIQUE INDEX `Materia_externalId_key`(`externalId`),
    UNIQUE INDEX `Materia_docenteId_key`(`docenteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cuenta` ADD CONSTRAINT `Cuenta_personaId_fkey` FOREIGN KEY (`personaId`) REFERENCES `Persona`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Docente` ADD CONSTRAINT `Docente_personaId_fkey` FOREIGN KEY (`personaId`) REFERENCES `Persona`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estudiante` ADD CONSTRAINT `Estudiante_personaId_fkey` FOREIGN KEY (`personaId`) REFERENCES `Persona`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroTutorias` ADD CONSTRAINT `RegistroTutorias_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_registroTutoriasId_fkey` FOREIGN KEY (`registroTutoriasId`) REFERENCES `RegistroTutorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutoria` ADD CONSTRAINT `Tutoria_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materia` ADD CONSTRAINT `Materia_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
