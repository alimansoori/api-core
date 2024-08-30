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
CREATE TABLE `telegram_user` (
    `telegram_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `telegram_id` BIGINT UNSIGNED NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NULL,
    `username` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`telegram_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `telegram_token_balance` (
    `token_balance_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `telegram_user_id` INTEGER UNSIGNED NOT NULL,
    `balance` INTEGER NOT NULL DEFAULT 100,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`token_balance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `telegram_token_balance` ADD CONSTRAINT `telegram_token_balance_telegram_user_id_fkey` FOREIGN KEY (`telegram_user_id`) REFERENCES `telegram_user`(`telegram_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
