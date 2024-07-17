-- DropForeignKey
ALTER TABLE `directory` DROP FOREIGN KEY `Directory_parentId_fkey`;

-- AlterTable
ALTER TABLE `directory` MODIFY `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Directory` ADD CONSTRAINT `Directory_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Directory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
