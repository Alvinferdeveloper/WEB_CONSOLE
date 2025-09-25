-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Directory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `parentId` INTEGER NULL,
    `absolutePath` VARCHAR(500) NOT NULL,
    `userId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `directoryId` INTEGER NOT NULL,
    `content` VARCHAR(5000) NOT NULL DEFAULT '',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `absolutePath` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Directory` ADD CONSTRAINT `Directory_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Directory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Directory` ADD CONSTRAINT `Directory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_directoryId_fkey` FOREIGN KEY (`directoryId`) REFERENCES `Directory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
