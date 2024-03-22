/*
  Warnings:

  - You are about to drop the column `user_id` on the `cart` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_user_id_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `cartId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
