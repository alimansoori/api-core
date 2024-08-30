-- breakline
CREATE TABLE `meeting` (
    `meeting_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_hash` VARCHAR(31) NOT NULL,
    `url` VARCHAR(63) NOT NULL,
    `type` ENUM('meeting', 'breakoutroom', 'room', 'booking', 'template') NOT NULL DEFAULT 'meeting',
    `max_attendee` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `is_poll` BOOLEAN NOT NULL DEFAULT false,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `meeting_recurrence_id` INTEGER UNSIGNED NULL,
    `server_id` INTEGER UNSIGNED NULL,
    `main_room_id` INTEGER UNSIGNED NULL,
    `reset_room_option_id` INTEGER UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `meta` JSON NULL,
    `chat_id` VARCHAR(63) NULL,
    `chat_name` VARCHAR(63) NULL,
    `status` TINYINT UNSIGNED NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `is_instant` BOOLEAN NOT NULL DEFAULT false,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'can_join',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `is_e2ee` BOOLEAN NOT NULL DEFAULT false,
    `is_chat_enable` BOOLEAN NOT NULL DEFAULT true,
    `reset_after_close` BOOLEAN NOT NULL DEFAULT false,
    `started_at` DATETIME NULL,
    `ended_at` DATETIME NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `max_session_length` INTEGER UNSIGNED NULL,
    `enable_presentation_permit` ENUM('anyone', 'admins_only', 'host_only') NOT NULL DEFAULT 'anyone',
    `enable_chat_permit` ENUM('anyone', 'admins_only', 'host_only') NOT NULL DEFAULT 'admins_only',
    `enable_recording_permit` ENUM('anyone', 'admins_only', 'host_only') NOT NULL DEFAULT 'admins_only',
    `enable_raise_hand_permit` ENUM('anyone', 'admins_only', 'host_only') NOT NULL DEFAULT 'anyone',
    `view_transcription_permit` ENUM('anyone', 'admins_only', 'host_only') NOT NULL DEFAULT 'admins_only',
    `add_agenda_permit` ENUM('anyone', 'admins_only', 'host_only') NOT NULL DEFAULT 'admins_only',
    `is_local_recording_enable` BOOLEAN NOT NULL DEFAULT true,
    `is_cloud_recording_enable` BOOLEAN NOT NULL DEFAULT true,
    `is_cloud_recording_autostart` BOOLEAN NOT NULL DEFAULT false,
    `is_transcription_autostart` BOOLEAN NOT NULL DEFAULT false,
    `meeting_timer_status` ENUM('played', 'paused', 'not_started') NOT NULL DEFAULT 'not_started',
    `elapsed_time` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `meeting_meeting_hash_key`(`meeting_hash`),
    INDEX `meeting_name_idx`(`name`),
    UNIQUE INDEX `meeting_workspace_id_url_key`(`workspace_id`, `url`),
    PRIMARY KEY (`meeting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_meeting_recurrence_id_fkey` FOREIGN KEY (`meeting_recurrence_id`) REFERENCES `meeting_recurrence`(`meeting_recurrence_id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_main_room_id_fkey` FOREIGN KEY (`main_room_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- breakline
CREATE TABLE `meeting_user` (
    `meeting_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `status` ENUM('joined', 'invited', 'missed', 'waiting', 'online', 'left') NOT NULL DEFAULT 'invited',
    `joined_at` DATETIME(3) NULL,
    `left_at` DATETIME(3) NULL,
    `talking_time` INTEGER UNSIGNED NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_voted` BOOLEAN NOT NULL DEFAULT false,
    `is_seen` BOOLEAN NOT NULL DEFAULT false,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `meta` JSON NULL,
    `is_busy` BOOLEAN NOT NULL DEFAULT true,
    `request_type` ENUM('invited', 'knocked', 'knock_canceled', 'joined_with_link') NOT NULL DEFAULT 'invited',
    `request_status` ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'approved',
    `is_starred` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `knocking_time` DATETIME(3) NULL,
    `viewed_at` DATETIME NULL,
    `access_main_room` BOOLEAN NOT NULL DEFAULT true,
    `is_visible_on_profile` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `meeting_user_meeting_id_user_id_key`(`meeting_id`, `user_id`),
    PRIMARY KEY (`meeting_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `meeting_user` ADD CONSTRAINT `meeting_user_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `meeting_user` ADD CONSTRAINT `meeting_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- breakline
CREATE TABLE `user` (
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_hash` VARCHAR(31) NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `usertype_id` INTEGER UNSIGNED NULL,
    `username` VARCHAR(127) NOT NULL,
    `ban_count` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `timezone_id` INTEGER UNSIGNED NULL,
    `country_id` INTEGER UNSIGNED NULL,
    `avatar_file_id` INTEGER UNSIGNED NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `password` VARCHAR(255) NULL,
    `role` ENUM('user', 'guest', 'anonymous', 'deleted', 'bot', 'system') NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(255) NULL,
    `console_project_language_id` INTEGER UNSIGNED NULL,
    `is_2fa_enabled` BOOLEAN NOT NULL DEFAULT false,
    `meta` JSON NULL,
    `username_updated_at` DATETIME(3) NULL,
    `last_signin` DATETIME NULL,
    `is_insider` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `last_visit` DATETIME(3) NULL,

    UNIQUE INDEX `user_user_hash_key`(`user_hash`),
    UNIQUE INDEX `user_avatar_file_id_key`(`avatar_file_id`),
    UNIQUE INDEX `user_console_project_id_username_key`(`console_project_id`, `username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- breakline
CREATE TABLE `meeting_recurrence` (
    `meeting_recurrence_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('monthly', 'yearly', 'daily', 'weekly', 'custom', 'none') NOT NULL,
    `recur_type` ENUM('day', 'week', 'month', 'year') NULL,
    `repeat_every` TINYINT UNSIGNED NULL,
    `repeat_interval` TINYINT UNSIGNED NULL,
    `monthly_at_same_week_and_day` BOOLEAN NULL,
    `monthly_type` ENUM('NTH_WEEKDAY', 'LAST_WEEKDAY') NULL,
    `weekly_days` JSON NULL,
    `end_date` DATETIME(3) NULL,

    PRIMARY KEY (`meeting_recurrence_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- breakline
CREATE TABLE `meeting_timeslot` (
    `meeting_timeslot_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `is_confirmed` BOOLEAN NOT NULL,
    `initial_order` TINYINT UNSIGNED NULL,
    `start` DATETIME NOT NULL,
    `end` DATETIME NOT NULL,

    PRIMARY KEY (`meeting_timeslot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `meeting_timeslot` ADD CONSTRAINT `meeting_timeslot_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- breakline
CREATE TABLE `meeting_timeslot_vote` (
    `meeting_timeslot_vote_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_timeslot_id` INTEGER UNSIGNED NOT NULL,
    `meeting_user_id` INTEGER UNSIGNED NOT NULL,
    `order` TINYINT UNSIGNED NOT NULL,
    `is_unavailable` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_timeslot_vote_meeting_user_id_meeting_timeslot_id_key`(`meeting_user_id`, `meeting_timeslot_id`),
    PRIMARY KEY (`meeting_timeslot_vote_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- breakline
CREATE TABLE `meeting_project` (
    `meeting_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_project_project_id_meeting_id_key`(`project_id`, `meeting_id`),
    PRIMARY KEY (`meeting_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `meeting_project` ADD CONSTRAINT `meeting_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `meeting_project` ADD CONSTRAINT `meeting_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `meeting_project` ADD CONSTRAINT `meeting_project_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- breakline
CREATE TABLE `project` (
    `project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_hash` VARCHAR(31) NOT NULL,
    `id` VARCHAR(255) NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'disabled',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `meta` JSON NULL,
    `status` ENUM('open', 'closed', 'archived') NOT NULL DEFAULT 'open',
    `due_date` DATETIME(3) NULL,

    UNIQUE INDEX `project_project_hash_key`(`project_hash`),
    INDEX `project_name_idx`(`name`),
    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- breakline
CREATE TABLE `project_user` (
    `project_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `meta` JSON NULL,
    `is_starred` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `viewed_at` DATETIME NULL,
    `is_visible_on_profile` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `project_user_project_id_user_id_key`(`project_id`, `user_id`),
    PRIMARY KEY (`project_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `project_user` ADD CONSTRAINT `project_user_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `project_user` ADD CONSTRAINT `project_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- breakline
CREATE TABLE `workspace` (
    `workspace_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `subdomain` VARCHAR(31) NOT NULL,
    `server_id` INTEGER UNSIGNED NOT NULL,
    `workspace_type_id` INTEGER UNSIGNED NULL,
    `meta` JSON NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'can_ask_for_access',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `chat_id` VARCHAR(63) NULL,
    `chat_name` VARCHAR(63) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `workspace_subdomain_idx`(`subdomain`),
    UNIQUE INDEX `workspace_console_project_id_subdomain_key`(`console_project_id`, `subdomain`),
    PRIMARY KEY (`workspace_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `server`(`server_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_workspace_type_id_fkey` FOREIGN KEY (`workspace_type_id`) REFERENCES `workspace_type`(`workspace_type_id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- breakline
CREATE TABLE `workspace_user` (
    `workspace_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `invited_by_user_id` INTEGER UNSIGNED NULL,
    `chat_user_id` VARCHAR(63) NULL,
    `chat_username` VARCHAR(255) NULL,
    `currency_id` INTEGER UNSIGNED NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL,
    `is_guest` BOOLEAN NOT NULL DEFAULT false,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `availability_template_id` INTEGER UNSIGNED NULL,
    `order` SMALLINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role_id` INTEGER UNSIGNED NOT NULL,
    `first_week_day` ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday') NOT NULL DEFAULT 'sunday',
    `notification_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    UNIQUE INDEX `workspace_user_user_id_workspace_id_key`(`user_id`, `workspace_id`),
    PRIMARY KEY (`workspace_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `workspace_user` ADD CONSTRAINT `user_workspace_user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_availability_template_id_fkey` FOREIGN KEY (`availability_template_id`) REFERENCES `availability_template`(`availability_template_id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
