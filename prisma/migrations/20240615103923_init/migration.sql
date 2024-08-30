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
