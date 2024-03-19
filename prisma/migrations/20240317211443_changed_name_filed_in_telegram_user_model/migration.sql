/*
  Warnings:

  - You are about to drop the column `name` on the `telegramuser` table. All the data in the column will be lost.
  - Added the required column `fname` to the `TelegramUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `telegramuser` DROP COLUMN `name`,
    ADD COLUMN `fname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lname` VARCHAR(191) NULL;
