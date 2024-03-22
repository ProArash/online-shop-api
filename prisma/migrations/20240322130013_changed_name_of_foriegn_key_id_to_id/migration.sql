/*
  Warnings:

  - You are about to drop the column `productId` on the `feature` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `productimage` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `user` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `feature` DROP FOREIGN KEY `Feature_productId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_userId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_userId_fkey`;

-- DropForeignKey
ALTER TABLE `productimage` DROP FOREIGN KEY `ProductImage_productId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_cartId_fkey`;

-- AlterTable
ALTER TABLE `feature` DROP COLUMN `productId`,
    ADD COLUMN `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `userId`,
    ADD COLUMN `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `cartId`,
    DROP COLUMN `categoryId`,
    DROP COLUMN `userId`,
    ADD COLUMN `cart_id` INTEGER NULL,
    ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `productimage` DROP COLUMN `productId`,
    ADD COLUMN `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `cartId`,
    ADD COLUMN `cart_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feature` ADD CONSTRAINT `Feature_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
