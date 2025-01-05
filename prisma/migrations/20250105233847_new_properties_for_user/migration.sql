/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `email` VARCHAR(45) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(45) NOT NULL,
    ADD COLUMN `name` VARCHAR(45) NOT NULL;
