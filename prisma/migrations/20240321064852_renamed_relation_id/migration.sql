/*
  Warnings:

  - You are about to drop the column `product_id` on the `feature` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `feature` DROP FOREIGN KEY `Feature_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_user_id_fkey`;

-- AlterTable
ALTER TABLE `feature` DROP COLUMN `product_id`,
    ADD COLUMN `productId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feature` ADD CONSTRAINT `Feature_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
