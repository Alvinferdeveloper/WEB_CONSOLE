/*
  Warnings:

  - Added the required column `absolutePath` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` ADD COLUMN `absolutePath` VARCHAR(500) NOT NULL;
