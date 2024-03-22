-- AlterTable
ALTER TABLE `telegramuser` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';
