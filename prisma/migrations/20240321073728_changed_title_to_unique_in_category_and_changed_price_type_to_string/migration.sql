/*
  Warnings:

  - You are about to drop the column `cart_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_cart_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_userId_fkey`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `cart_id`,
    DROP COLUMN `category_id`,
    ADD COLUMN `cartId` INTEGER NULL,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    MODIFY `price` VARCHAR(191) NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_title_key` ON `Category`(`title`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
