/*
  Warnings:

  - Added the required column `absolutePath` to the `Directory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `directory` ADD COLUMN `absolutePath` VARCHAR(500) NOT NULL;
