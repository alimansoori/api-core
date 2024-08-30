/*
  Warnings:

  - You are about to alter the column `book_time` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `started_at` on the `meeting` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `ended_at` on the `meeting` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `recording_start_time` on the `meeting_recording` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `recording_end_time` on the `meeting_recording` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `viewed_at` on the `meeting_recording_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `start` on the `meeting_timeslot` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end` on the `meeting_timeslot` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `viewed_at` on the `meeting_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `viewed_at` on the `note_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `viewed_at` on the `opportunity_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `viewed_at` on the `project_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `viewed_at` on the `service_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `start_date` on the `task` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `end_date` on the `task` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `last_signin` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `book_time` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `meeting` MODIFY `started_at` DATETIME NULL,
    MODIFY `ended_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `meeting_recording` MODIFY `recording_start_time` DATETIME NOT NULL,
    MODIFY `recording_end_time` DATETIME NULL;

-- AlterTable
ALTER TABLE `meeting_recording_user` MODIFY `viewed_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `meeting_timeslot` MODIFY `start` DATETIME NOT NULL,
    MODIFY `end` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `meeting_user` MODIFY `viewed_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `note_user` MODIFY `viewed_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `opportunity_user` MODIFY `viewed_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `project_user` MODIFY `viewed_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `service_user` MODIFY `viewed_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `task` MODIFY `start_date` TIMESTAMP NULL,
    MODIFY `end_date` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `last_signin` DATETIME NULL;

-- CreateTable
CREATE TABLE `ads_user` (
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NULL,
    `mobile` VARCHAR(20) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `ads_user_email_key`(`email`),
    UNIQUE INDEX `ads_user_mobile_key`(`mobile`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ads_category` (
    `category_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(100) NOT NULL,
    `category_key` VARCHAR(100) NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `ads_category_category_name_key`(`category_name`),
    UNIQUE INDEX `ads_category_category_key_key`(`category_key`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ads` (
    `ad_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`ad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ads_category_field` (
    `field_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `field_name` VARCHAR(100) NOT NULL,
    `field_type` VARCHAR(50) NOT NULL,
    `is_inherited` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`field_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ads_field_value` (
    `ad_field_value_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `ad_id` INTEGER UNSIGNED NOT NULL,
    `field_id` INTEGER UNSIGNED NOT NULL,
    `value` TEXT NOT NULL,

    PRIMARY KEY (`ad_field_value_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ads_category` ADD CONSTRAINT `ads_category_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `ads_category`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ads` ADD CONSTRAINT `ads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `ads_user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ads` ADD CONSTRAINT `ads_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ads_category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ads_category_field` ADD CONSTRAINT `ads_category_field_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ads_category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ads_field_value` ADD CONSTRAINT `ads_field_value_ad_id_fkey` FOREIGN KEY (`ad_id`) REFERENCES `ads`(`ad_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ads_field_value` ADD CONSTRAINT `ads_field_value_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `ads_category_field`(`field_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
