-- CreateTable
CREATE TABLE `timezone` (
    `timezone_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `offset` INTEGER NULL,
    `abbr` VARCHAR(255) NULL,

    UNIQUE INDEX `timezone_name_key`(`name`),
    UNIQUE INDEX `timezone_abbr_key`(`abbr`),
    PRIMARY KEY (`timezone_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country_timezone` (
    `country_timezone_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `country_id` INTEGER UNSIGNED NOT NULL,
    `timezone_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`country_timezone_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `country_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `native_name` VARCHAR(255) NOT NULL,
    `alpha_2` VARCHAR(3) NOT NULL,
    `emoji` VARCHAR(255) NOT NULL,
    `phone_code` VARCHAR(7) NOT NULL,

    UNIQUE INDEX `country_name_key`(`name`),
    UNIQUE INDEX `country_alpha_2_key`(`alpha_2`),
    PRIMARY KEY (`country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currency` (
    `currency_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(31) NOT NULL,
    `symbol` VARCHAR(31) NULL,
    `symbol_native` VARCHAR(31) NULL,
    `name` VARCHAR(63) NULL,
    `decimal_digits` TINYINT NOT NULL DEFAULT 2,

    UNIQUE INDEX `currency_code_key`(`code`),
    PRIMARY KEY (`currency_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `language` (
    `language_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `native_name` VARCHAR(255) NULL,
    `alpha_2` VARCHAR(3) NULL,
    `is_rtl` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `language_alpha_2_key`(`alpha_2`),
    PRIMARY KEY (`language_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `contact_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `contact_hash` VARCHAR(31) NOT NULL,
    `owner_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `is_starred` BOOLEAN NOT NULL DEFAULT false,
    `meta` JSON NULL,
    `middle_name` VARCHAR(255) NULL,
    `prefix` VARCHAR(255) NULL,
    `suffix` VARCHAR(255) NULL,
    `phonetic_first` VARCHAR(255) NULL,
    `phonetic_middle` VARCHAR(255) NULL,
    `phonetic_last` VARCHAR(255) NULL,
    `nickname` VARCHAR(255) NULL,
    `file_as` VARCHAR(255) NULL,
    `company` VARCHAR(255) NULL,
    `job_title` VARCHAR(255) NULL,
    `department` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,
    `province` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `street_address` TEXT NULL,
    `postal_code` VARCHAR(10) NULL,
    `po_box` VARCHAR(255) NULL,
    `label` VARCHAR(255) NULL,
    `birthday` DATETIME(3) NULL,
    `event` VARCHAR(255) NULL,
    `notes` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `relationship` VARCHAR(255) NULL,
    `chat` VARCHAR(255) NULL,
    `internet_call` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `contact_contact_hash_key`(`contact_hash`),
    UNIQUE INDEX `contact_owner_id_user_id_workspace_id_key`(`owner_id`, `user_id`, `workspace_id`),
    PRIMARY KEY (`contact_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_customfield` (
    `contact_customfield_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `contact_id` INTEGER UNSIGNED NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `field_name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `contact_customfield_contact_id_field_name_key`(`contact_id`, `field_name`),
    PRIMARY KEY (`contact_customfield_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_identity` (
    `contact_identity_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `contact_id` INTEGER UNSIGNED NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `type` ENUM('email', 'phone') NOT NULL,
    `category` ENUM('work', 'personal', 'company') NOT NULL DEFAULT 'personal',
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `contact_identity_contact_id_value_key`(`contact_id`, `value`),
    PRIMARY KEY (`contact_identity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `file_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `file_hash` VARCHAR(31) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `mime` VARCHAR(127) NULL,
    `size` DOUBLE NULL,
    `path` VARCHAR(255) NOT NULL,
    `meta` JSON NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NULL,
    `is_sys` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `file_file_hash_key`(`file_hash`),
    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `private_file` (
    `private_file_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `private_file_hash` VARCHAR(31) NOT NULL,
    `mime` VARCHAR(127) NOT NULL,
    `size` INTEGER UNSIGNED NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `storage_bucket_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `trashed_at` DATETIME(3) NULL,
    `is_parent_trashed` BOOLEAN NULL,
    `folder_id` INTEGER UNSIGNED NULL,
    `trashed_by_user_id` INTEGER UNSIGNED NULL,
    `meta` JSON NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'disabled',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `private_file_private_file_hash_key`(`private_file_hash`),
    INDEX `private_file_name_idx`(`name`),
    PRIMARY KEY (`private_file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header` (
    `header_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('logo', 'cover') NOT NULL,
    `shape` ENUM('empty', 'img', 'letter') NOT NULL,
    `position_y` VARCHAR(31) NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NULL,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`header_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_module` (
    `header_module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_note` (
    `header_note_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `note_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_note_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_meeting` (
    `header_meeting_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_meeting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_service` (
    `header_service_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_service_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_project` (
    `header_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_opportunity` (
    `header_opportunity_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_opportunity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_user_profile` (
    `header_user_profile_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_user_profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header_workspace_profile` (
    `header_workspace_profile_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL,
    `header_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`header_workspace_profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `virtual_background` (
    `virtual_background_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `thumbnail` VARCHAR(121) NULL,
    `file_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`virtual_background_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emoji` (
    `emoji_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `emoji` VARCHAR(255) NOT NULL,
    `unicode` VARCHAR(62) NOT NULL,
    `title` VARCHAR(62) NOT NULL,
    `alias` VARCHAR(31) NOT NULL,
    `file_id` INTEGER UNSIGNED NOT NULL,
    `emoji_category_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`emoji_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emoji_category` (
    `emoji_category_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NULL,
    `name` VARCHAR(31) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`emoji_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_asset` (
    `system_asset_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('cover') NOT NULL,
    `system_asset_category_id` INTEGER UNSIGNED NULL,
    `file_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`system_asset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_asset_category` (
    `system_asset_category_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`system_asset_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
CREATE TABLE `cancelled_meeting` (
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `cancellation_cause` VARCHAR(255) NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cancelled_meeting_meeting_id_key`(`meeting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
CREATE TABLE `reset_room_option` (
    `reset_room_option_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `remove_admins` BOOLEAN NOT NULL DEFAULT false,
    `remove_attendees` BOOLEAN NOT NULL DEFAULT false,
    `remove_agenda` BOOLEAN NOT NULL DEFAULT false,
    `remove_chat` BOOLEAN NOT NULL DEFAULT false,
    `remove_projects` BOOLEAN NOT NULL DEFAULT false,
    `remove_breakoutRoom` BOOLEAN NOT NULL DEFAULT false,
    `remove_description` BOOLEAN NOT NULL DEFAULT false,
    `remove_note` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `reset_room_option_meeting_id_key`(`meeting_id`),
    PRIMARY KEY (`reset_room_option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `breakoutroom_setting` (
    `meeting_room_setting_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `is_allowed_to_main_room` BOOLEAN NOT NULL DEFAULT true,
    `closure_timeout` TINYINT UNSIGNED NOT NULL DEFAULT 5,
    `terminate_on_minute` INTEGER NULL,

    PRIMARY KEY (`meeting_room_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_timeslot` (
    `meeting_timeslot_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `is_confirmed` BOOLEAN NOT NULL,
    `initial_order` TINYINT UNSIGNED NULL,
    `start` DATETIME NOT NULL,
    `end` DATETIME NOT NULL,

    PRIMARY KEY (`meeting_timeslot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
CREATE TABLE `meeting_recording` (
    `meeting_recording_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_recording_hash` VARCHAR(128) NOT NULL,
    `meeting_id` INTEGER UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `preview_gif_file_id` INTEGER UNSIGNED NULL,
    `preview_thumbnail_file_id` INTEGER UNSIGNED NULL,
    `recording_start_time` DATETIME NOT NULL,
    `recording_end_time` DATETIME NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'disabled',
    `is_completed` BOOLEAN NOT NULL DEFAULT false,
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `meta` JSON NULL,
    `share_meeting_attendee` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `meeting_recording_meeting_recording_hash_key`(`meeting_recording_hash`),
    PRIMARY KEY (`meeting_recording_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_recording_user` (
    `meeting_recording_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `meeting_recording_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `viewed_at` DATETIME NULL,
    `is_visible_on_profile` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `meeting_recording_user_meeting_recording_id_user_id_key`(`meeting_recording_id`, `user_id`),
    PRIMARY KEY (`meeting_recording_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_recording_file` (
    `meeting_recording_file_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_recording_id` INTEGER UNSIGNED NULL,
    `recorded_file_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `kind` ENUM('cam', 'mic', 'screen') NOT NULL,
    `peer_id` VARCHAR(31) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_recording_file_meeting_recording_id_recorded_file_id_key`(`meeting_recording_id`, `recorded_file_id`),
    PRIMARY KEY (`meeting_recording_file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_transcription` (
    `meeting_transcription_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `text` TEXT NOT NULL,
    `no_speech_prob` DOUBLE NULL,
    `audio_file_name` VARCHAR(255) NULL,
    `speaker_name` VARCHAR(255) NULL,
    `engine` ENUM('openai', 'ctranslate2', 'iotype') NOT NULL DEFAULT 'ctranslate2',
    `start_at` TIMESTAMP(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`meeting_transcription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_analysis` (
    `meeting_analysis_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `text` TEXT NOT NULL,
    `type` ENUM('part_summarized', 'total_summarized', 'total_action_list') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`meeting_analysis_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_prompt` (
    `ai_prompt_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `ai_prompt_hash` VARCHAR(191) NOT NULL,
    `ai_session_id` INTEGER UNSIGNED NOT NULL,
    `thread_id` VARCHAR(255) NULL,
    `tokens_input` INTEGER UNSIGNED NOT NULL,
    `tokens_output` INTEGER UNSIGNED NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `is_confirmed` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ai_prompt_ai_prompt_hash_key`(`ai_prompt_hash`),
    PRIMARY KEY (`ai_prompt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_prompt_template` (
    `ai_prompt_template_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `ai_prompt_template_hash` VARCHAR(191) NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `title` TEXT NOT NULL,
    `question` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ai_prompt_template_ai_prompt_template_hash_key`(`ai_prompt_template_hash`),
    PRIMARY KEY (`ai_prompt_template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_user_ai` (
    `meeting_user_ai_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_user_id` INTEGER UNSIGNED NOT NULL,
    `ai_prompt_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `meeting_user_ai_meeting_user_id_ai_prompt_id_key`(`meeting_user_id`, `ai_prompt_id`),
    PRIMARY KEY (`meeting_user_ai_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_session` (
    `ai_session_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `ai_session_hash` VARCHAR(191) NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `state` ENUM('open', 'close') NOT NULL DEFAULT 'open',
    `ai_session_type` ENUM('assistant', 'chrome_app', 'meeting', 'project', 'note') NOT NULL DEFAULT 'meeting',
    `meeting_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ai_session_ai_session_hash_key`(`ai_session_hash`),
    PRIMARY KEY (`ai_session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module` (
    `module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(31) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(255) NULL,
    `description` TEXT NOT NULL,
    `version` VARCHAR(7) NOT NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `is_sys` BOOLEAN NOT NULL DEFAULT false,
    `is_visible` BOOLEAN NOT NULL DEFAULT false,
    `is_on_marketplace` BOOLEAN NOT NULL DEFAULT false,
    `status` TINYINT UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `module_category_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `module_key_key`(`key`),
    PRIMARY KEY (`module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_category` (
    `module_category_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `module_category_key_key`(`key`),
    PRIMARY KEY (`module_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_config` (
    `module_config_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_visible` BOOLEAN NULL,
    `is_editable` BOOLEAN NOT NULL DEFAULT false,
    `system_asset_id` INTEGER UNSIGNED NULL,
    `parent_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `module_config_name_module_id_key`(`name`, `module_id`),
    PRIMARY KEY (`module_config_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_module_config` (
    `user_module_config_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_config_id` INTEGER UNSIGNED NOT NULL,
    `user_integrated_module_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NULL,
    `value` TEXT NULL,

    PRIMARY KEY (`user_module_config_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usertype` (
    `usertype_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`usertype_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usertype_module` (
    `usertype_module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `usertype_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`usertype_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `notification_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_id` INTEGER UNSIGNED NULL,
    `src_user_id` INTEGER UNSIGNED NULL,
    `dst_user_id` INTEGER UNSIGNED NOT NULL,
    `template` ENUM('meeting_canceled', 'meeting_poll_canceled', 'meeting_poll_declined_one', 'meeting_declined_one', 'meeting_poll_updated', 'meeting_knock_request', 'meeting_all_voted', 'meeting_vote', 'meeting_invite_poll', 'meeting_invite', 'meeting_updated', 'meeting_reminder_tomorrow', 'meeting_reminder_1hr', 'meeting_reminder_30min', 'meeting_reminder_now', 'meeting_start', 'meeting_confirmed', 'meeting_missed', 'meeting_invitation_approved', 'meeting_attended', 'room_opened', 'room_invitation_approved', 'room_added', 'booking_declined', 'booking_canceled', 'booking_confirmed', 'booking_pending', 'booking_rescheduled', 'booking_auto_confirm', 'booking_invited', 'module_request_access', 'module_request_access_reply', 'workspace_invite', 'workspace_join', 'workspace_left', 'page_invite', 'page_update', 'matter_added', 'notification_test', 'opportunity_updated', 'opportunity_expressed', 'opportunity_assigned', 'opportunity_invited', 'service_invite', 'service_host_changed', 'meeting_recording_invite') NOT NULL,
    `meta` JSON NULL,
    `is_seen` BOOLEAN NOT NULL DEFAULT false,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `session_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `session_hash` VARCHAR(31) NOT NULL,
    `jti` VARCHAR(31) NOT NULL,
    `authorized_app_id` INTEGER UNSIGNED NULL,
    `ip` VARCHAR(63) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `session_session_hash_key`(`session_hash`),
    UNIQUE INDEX `session_jti_key`(`jti`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_user` (
    `session_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `session_id` INTEGER UNSIGNED NOT NULL,
    `notification_token` TEXT NULL,
    `notification_token_expiration_time` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`session_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_device` (
    `session_device_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `browser_name` VARCHAR(63) NULL,
    `browser_ver` VARCHAR(31) NULL,
    `device_model` VARCHAR(63) NULL,
    `device_type` VARCHAR(63) NULL,
    `device_vendor` VARCHAR(63) NULL,
    `os_name` VARCHAR(31) NULL,
    `os_ver` VARCHAR(31) NULL,
    `cpu` VARCHAR(63) NULL,
    `session_user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `session_device_session_user_id_key`(`session_user_id`),
    PRIMARY KEY (`session_device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `console_project` (
    `console_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `domain` VARCHAR(255) NOT NULL,
    `logomark_file_id` INTEGER UNSIGNED NULL,
    `logomark_dark_file_id` INTEGER UNSIGNED NULL,
    `logotype_file_id` INTEGER UNSIGNED NULL,
    `logotype_dark_file_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `console_project_domain_idx`(`domain`),
    PRIMARY KEY (`console_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_console_project` (
    `user_console_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `role_id` INTEGER UNSIGNED NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_console_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `console_project_module` (
    `console_project_module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`console_project_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `service_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(63) NOT NULL,
    `service_hash` VARCHAR(31) NOT NULL,
    `description` TEXT NULL,
    `availability_template_id` INTEGER UNSIGNED NULL,
    `from_date` DATE NULL,
    `to_date` DATE NULL,
    `period_time` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `max_booking_per_day` INTEGER NULL,
    `min_booking_notice` INTEGER NOT NULL,
    `buffer_before_meeting` INTEGER NOT NULL,
    `buffer_after_meeting` INTEGER NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'disabled',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `booking_confirmation` ENUM('auto', 'pending') NOT NULL DEFAULT 'auto',
    `max_attendee_booking_block` SMALLINT UNSIGNED NULL DEFAULT 1,
    `is_draft` BOOLEAN NOT NULL,
    `start_time_increment` INTEGER UNSIGNED NOT NULL DEFAULT 30,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `form_id` INTEGER UNSIGNED NULL,
    `meta` JSON NULL,
    `terms_and_conditions` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `show_company_name` BOOLEAN NOT NULL DEFAULT false,
    `show_host_name` BOOLEAN NOT NULL DEFAULT false,
    `is_login_required` BOOLEAN NULL DEFAULT false,
    `meeting_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `service_service_hash_key`(`service_hash`),
    UNIQUE INDEX `service_meeting_id_key`(`meeting_id`),
    INDEX `service_name_idx`(`name`),
    UNIQUE INDEX `service_url_workspace_id_key`(`url`, `workspace_id`),
    PRIMARY KEY (`service_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_project` (
    `meeting_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `service_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `service_project_project_id_service_id_key`(`project_id`, `service_id`),
    PRIMARY KEY (`meeting_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_user` (
    `service_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `service_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `viewed_at` DATETIME NULL,
    `is_visible_on_profile` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `service_user_service_id_user_id_key`(`service_id`, `user_id`),
    PRIMARY KEY (`service_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_host` (
    `service_host_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER UNSIGNED NOT NULL,
    `is_required` BOOLEAN NULL DEFAULT false,
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `service_host_service_id_user_id_key`(`service_id`, `user_id`),
    PRIMARY KEY (`service_host_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_price` (
    `service_price_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(127) NULL,
    `type` ENUM('paid', 'not_paid', 'donation') NOT NULL,
    `service_id` INTEGER UNSIGNED NOT NULL,
    `currency_id` INTEGER UNSIGNED NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `show_free` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `duration` INTEGER NOT NULL,
    `order` SMALLINT UNSIGNED NOT NULL,
    `location_id` INTEGER UNSIGNED NULL,
    `location_value` VARCHAR(255) NULL,
    `meta` JSON NULL,
    `pay_with_stripe` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`service_price_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_booking_policy` (
    `service_booking_policy_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `allow_rescheduling` BOOLEAN NULL DEFAULT true,
    `cancellation_fee_type` ENUM('percentage_fee', 'no_fee') NOT NULL,
    `cancellation_fee_amount` INTEGER NULL DEFAULT 0,
    `title` VARCHAR(127) NULL,
    `auto_generate_policy` BOOLEAN NOT NULL,
    `policy_message` VARCHAR(255) NULL,
    `cancellation_window_minutes` INTEGER NOT NULL DEFAULT 0,
    `is_enabled` BOOLEAN NULL DEFAULT true,
    `service_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`service_booking_policy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `availability_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `date` DATE NULL,
    `type` ENUM('default', 'date') NOT NULL,
    `week_day` ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday') NULL,
    `is_available` BOOLEAN NULL DEFAULT true,
    `availability_template_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`availability_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability_template` (
    `availability_template_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `timezone_id` INTEGER UNSIGNED NULL,
    `type` ENUM('general', 'template', 'service') NOT NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`availability_template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability_template_module` (
    `availability_template_module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `availability_template_id` INTEGER UNSIGNED NOT NULL,
    `user_integrated_module_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`availability_template_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `location_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(31) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `location_key_key`(`key`),
    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_location` (
    `meeting_location_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(255) NULL,
    `meta` JSON NULL,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `location_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `meeting_location_meeting_id_key`(`meeting_id`),
    PRIMARY KEY (`meeting_location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating` (
    `rating_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `rate` TINYINT UNSIGNED NOT NULL,
    `comment` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `form_submitted_id` INTEGER UNSIGNED NULL,
    `meeting_id` INTEGER UNSIGNED NULL,
    `module_id` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`rating_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `server` (
    `server_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `core_api_address` VARCHAR(255) NOT NULL,
    `core_ws_address` VARCHAR(255) NOT NULL,
    `hostname` VARCHAR(255) NOT NULL,
    `region` VARCHAR(255) NOT NULL,
    `country_id` INTEGER UNSIGNED NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`server_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `console_project_language` (
    `console_project_language_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `language_id` INTEGER UNSIGNED NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `console_project_language_language_id_console_project_id_key`(`language_id`, `console_project_id`),
    PRIMARY KEY (`console_project_language_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_info` (
    `workspace_info_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `plan_id` INTEGER UNSIGNED NULL,
    `plan_expire_at` DATETIME(3) NULL,
    `plan_auto_renew` BOOLEAN NOT NULL DEFAULT false,
    `trial_started_at` DATETIME(3) NULL,
    `is_storage_full` BOOLEAN NOT NULL DEFAULT false,
    `plan_interval` ENUM('monthly', 'yearly', 'daily', 'weekly', 'custom', 'none') NULL,
    `max_seat` INTEGER NULL,
    `default_payment_method` ENUM('none', 'card', 'credit', 'invoice') NOT NULL DEFAULT 'none',
    `invoice_email` VARCHAR(255) NULL,
    `invoice_postal_code` VARCHAR(255) NULL,
    `country_id` INTEGER UNSIGNED NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `workspace_info_workspace_id_key`(`workspace_id`),
    PRIMARY KEY (`workspace_info_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_payment_method` (
    `stripe_payment_method_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_info_id` INTEGER UNSIGNED NOT NULL,
    `stripe_pm_id` VARCHAR(191) NULL,
    `last4_digits` VARCHAR(255) NULL,
    `exp_month` TINYINT UNSIGNED NULL,
    `exp_year` SMALLINT UNSIGNED NULL,
    `brand` VARCHAR(255) NULL,
    `is_expired` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `stripe_payment_method_workspace_info_id_key`(`workspace_info_id`),
    UNIQUE INDEX `stripe_payment_method_stripe_pm_id_key`(`stripe_pm_id`),
    PRIMARY KEY (`stripe_payment_method_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan` (
    `plan_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `stripe_prod_id` VARCHAR(191) NULL,
    `stripe_monthly_price_id` VARCHAR(191) NULL,
    `stripe_yearly_price_id` VARCHAR(191) NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `workspace_type_id` INTEGER UNSIGNED NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `monthly_price` INTEGER NOT NULL DEFAULT 0,
    `yearly_price` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `plan_stripe_prod_id_key`(`stripe_prod_id`),
    UNIQUE INDEX `plan_stripe_monthly_price_id_key`(`stripe_monthly_price_id`),
    UNIQUE INDEX `plan_stripe_yearly_price_id_key`(`stripe_yearly_price_id`),
    PRIMARY KEY (`plan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_config` (
    `plan_config_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `plan_module_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `plan_config_name_key`(`name`),
    PRIMARY KEY (`plan_config_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_config_value` (
    `console_project_plan_config_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_config_id` INTEGER UNSIGNED NOT NULL,
    `plan_id` INTEGER UNSIGNED NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `plan_config_value_plan_id_plan_config_id_key`(`plan_id`, `plan_config_id`),
    PRIMARY KEY (`console_project_plan_config_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_module` (
    `plan_module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_id` INTEGER UNSIGNED NOT NULL,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `plan_module_plan_id_module_id_key`(`plan_id`, `module_id`),
    PRIMARY KEY (`plan_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addon_item` (
    `addon_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `stripe_prod_id` VARCHAR(191) NULL,
    `stripe_price_id` VARCHAR(191) NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` INTEGER NOT NULL DEFAULT 10,
    `capacity_recording` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `addon_item_stripe_prod_id_key`(`stripe_prod_id`),
    UNIQUE INDEX `addon_item_stripe_price_id_key`(`stripe_price_id`),
    PRIMARY KEY (`addon_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_info_addon_item` (
    `workspace_info_addon_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_info_id` INTEGER UNSIGNED NOT NULL,
    `addon_item_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`workspace_info_addon_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
CREATE TABLE `workspace_type` (
    `workspace_type_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `domain` VARCHAR(63) NOT NULL,
    `description` TEXT NULL,
    `custom_css` TEXT NULL,
    `custom_js` TEXT NULL,
    `font` VARCHAR(63) NULL,
    `primary_color` VARCHAR(31) NULL,
    `primary_dark_color` VARCHAR(31) NULL,
    `secondary_color` VARCHAR(31) NULL,
    `secondary_dark_color` VARCHAR(31) NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `logomark_file_id` INTEGER UNSIGNED NULL,
    `logomark_dark_file_id` INTEGER UNSIGNED NULL,
    `logotype_file_id` INTEGER UNSIGNED NULL,
    `logotype_dark_file_id` INTEGER UNSIGNED NULL,
    `link_preview_file_id` INTEGER UNSIGNED NULL,

    INDEX `workspace_type_domain_idx`(`domain`),
    PRIMARY KEY (`workspace_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access` (
    `access_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `type` ENUM('console', 'client') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `access_key_key`(`key`),
    PRIMARY KEY (`access_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `role_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `workspace_id` INTEGER UNSIGNED NULL,
    `is_default` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access_role` (
    `access_role_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `value` BOOLEAN NOT NULL,
    `role_id` INTEGER UNSIGNED NOT NULL,
    `access_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `workspace_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `access_role_role_id_access_id_key`(`role_id`, `access_id`),
    PRIMARY KEY (`access_role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_profile` (
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'public',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `meta` JSON NULL,
    `name` VARCHAR(255) NULL,
    `slogan` VARCHAR(255) NULL,
    `location` VARCHAR(255) NULL,
    `bio` VARCHAR(510) NULL,
    `social` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `workspace_profile_workspace_id_key`(`workspace_id`),
    PRIMARY KEY (`workspace_profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_profile_user` (
    `workspace_profile_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,

    UNIQUE INDEX `workspace_profile_user_workspace_profile_id_user_id_key`(`workspace_profile_id`, `user_id`),
    PRIMARY KEY (`workspace_profile_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile` (
    `user_profile_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_user_id` INTEGER UNSIGNED NOT NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'public',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `bio` TEXT NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `meta` JSON NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_profile_workspace_user_id_key`(`workspace_user_id`),
    PRIMARY KEY (`user_profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_user` (
    `user_profile_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,

    UNIQUE INDEX `user_profile_user_user_profile_id_user_id_key`(`user_profile_id`, `user_id`),
    PRIMARY KEY (`user_profile_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_social` (
    `profile_social_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `link` VARCHAR(255) NULL,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `type` ENUM('facebook', 'instagram', 'twitter', 'youtube', 'linkedin') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_social_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_address` (
    `profile_address_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `location_latitude` DOUBLE NULL,
    `location_longitude` DOUBLE NULL,
    `address` VARCHAR(255) NULL,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `is_visible_by_map` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_profile_address` (
    `profile_address_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `location_latitude` DOUBLE NULL,
    `location_longitude` DOUBLE NULL,
    `address` VARCHAR(255) NULL,
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL,
    `is_visible_by_map` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_experience` (
    `profile_experience_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `company_id` INTEGER UNSIGNED NULL,
    `job_position_id` INTEGER UNSIGNED NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `location` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_experience_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_education` (
    `profile_education_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `school_id` INTEGER UNSIGNED NULL,
    `degree_id` INTEGER UNSIGNED NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_education_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_association` (
    `profile_association_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `job_position_id` INTEGER UNSIGNED NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `location` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_association_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_profile_association` (
    `profile_association_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `job_position_id` INTEGER UNSIGNED NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `location` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_association_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_award` (
    `profile_award_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_award_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_profile_award` (
    `profile_award_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `company_id` INTEGER UNSIGNED NULL,
    `date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_award_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_certification` (
    `profile_certification_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `certification_number` VARCHAR(127) NOT NULL,
    `date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`profile_certification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school` (
    `school_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `school_name_key`(`name`),
    PRIMARY KEY (`school_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `degree` (
    `degree_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `degree_name_key`(`name`),
    PRIMARY KEY (`degree_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `company_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `company_name_key`(`name`),
    PRIMARY KEY (`company_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_position` (
    `job_position_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `job_position_name_key`(`name`),
    PRIMARY KEY (`job_position_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `label` (
    `label_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `label_name_console_project_id_key`(`name`, `console_project_id`),
    PRIMARY KEY (`label_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `label_item` (
    `label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `label_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `label_item_name_label_id_key`(`name`, `label_id`),
    PRIMARY KEY (`label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `label_module` (
    `label_module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `label_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `label_module_module_id_label_id_key`(`module_id`, `label_id`),
    PRIMARY KEY (`label_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_label_item` (
    `project_label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `label_item_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `project_label_item_project_id_label_item_id_key`(`project_id`, `label_item_id`),
    PRIMARY KEY (`project_label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_label_item` (
    `user_profile_label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,
    `label_item_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `user_profile_label_item_user_profile_id_label_item_id_key`(`user_profile_id`, `label_item_id`),
    PRIMARY KEY (`user_profile_label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_profile_label_item` (
    `user_profile_label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `label_item_id` INTEGER UNSIGNED NOT NULL,
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `workspace_profile_label_item_workspace_profile_id_label_item_key`(`workspace_profile_id`, `label_item_id`),
    PRIMARY KEY (`user_profile_label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document` (
    `document_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `document_hash` VARCHAR(191) NOT NULL,
    `is_draft` BOOLEAN NOT NULL DEFAULT false,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `meeting_agenda_id` INTEGER UNSIGNED NULL,
    `note_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `document_document_hash_key`(`document_hash`),
    UNIQUE INDEX `document_meeting_agenda_id_key`(`meeting_agenda_id`),
    UNIQUE INDEX `document_note_id_key`(`note_id`),
    PRIMARY KEY (`document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note` (
    `note_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `note_hash` VARCHAR(191) NOT NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'disabled',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `is_e2ee` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(255) NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `is_trash` BOOLEAN NOT NULL DEFAULT false,
    `trashed_at` DATETIME(3) NULL,
    `is_archived` BOOLEAN NOT NULL DEFAULT false,
    `share_meeting_attendee` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `note_note_hash_key`(`note_hash`),
    INDEX `note_name_idx`(`name`),
    PRIMARY KEY (`note_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_template` (
    `document_template_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(31) NULL,
    `document_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `document_template_document_id_key`(`document_id`),
    UNIQUE INDEX `document_template_document_template_id_user_id_key`(`document_template_id`, `user_id`),
    PRIMARY KEY (`document_template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_agenda` (
    `meeting_agenda_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_agenda_hash` VARCHAR(191) NOT NULL,
    `meeting_user_id` INTEGER UNSIGNED NOT NULL,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `order` INTEGER UNSIGNED NULL,
    `name` VARCHAR(255) NULL,
    `timebox` SMALLINT UNSIGNED NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `is_completed` BOOLEAN NOT NULL DEFAULT false,
    `is_open_time` BOOLEAN NOT NULL DEFAULT true,
    `agenda_status` ENUM('played', 'paused', 'not_started') NOT NULL DEFAULT 'not_started',
    `start_time` DATETIME(3) NULL,
    `elapsed_time` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `meeting_agenda_meeting_agenda_hash_key`(`meeting_agenda_hash`),
    PRIMARY KEY (`meeting_agenda_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_user_agenda` (
    `meeting_user_agenda_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_user_id` INTEGER UNSIGNED NOT NULL,
    `meeting_agenda_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `meeting_user_agenda_meeting_user_id_meeting_agenda_id_key`(`meeting_user_id`, `meeting_agenda_id`),
    PRIMARY KEY (`meeting_user_agenda_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_user_note` (
    `meeting_user_note_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_user_id` INTEGER UNSIGNED NOT NULL,
    `note_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `meeting_user_note_meeting_user_id_note_id_key`(`meeting_user_id`, `note_id`),
    PRIMARY KEY (`meeting_user_note_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note_user` (
    `note_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `note_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `viewed_at` DATETIME NULL,
    `is_visible_on_profile` BOOLEAN NOT NULL DEFAULT false,
    `is_starred` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `note_user_note_id_user_id_key`(`note_id`, `user_id`),
    PRIMARY KEY (`note_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_block` (
    `document_block_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `document_block_hash` VARCHAR(191) NOT NULL,
    `document_id` INTEGER UNSIGNED NOT NULL,
    `document_block_type_id` INTEGER UNSIGNED NOT NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `private_file_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `above_hash` VARCHAR(255) NULL,
    `below_hash` VARCHAR(255) NULL,
    `content` VARCHAR(255) NULL,
    `checked` BOOLEAN NULL,
    `image_scale` DOUBLE NULL,

    UNIQUE INDEX `document_block_document_block_hash_key`(`document_block_hash`),
    PRIMARY KEY (`document_block_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_block_type` (
    `document_block_type_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(63) NOT NULL,
    `name` VARCHAR(63) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(63) NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `alias` VARCHAR(255) NULL,

    UNIQUE INDEX `document_block_type_key_key`(`key`),
    PRIMARY KEY (`document_block_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_mark_type` (
    `document_mark_type_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` ENUM('bold', 'code', 'italic', 'underline', 'link', 'text_color', 'strike_through', 'text_highlight') NOT NULL,
    `document_child_id` INTEGER UNSIGNED NOT NULL,
    `document_child_hash` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `document_mark_type_document_child_hash_key_key`(`document_child_hash`, `key`),
    PRIMARY KEY (`document_mark_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_child` (
    `document_child_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `document_child_hash` VARCHAR(191) NOT NULL,
    `document_block_id` INTEGER UNSIGNED NOT NULL,
    `document_block_type_id` INTEGER UNSIGNED NOT NULL,
    `text` MEDIUMTEXT NULL,
    `placeholder` TEXT NULL,
    `document_mark_color` VARCHAR(255) NULL,
    `parent_child_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `document_child_document_child_hash_document_block_id_key`(`document_child_hash`, `document_block_id`),
    PRIMARY KEY (`document_child_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `form` (
    `form_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `completion_message` VARCHAR(255) NULL,
    `submit_alias` VARCHAR(255) NULL,
    `document_id` INTEGER UNSIGNED NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `form_document_id_key`(`document_id`),
    PRIMARY KEY (`form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `form_submitted` (
    `form_submitted_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `form_id` INTEGER UNSIGNED NULL,
    `document_block_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `value` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`form_submitted_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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
    `utm_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `user_user_hash_key`(`user_hash`),
    UNIQUE INDEX `user_avatar_file_id_key`(`avatar_file_id`),
    UNIQUE INDEX `user_console_project_id_username_key`(`console_project_id`, `username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_identity` (
    `user_identity_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `console_project_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `type` ENUM('email', 'phone') NOT NULL,
    `is_verified` BOOLEAN NOT NULL,
    `is_primary` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_identity_console_project_id_value_key`(`console_project_id`, `value`),
    PRIMARY KEY (`user_identity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_integrated_module` (
    `user_integrated_module_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `console_project_module_id` INTEGER UNSIGNED NOT NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_integrated_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_authorized_app` (
    `authorized_app_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` VARCHAR(127) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `user_authorized_app_client_id_user_id_key`(`client_id`, `user_id`),
    PRIMARY KEY (`authorized_app_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_interact` (
    `user_interact_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `owner_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `interacted_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_interact_workspace_id_owner_id_user_id_key`(`workspace_id`, `owner_id`, `user_id`),
    PRIMARY KEY (`user_interact_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usergroup` (
    `usergroup_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `owner_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `chat_id` VARCHAR(63) NULL,
    `chat_name` VARCHAR(63) NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_starred` BOOLEAN NOT NULL DEFAULT false,

    INDEX `usergroup_name_idx`(`name`),
    PRIMARY KEY (`usergroup_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usergroup_user` (
    `usergroup_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `usergroup_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `contact_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usergroup_user_usergroup_id_user_id_key`(`usergroup_id`, `user_id`),
    UNIQUE INDEX `usergroup_user_usergroup_id_contact_id_key`(`usergroup_id`, `contact_id`),
    PRIMARY KEY (`usergroup_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `share` (
    `share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `src_user_id` INTEGER UNSIGNED NOT NULL,
    `dst_user_id` INTEGER UNSIGNED NULL,
    `dst_usergroup_id` INTEGER UNSIGNED NULL,
    `type` ENUM('child', 'parent') NOT NULL DEFAULT 'child',
    `permission` TINYINT UNSIGNED NOT NULL,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `meta` JSON NULL,
    `sharing_label_id` INTEGER UNSIGNED NULL,
    `message` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note_share` (
    `note_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `note_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `note_share_share_id_key`(`share_id`),
    PRIMARY KEY (`note_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_share` (
    `project_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `is_meeting_shared` BOOLEAN NOT NULL DEFAULT false,
    `is_document_shared` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `project_share_share_id_key`(`share_id`),
    PRIMARY KEY (`project_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opportunity_share` (
    `opportunity_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `opportunity_share_share_id_key`(`share_id`),
    PRIMARY KEY (`opportunity_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_recording_share` (
    `meeting_recording_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `meeting_recording_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `meeting_recording_share_share_id_key`(`share_id`),
    PRIMARY KEY (`meeting_recording_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_share` (
    `meeting_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `meeting_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `meeting_share_share_id_key`(`share_id`),
    PRIMARY KEY (`meeting_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_share` (
    `service_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `service_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `service_share_share_id_key`(`share_id`),
    PRIMARY KEY (`service_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_share` (
    `user_profile_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `user_profile_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `user_profile_share_share_id_key`(`share_id`),
    PRIMARY KEY (`user_profile_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_profile_share` (
    `workspace_profile_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `workspace_profile_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `workspace_profile_share_share_id_key`(`share_id`),
    PRIMARY KEY (`workspace_profile_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
CREATE TABLE `meeting_user_token` (
    `meeting_user_id` INTEGER UNSIGNED NOT NULL,
    `hash` VARCHAR(32) NOT NULL,
    `action` VARCHAR(127) NOT NULL,
    `is_auto_login` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_user_token_hash_key`(`hash`),
    UNIQUE INDEX `meeting_user_token_meeting_user_id_action_key`(`meeting_user_id`, `action`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note_project` (
    `note_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `note_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `note_project_project_id_note_id_key`(`project_id`, `note_id`),
    PRIMARY KEY (`note_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_project` (
    `meeting_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_project_project_id_meeting_id_key`(`project_id`, `meeting_id`),
    PRIMARY KEY (`meeting_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_google` (
    `google_event_id` VARCHAR(255) NOT NULL,
    `gmail` VARCHAR(255) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `meeting_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_google_meeting_id_key`(`meeting_id`),
    UNIQUE INDEX `meeting_google_google_event_id_meeting_id_key`(`google_event_id`, `meeting_id`),
    PRIMARY KEY (`google_event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_appearance` (
    `workspace_appearance_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `logotype` ENUM('img', 'text') NOT NULL DEFAULT 'img',
    `logotype_text` VARCHAR(191) NULL,
    `logomark_file_id` INTEGER UNSIGNED NULL,
    `logomark_dark_file_id` INTEGER UNSIGNED NULL,
    `logotype_file_id` INTEGER UNSIGNED NULL,
    `logotype_dark_file_id` INTEGER UNSIGNED NULL,
    `link_preview_file_id` INTEGER UNSIGNED NULL,
    `custom_js` TEXT NULL,
    `custom_css` TEXT NULL,
    `primary_color` VARCHAR(31) NULL,
    `primary_dark_color` VARCHAR(31) NULL,
    `secondary_color` VARCHAR(31) NULL,
    `secondary_dark_color` VARCHAR(31) NULL,
    `domain` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `workspace_appearance_workspace_id_key`(`workspace_id`),
    PRIMARY KEY (`workspace_appearance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_history` (
    `search_history_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `keyword` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `searched_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `search_history_user_id_workspace_id_keyword_key`(`user_id`, `workspace_id`, `keyword`),
    PRIMARY KEY (`search_history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
CREATE TABLE `workspace_user_slack` (
    `workspace_user_slack_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_user_slack_hash` VARCHAR(31) NOT NULL,
    `slack_user_id` VARCHAR(31) NOT NULL,
    `workspace_user_id` INTEGER UNSIGNED NOT NULL,
    `team_id` VARCHAR(31) NOT NULL,
    `slack_username` VARCHAR(255) NOT NULL,
    `slack_notification_enable` BOOLEAN NOT NULL DEFAULT false,
    `slack_notification_channel_id` VARCHAR(31) NOT NULL,
    `slack_expire_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `workspace_user_slack_workspace_user_slack_hash_key`(`workspace_user_slack_hash`),
    PRIMARY KEY (`workspace_user_slack_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_onboarding` (
    `workspace_onboarding_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `industry` ENUM('technology', 'finance', 'food_beverage', 'legal_services', 'real_estate', 'consumer_goods', 'automotive', 'arts', 'healthcare', 'insurance', 'hospitality', 'education', 'media', 'sports', 'other') NULL,
    `role_at_work` ENUM('executive_business_owner', 'legal', 'analyst', 'project_manager', 'finance', 'human_resources', 'marketing', 'consultant', 'sales', 'engineer', 'content_creator', 'educator', 'healthcare_professional', 'other') NULL,
    `used_platform_before` BOOLEAN NULL,
    `using_platform_for` ENUM('sell_my_services_online', 'book_meetings', 'team_collaboration', 'meet_with_clients', 'client_relationship_management') NULL,
    `team_members_number` ENUM('n_1', 'n_2_10', 'n_11_50', 'n_51_100', 'n_more_than_100') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `workspace_onboarding_workspace_id_key`(`workspace_id`),
    PRIMARY KEY (`workspace_onboarding_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slack_workspace` (
    `slack_workspace_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `team_id` VARCHAR(31) NOT NULL,
    `team_name` VARCHAR(255) NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `authed_user_id` VARCHAR(31) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `slack_workspace_team_id_key`(`team_id`),
    PRIMARY KEY (`slack_workspace_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE `opportunity` (
    `opportunity_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_hash` VARCHAR(31) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `assignee_user_id` INTEGER UNSIGNED NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'disabled',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `client_type` ENUM('individual', 'company') NOT NULL,
    `meta` JSON NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `timeframe` DATETIME(3) NOT NULL,
    `audience` ENUM('public', 'private', 'partners') NOT NULL,
    `is_org_look_partner` BOOLEAN NOT NULL,
    `is_org_provide_assist` BOOLEAN NOT NULL,
    `status` ENUM('open', 'closed', 'assigned', 'archived') NOT NULL DEFAULT 'open',
    `service_requirements` ENUM('remote', 'in_person', 'remote_or_in_person') NOT NULL,
    `bar_license` BOOLEAN NOT NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `opportunity_opportunity_hash_key`(`opportunity_hash`),
    INDEX `opportunity_name_idx`(`name`),
    PRIMARY KEY (`opportunity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opportunity_user` (
    `opportunity_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `meta` JSON NULL,
    `is_visible_on_profile` BOOLEAN NOT NULL DEFAULT false,
    `is_starred` BOOLEAN NOT NULL DEFAULT false,
    `is_express_interest` BOOLEAN NOT NULL DEFAULT false,
    `is_client` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `viewed_at` DATETIME NULL,

    UNIQUE INDEX `opportunity_user_opportunity_id_user_id_key`(`opportunity_id`, `user_id`),
    PRIMARY KEY (`opportunity_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opportunity_location` (
    `opportunity_location_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `meta` JSON NOT NULL,

    UNIQUE INDEX `opportunity_location_opportunity_id_key`(`opportunity_id`),
    PRIMARY KEY (`opportunity_location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opportunity_language` (
    `opportunity_language_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `language_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `opportunity_language_opportunity_id_language_id_key`(`opportunity_id`, `language_id`),
    PRIMARY KEY (`opportunity_language_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `practice_areas_label_item` (
    `practice_areas_label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `label_item_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `practice_areas_label_item_opportunity_id_label_item_id_key`(`opportunity_id`, `label_item_id`),
    PRIMARY KEY (`practice_areas_label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opportunity_type_label_item` (
    `opportunity_type_label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `label_item_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `opportunity_type_label_item_opportunity_id_label_item_id_key`(`opportunity_id`, `label_item_id`),
    PRIMARY KEY (`opportunity_type_label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `focus_area_label_item` (
    `focus_area_label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `label_item_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `focus_area_label_item_opportunity_id_label_item_id_key`(`opportunity_id`, `label_item_id`),
    PRIMARY KEY (`focus_area_label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eligible_providers_label_item` (
    `eligible_providers_label_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `opportunity_id` INTEGER UNSIGNED NOT NULL,
    `label_item_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `eligible_providers_label_item_opportunity_id_label_item_id_key`(`opportunity_id`, `label_item_id`),
    PRIMARY KEY (`eligible_providers_label_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `booking_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `status` ENUM('reserved', 'confirmed', 'canceled') NOT NULL DEFAULT 'confirmed',
    `price` DOUBLE NOT NULL,
    `duration` INTEGER UNSIGNED NOT NULL,
    `location_id` INTEGER UNSIGNED NULL,
    `location_value` VARCHAR(255) NULL,
    `currency_id` INTEGER UNSIGNED NOT NULL,
    `variation_title` VARCHAR(127) NULL,
    `book_time` TIMESTAMP NOT NULL,
    `meeting_id` INTEGER UNSIGNED NULL,
    `meta` JSON NULL,
    `payment_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `service_price_id` INTEGER UNSIGNED NULL,
    `show_company_name` BOOLEAN NOT NULL DEFAULT false,
    `show_host_name` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `booking_meeting_id_key`(`meeting_id`),
    UNIQUE INDEX `booking_payment_id_key`(`payment_id`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_form_submitted` (
    `booking_form_submitted_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `form_submitted_id` INTEGER UNSIGNED NOT NULL,
    `booking_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`booking_form_submitted_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_invitee` (
    `booking_invitee_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `invitee_id` INTEGER UNSIGNED NOT NULL,
    `booking_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`booking_invitee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_connect` (
    `api_connect_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `is_trust` BOOLEAN NOT NULL DEFAULT false,
    `file_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `api_connect_user_id_key`(`user_id`),
    PRIMARY KEY (`api_connect_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_connect_key` (
    `client_id` VARCHAR(75) NOT NULL,
    `secret_key` VARCHAR(75) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `website_url` VARCHAR(255) NULL,
    `file_id` INTEGER UNSIGNED NULL,
    `api_connect_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `api_connect_key_secret_key_key`(`secret_key`),
    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_connect_log` (
    `api_connect_log_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `status` SMALLINT UNSIGNED NOT NULL,
    `method` ENUM('POST', 'PATCH', 'GET', 'PUT', 'DELETE', 'OPTIONS') NOT NULL,
    `api_connect_id` INTEGER UNSIGNED NOT NULL,
    `description` TEXT NULL,
    `ip` VARCHAR(63) NULL,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `origin` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`api_connect_log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_calendar_event` (
    `user_calendar_event_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `event_id` VARCHAR(255) NOT NULL,
    `recurrence_event_id` VARCHAR(255) NULL,
    `is_busy` BOOLEAN NOT NULL DEFAULT true,
    `user_id` INTEGER UNSIGNED NULL,
    `meeting_id` INTEGER UNSIGNED NULL,
    `user_calendar_sync_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `user_calendar_event_recurrence_event_id_idx`(`recurrence_event_id`),
    UNIQUE INDEX `user_calendar_event_event_id_user_calendar_sync_id_key`(`event_id`, `user_calendar_sync_id`),
    PRIMARY KEY (`user_calendar_event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_calendar_sync` (
    `user_calendar_sync_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `watch_id` VARCHAR(255) NOT NULL,
    `resource_id` VARCHAR(255) NOT NULL,
    `sync_token` VARCHAR(1023) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `calendar_id` VARCHAR(255) NOT NULL,
    `failed_at` DATETIME(3) NULL,
    `last_sync` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_calendar_sync_watch_id_key`(`watch_id`),
    PRIMARY KEY (`user_calendar_sync_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_integrated_calendar` (
    `user_integrated_calendar_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_calendar_sync_id` INTEGER UNSIGNED NOT NULL,
    `user_integrated_module_id` INTEGER UNSIGNED NOT NULL,
    `check_for_conflicts` BOOLEAN NOT NULL DEFAULT false,
    `push_events` BOOLEAN NOT NULL DEFAULT false,
    `is_two_way` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_integrated_calendar_user_integrated_module_id_user_cale_key`(`user_integrated_module_id`, `user_calendar_sync_id`),
    PRIMARY KEY (`user_integrated_calendar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_token` (
    `chat_token_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_user_id` INTEGER UNSIGNED NOT NULL,
    `session_id` INTEGER UNSIGNED NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`chat_token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_config` (
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `action` (
    `action_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(255) NULL,
    `method` ENUM('POST', 'PATCH', 'GET', 'PUT', 'DELETE', 'OPTIONS') NULL,
    `name` VARCHAR(63) NOT NULL,
    `scope` VARCHAR(63) NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`action_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_connect_client_action` (
    `api_connect_client_action_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `action_id` INTEGER UNSIGNED NOT NULL,
    `client_id` VARCHAR(127) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`api_connect_client_action_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_connect_client_uri` (
    `api_connect_client_uri_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` VARCHAR(127) NULL,
    `uri` VARCHAR(511) NOT NULL,
    `type` ENUM('deauthorize', 'redirect') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`api_connect_client_uri_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `widget` (
    `widget_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(63) NOT NULL,
    `name` VARCHAR(63) NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`widget_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_widget` (
    `user_widget_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `order` TINYINT UNSIGNED NULL,
    `widget_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_widget_user_id_workspace_id_widget_id_key`(`user_id`, `workspace_id`, `widget_id`),
    PRIMARY KEY (`user_widget_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_notification_setting` (
    `user_notification_setting_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `availability_template_id` INTEGER UNSIGNED NULL,
    `mode` TINYINT UNSIGNED NOT NULL,
    `email_mode` TINYINT UNSIGNED NOT NULL,
    `sms_mode` TINYINT UNSIGNED NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `email_on_missed_message` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `user_notification_setting_user_id_workspace_id_key`(`user_id`, `workspace_id`),
    PRIMARY KEY (`user_notification_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_notification_keyword` (
    `user_notification_keyword_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_notification_setting_id` INTEGER UNSIGNED NOT NULL,
    `keyword` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_notification_keyword_user_notification_setting_id_keywo_key`(`user_notification_setting_id`, `keyword`),
    PRIMARY KEY (`user_notification_keyword_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `payment_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER UNSIGNED NULL,
    `payment_module_id` INTEGER UNSIGNED NULL,
    `price` INTEGER UNSIGNED NOT NULL,
    `currency_id` INTEGER UNSIGNED NOT NULL,
    `workspace_user_id` INTEGER UNSIGNED NOT NULL,
    `transaction_id` VARCHAR(255) NOT NULL,
    `payment_status` ENUM('opened', 'completed', 'authorized', 'refunded', 'failed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `two_factor_method` (
    `two_factor_method_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('authenticator_app') NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`two_factor_method_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_two_factor_method` (
    `user_two_factor_method_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `two_factor_method_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `secret` VARCHAR(121) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_two_factor_method_user_id_two_factor_method_id_key`(`user_id`, `two_factor_method_id`),
    PRIMARY KEY (`user_two_factor_method_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `storage_bucket` (
    `storage_bucket_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(121) NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `size_used` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `storage_bucket_name_key`(`name`),
    UNIQUE INDEX `storage_bucket_workspace_id_key`(`workspace_id`),
    PRIMARY KEY (`storage_bucket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_user_storage_bucket` (
    `workspace_user_storage_bucket_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_user_id` INTEGER UNSIGNED NOT NULL,
    `storage_bucket_id` INTEGER UNSIGNED NOT NULL,
    `size_used` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `workspace_user_storage_bucket_workspace_user_id_storage_buck_key`(`workspace_user_id`, `storage_bucket_id`),
    PRIMARY KEY (`workspace_user_storage_bucket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folder` (
    `folder_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `folder_hash` VARCHAR(31) NOT NULL,
    `name` VARCHAR(121) NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `workspace_user_storage_bucket_id` INTEGER UNSIGNED NOT NULL,
    `trashed_at` DATETIME(3) NULL,
    `is_parent_trashed` BOOLEAN NULL,
    `color` VARCHAR(31) NULL,
    `trashed_by_user_id` INTEGER UNSIGNED NULL,
    `meta` JSON NULL,
    `url_privacy` ENUM('can_view_only', 'can_join', 'can_ask_for_access', 'disabled', 'public', 'bylink', 'private') NOT NULL DEFAULT 'disabled',
    `url_password` VARCHAR(191) NULL,
    `url_expire_at` DATETIME(3) NULL,
    `is_search_indexable` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `folder_folder_hash_key`(`folder_hash`),
    INDEX `folder_name_idx`(`name`),
    PRIMARY KEY (`folder_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `private_file_share` (
    `private_file_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `private_file_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `private_file_share_share_id_key`(`share_id`),
    PRIMARY KEY (`private_file_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folder_share` (
    `folder_share_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `share_id` INTEGER UNSIGNED NOT NULL,
    `folder_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `folder_share_share_id_key`(`share_id`),
    PRIMARY KEY (`folder_share_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `private_file_user` (
    `file_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `private_file_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `share_via_parent` BOOLEAN NULL DEFAULT false,
    `is_starred` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `private_file_user_private_file_id_user_id_key`(`private_file_id`, `user_id`),
    PRIMARY KEY (`file_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folder_user` (
    `folder_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `folder_id` INTEGER UNSIGNED NOT NULL,
    `calc_permission` TINYINT UNSIGNED NOT NULL,
    `is_shared_explicitly` BOOLEAN NOT NULL DEFAULT true,
    `share_via_parent` BOOLEAN NULL DEFAULT false,
    `is_starred` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `folder_user_folder_id_user_id_key`(`folder_id`, `user_id`),
    PRIMARY KEY (`folder_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folder_project` (
    `folder_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `folder_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `folder_project_project_id_folder_id_key`(`project_id`, `folder_id`),
    PRIMARY KEY (`folder_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `private_file_project` (
    `private_file_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `private_file_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `private_file_project_project_id_private_file_id_key`(`project_id`, `private_file_id`),
    PRIMARY KEY (`private_file_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sharing_label` (
    `sharing_label_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(127) NOT NULL,
    `workspace_user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sharing_label_workspace_user_id_title_key`(`workspace_user_id`, `title`),
    PRIMARY KEY (`sharing_label_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_log` (
    `meeting_log_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `meeting_id` INTEGER UNSIGNED NULL,
    `type_id` INTEGER UNSIGNED NOT NULL,
    `fired_by` VARCHAR(31) NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `fired_target` VARCHAR(31) NULL,
    `reason` VARCHAR(121) NULL,
    `extra` JSON NULL,
    `happened_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`meeting_log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_log_type` (
    `meeting_log_type_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(121) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meeting_log_type_name_key`(`name`),
    PRIMARY KEY (`meeting_log_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_history` (
    `module_history_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `entity_id` INTEGER UNSIGNED NOT NULL,
    `action` ENUM('create', 'update', 'add_share', 'delete_share', 'change_owner', 'accept_booking', 'decline_booking', 'url_privacy', 'open', 'close', 'archive', 'enable', 'disable', 'reschedule', 'trash', 'restore', 'upload', 'add_to_project', 'remove_from_project', 'opportunity_express_interest', 'opportunity_cancel_express_interest', 'opportunity_assign_provider', 'opportunity_unassign_provider', 'enable_chat', 'start_chat', 'disable_chat', 'confirm', 'vote', 'cancel', 'accept', 'decline', 'workspace_join', 'workspace_left', 'invite', 'delete') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`module_history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_reservation` (
    `reservation_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `subdomain` VARCHAR(31) NULL,
    `name` VARCHAR(255) NULL,
    `organization` VARCHAR(255) NULL,
    `reservation_status` ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    `workspace_type_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `workspace_reservation_subdomain_key`(`subdomain`),
    UNIQUE INDEX `workspace_reservation_workspace_type_id_email_key`(`workspace_type_id`, `email`),
    PRIMARY KEY (`reservation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_project` (
    `chat_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `chat_id` VARCHAR(127) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `chat_project_project_id_chat_id_key`(`project_id`, `chat_id`),
    PRIMARY KEY (`chat_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `task_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_hash` VARCHAR(31) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `priority` ENUM('Urgent', 'High', 'Normal', 'Low', 'None') NOT NULL DEFAULT 'None',
    `start_date` TIMESTAMP NULL,
    `end_date` TIMESTAMP NULL,
    `story_point` TINYINT UNSIGNED NULL,
    `order` INTEGER UNSIGNED NOT NULL,
    `is_trashed` BOOLEAN NULL DEFAULT false,
    `trashed_at` DATETIME(3) NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `task_type_id` INTEGER UNSIGNED NOT NULL,
    `task_status_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `task_task_hash_key`(`task_hash`),
    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_assignee` (
    `task_assignee_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_assignee_hash` VARCHAR(31) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `task_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `task_assignee_task_assignee_hash_key`(`task_assignee_hash`),
    UNIQUE INDEX `task_assignee_user_id_task_id_key`(`user_id`, `task_id`),
    PRIMARY KEY (`task_assignee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_type` (
    `task_type_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_type_hash` VARCHAR(31) NOT NULL,
    `workspace_id` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(127) NOT NULL,
    `order` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `task_type_task_type_hash_key`(`task_type_hash`),
    PRIMARY KEY (`task_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_status` (
    `task_status_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_status_hash` VARCHAR(31) NOT NULL,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(127) NOT NULL,
    `color_hex` VARCHAR(15) NULL,
    `order` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `task_status_type` ENUM('closed', 'active', 'done') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `task_status_task_status_hash_key`(`task_status_hash`),
    PRIMARY KEY (`task_status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_project` (
    `task_project_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER UNSIGNED NOT NULL,
    `task_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `task_project_project_id_task_id_key`(`project_id`, `task_id`),
    PRIMARY KEY (`task_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_clickup_team` (
    `user_clickup_team_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_clickup_team_hash` VARCHAR(31) NOT NULL,
    `name` VARCHAR(127) NOT NULL,
    `id` VARCHAR(255) NOT NULL,
    `user_integrated_module_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_clickup_team_user_clickup_team_hash_key`(`user_clickup_team_hash`),
    PRIMARY KEY (`user_clickup_team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_integrated_clickup_list` (
    `user_integrated_clickup_list_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_clickup_team_id` INTEGER UNSIGNED NOT NULL,
    `list_id` VARCHAR(255) NOT NULL,
    `webhook_id` VARCHAR(255) NULL,
    `check_for_tasks` BOOLEAN NOT NULL DEFAULT false,
    `push_tasks` BOOLEAN NOT NULL DEFAULT false,
    `is_two_way` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`user_integrated_clickup_list_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_integrated_task` (
    `user_integrated_task_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER UNSIGNED NOT NULL,
    `user_integrated_clickup_list_id` INTEGER UNSIGNED NOT NULL,
    `integrated_task_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_integrated_task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace_user_magiclink` (
    `workspace_user_magiclink_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `workspace_user_magiclink_hash` VARCHAR(31) NOT NULL,
    `workspace_user_id` INTEGER UNSIGNED NOT NULL,
    `id` VARCHAR(127) NOT NULL,
    `email` VARCHAR(127) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `workspace_user_magiclink_workspace_user_magiclink_hash_key`(`workspace_user_magiclink_hash`),
    PRIMARY KEY (`workspace_user_magiclink_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `magiclink_wallets` (
    `magiclink_wallets_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `magiclink_wallets_hash` VARCHAR(31) NOT NULL,
    `wallet_address` VARCHAR(127) NOT NULL,
    `network` VARCHAR(63) NOT NULL,
    `workspace_user_magiclink_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `magiclink_wallets_magiclink_wallets_hash_key`(`magiclink_wallets_hash`),
    PRIMARY KEY (`magiclink_wallets_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utm` (
    `utm_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`utm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `demo_user` (
    `demo_user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`demo_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meme_generator_photo` (
    `photo_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`photo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meme_generator_stat` (
    `stat_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`stat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meme_generator_photo_stat` (
    `photo_stat_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `photo_id` INTEGER UNSIGNED NOT NULL,
    `stat_id` INTEGER UNSIGNED NOT NULL,
    `value` INTEGER NOT NULL,

    PRIMARY KEY (`photo_stat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `country_timezone` ADD CONSTRAINT `country_timezone_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`country_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `country_timezone` ADD CONSTRAINT `country_timezone_timezone_id_fkey` FOREIGN KEY (`timezone_id`) REFERENCES `timezone`(`timezone_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `Contact_Owner` FOREIGN KEY (`owner_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `Contact_User` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_customfield` ADD CONSTRAINT `contact_customfield_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contact`(`contact_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_identity` ADD CONSTRAINT `contact_identity_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contact`(`contact_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file` ADD CONSTRAINT `private_file_storage_bucket_id_fkey` FOREIGN KEY (`storage_bucket_id`) REFERENCES `storage_bucket`(`storage_bucket_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file` ADD CONSTRAINT `private_file_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file` ADD CONSTRAINT `private_file_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`folder_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file` ADD CONSTRAINT `private_file_trashed_by_user_id_fkey` FOREIGN KEY (`trashed_by_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header` ADD CONSTRAINT `header_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header` ADD CONSTRAINT `header_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header` ADD CONSTRAINT `header_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header` ADD CONSTRAINT `header_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_module` ADD CONSTRAINT `header_module_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_module` ADD CONSTRAINT `header_module_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_note` ADD CONSTRAINT `header_note_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `note`(`note_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_note` ADD CONSTRAINT `header_note_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_meeting` ADD CONSTRAINT `header_meeting_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_meeting` ADD CONSTRAINT `header_meeting_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_service` ADD CONSTRAINT `header_service_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_service` ADD CONSTRAINT `header_service_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_project` ADD CONSTRAINT `header_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_project` ADD CONSTRAINT `header_project_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_opportunity` ADD CONSTRAINT `header_opportunity_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_opportunity` ADD CONSTRAINT `header_opportunity_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_user_profile` ADD CONSTRAINT `header_user_profile_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_user_profile` ADD CONSTRAINT `header_user_profile_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_workspace_profile` ADD CONSTRAINT `header_workspace_profile_workspace_profile_id_fkey` FOREIGN KEY (`workspace_profile_id`) REFERENCES `workspace_profile`(`workspace_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header_workspace_profile` ADD CONSTRAINT `header_workspace_profile_header_id_fkey` FOREIGN KEY (`header_id`) REFERENCES `header`(`header_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `virtual_background` ADD CONSTRAINT `virtual_background_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `virtual_background` ADD CONSTRAINT `virtual_background_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emoji` ADD CONSTRAINT `emoji_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emoji` ADD CONSTRAINT `emoji_emoji_category_id_fkey` FOREIGN KEY (`emoji_category_id`) REFERENCES `emoji_category`(`emoji_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emoji` ADD CONSTRAINT `emoji_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emoji` ADD CONSTRAINT `emoji_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emoji_category` ADD CONSTRAINT `emoji_category_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emoji_category` ADD CONSTRAINT `emoji_category_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_asset` ADD CONSTRAINT `system_asset_system_asset_category_id_fkey` FOREIGN KEY (`system_asset_category_id`) REFERENCES `system_asset_category`(`system_asset_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_asset` ADD CONSTRAINT `system_asset_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `system_asset_category` ADD CONSTRAINT `system_asset_category_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_meeting_recurrence_id_fkey` FOREIGN KEY (`meeting_recurrence_id`) REFERENCES `meeting_recurrence`(`meeting_recurrence_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `server`(`server_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting` ADD CONSTRAINT `meeting_main_room_id_fkey` FOREIGN KEY (`main_room_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cancelled_meeting` ADD CONSTRAINT `cancelled_meeting_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cancelled_meeting` ADD CONSTRAINT `cancelled_meeting_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reset_room_option` ADD CONSTRAINT `reset_room_option_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `breakoutroom_setting` ADD CONSTRAINT `breakoutroom_setting_meeting_room_setting_id_fkey` FOREIGN KEY (`meeting_room_setting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_timeslot` ADD CONSTRAINT `meeting_timeslot_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_timeslot_vote` ADD CONSTRAINT `meeting_timeslot_vote_meeting_timeslot_id_fkey` FOREIGN KEY (`meeting_timeslot_id`) REFERENCES `meeting_timeslot`(`meeting_timeslot_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_timeslot_vote` ADD CONSTRAINT `meeting_timeslot_vote_meeting_user_id_fkey` FOREIGN KEY (`meeting_user_id`) REFERENCES `meeting_user`(`meeting_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording` ADD CONSTRAINT `meeting_recording_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording` ADD CONSTRAINT `meeting_recording_preview_gif_file_id_fkey` FOREIGN KEY (`preview_gif_file_id`) REFERENCES `private_file`(`private_file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording` ADD CONSTRAINT `meeting_recording_preview_thumbnail_file_id_fkey` FOREIGN KEY (`preview_thumbnail_file_id`) REFERENCES `private_file`(`private_file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording_user` ADD CONSTRAINT `meeting_recording_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording_user` ADD CONSTRAINT `meeting_recording_user_meeting_recording_id_fkey` FOREIGN KEY (`meeting_recording_id`) REFERENCES `meeting_recording`(`meeting_recording_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording_file` ADD CONSTRAINT `meeting_recording_file_meeting_recording_id_fkey` FOREIGN KEY (`meeting_recording_id`) REFERENCES `meeting_recording`(`meeting_recording_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording_file` ADD CONSTRAINT `meeting_recording_file_recorded_file_id_fkey` FOREIGN KEY (`recorded_file_id`) REFERENCES `private_file`(`private_file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording_file` ADD CONSTRAINT `meeting_recording_file_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_transcription` ADD CONSTRAINT `meeting_transcription_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_transcription` ADD CONSTRAINT `meeting_transcription_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_analysis` ADD CONSTRAINT `meeting_analysis_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_prompt` ADD CONSTRAINT `ai_prompt_ai_session_id_fkey` FOREIGN KEY (`ai_session_id`) REFERENCES `ai_session`(`ai_session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_prompt_template` ADD CONSTRAINT `ai_prompt_template_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_prompt_template` ADD CONSTRAINT `ai_prompt_template_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user_ai` ADD CONSTRAINT `meeting_user_ai_prompt_id` FOREIGN KEY (`meeting_user_id`) REFERENCES `meeting_user`(`meeting_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user_ai` ADD CONSTRAINT `meeting_user_ai_ai_prompt_id_fkey` FOREIGN KEY (`ai_prompt_id`) REFERENCES `ai_prompt`(`ai_prompt_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_session` ADD CONSTRAINT `ai_session_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_session` ADD CONSTRAINT `ai_session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_session` ADD CONSTRAINT `ai_session_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module` ADD CONSTRAINT `module_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module` ADD CONSTRAINT `module_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `module`(`module_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module` ADD CONSTRAINT `module_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module` ADD CONSTRAINT `module_module_category_id_fkey` FOREIGN KEY (`module_category_id`) REFERENCES `module_category`(`module_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_category` ADD CONSTRAINT `module_category_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `module_category`(`module_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_config` ADD CONSTRAINT `module_config_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_config` ADD CONSTRAINT `module_config_system_asset_id_fkey` FOREIGN KEY (`system_asset_id`) REFERENCES `system_asset`(`system_asset_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_config` ADD CONSTRAINT `module_config_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `module_config`(`module_config_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_module_config` ADD CONSTRAINT `user_module_config_module_config_id_fkey` FOREIGN KEY (`module_config_id`) REFERENCES `module_config`(`module_config_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_module_config` ADD CONSTRAINT `user_module_config_user_integrated_module_id_fkey` FOREIGN KEY (`user_integrated_module_id`) REFERENCES `user_integrated_module`(`user_integrated_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_module_config` ADD CONSTRAINT `user_module_config_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_module_config` ADD CONSTRAINT `user_module_config_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertype` ADD CONSTRAINT `usertype_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertype_module` ADD CONSTRAINT `usertype_module_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertype_module` ADD CONSTRAINT `usertype_module_usertype_id_fkey` FOREIGN KEY (`usertype_id`) REFERENCES `usertype`(`usertype_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_src_user_id_fkey` FOREIGN KEY (`src_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_dst_user_id_fkey` FOREIGN KEY (`dst_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_authorized_app_id_fkey` FOREIGN KEY (`authorized_app_id`) REFERENCES `user_authorized_app`(`authorized_app_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_user` ADD CONSTRAINT `session_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_user` ADD CONSTRAINT `session_user_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `session`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session_device` ADD CONSTRAINT `session_device_session_user_id_fkey` FOREIGN KEY (`session_user_id`) REFERENCES `session_user`(`session_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project` ADD CONSTRAINT `console_project_logomark_file_id_fkey` FOREIGN KEY (`logomark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project` ADD CONSTRAINT `console_project_logomark_dark_file_id_fkey` FOREIGN KEY (`logomark_dark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project` ADD CONSTRAINT `console_project_logotype_file_id_fkey` FOREIGN KEY (`logotype_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project` ADD CONSTRAINT `console_project_logotype_dark_file_id_fkey` FOREIGN KEY (`logotype_dark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_console_project` ADD CONSTRAINT `user_console_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_console_project` ADD CONSTRAINT `user_console_project_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_console_project` ADD CONSTRAINT `user_console_project_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project_module` ADD CONSTRAINT `console_project_module_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project_module` ADD CONSTRAINT `console_project_module_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project_module` ADD CONSTRAINT `console_project_module_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_availability_template_id_fkey` FOREIGN KEY (`availability_template_id`) REFERENCES `availability_template`(`availability_template_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `form`(`form_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_project` ADD CONSTRAINT `service_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_project` ADD CONSTRAINT `service_project_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_project` ADD CONSTRAINT `service_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_user` ADD CONSTRAINT `service_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_user` ADD CONSTRAINT `service_user_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_host` ADD CONSTRAINT `service_host_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_host` ADD CONSTRAINT `service_host_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_price` ADD CONSTRAINT `service_price_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_price` ADD CONSTRAINT `service_price_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_price` ADD CONSTRAINT `service_price_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`location_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_booking_policy` ADD CONSTRAINT `service_booking_policy_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_availability_template_id_fkey` FOREIGN KEY (`availability_template_id`) REFERENCES `availability_template`(`availability_template_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_template` ADD CONSTRAINT `availability_template_timezone_id_fkey` FOREIGN KEY (`timezone_id`) REFERENCES `timezone`(`timezone_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_template` ADD CONSTRAINT `availability_template_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_template` ADD CONSTRAINT `availability_template_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_template_module` ADD CONSTRAINT `availability_template_module_availability_template_id_fkey` FOREIGN KEY (`availability_template_id`) REFERENCES `availability_template`(`availability_template_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_template_module` ADD CONSTRAINT `availability_template_module_user_integrated_module_id_fkey` FOREIGN KEY (`user_integrated_module_id`) REFERENCES `user_integrated_module`(`user_integrated_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_location` ADD CONSTRAINT `meeting_location_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_location` ADD CONSTRAINT `meeting_location_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`location_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_form_submitted_id_fkey` FOREIGN KEY (`form_submitted_id`) REFERENCES `form_submitted`(`form_submitted_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `server` ADD CONSTRAINT `server_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`country_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `server` ADD CONSTRAINT `server_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project_language` ADD CONSTRAINT `console_project_language_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `language`(`language_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `console_project_language` ADD CONSTRAINT `console_project_language_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_info` ADD CONSTRAINT `workspace_info_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_info` ADD CONSTRAINT `workspace_info_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plan`(`plan_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_info` ADD CONSTRAINT `workspace_info_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`country_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stripe_payment_method` ADD CONSTRAINT `stripe_payment_method_workspace_info_id_fkey` FOREIGN KEY (`workspace_info_id`) REFERENCES `workspace_info`(`workspace_info_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan` ADD CONSTRAINT `plan_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan` ADD CONSTRAINT `plan_workspace_type_id_fkey` FOREIGN KEY (`workspace_type_id`) REFERENCES `workspace_type`(`workspace_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan` ADD CONSTRAINT `plan_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `plan`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_config` ADD CONSTRAINT `plan_config_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_config` ADD CONSTRAINT `plan_config_plan_module_id_fkey` FOREIGN KEY (`plan_module_id`) REFERENCES `plan_module`(`plan_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_config_value` ADD CONSTRAINT `plan_config_value_plan_config_id_fkey` FOREIGN KEY (`plan_config_id`) REFERENCES `plan_config`(`plan_config_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_config_value` ADD CONSTRAINT `plan_config_value_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plan`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_module` ADD CONSTRAINT `plan_module_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plan`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_module` ADD CONSTRAINT `plan_module_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addon_item` ADD CONSTRAINT `addon_item_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_info_addon_item` ADD CONSTRAINT `workspace_info_addon_item_workspace_info_id_fkey` FOREIGN KEY (`workspace_info_id`) REFERENCES `workspace_info`(`workspace_info_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_info_addon_item` ADD CONSTRAINT `workspace_info_addon_item_addon_item_id_fkey` FOREIGN KEY (`addon_item_id`) REFERENCES `addon_item`(`addon_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `server`(`server_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_workspace_type_id_fkey` FOREIGN KEY (`workspace_type_id`) REFERENCES `workspace_type`(`workspace_type_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_type` ADD CONSTRAINT `workspace_type_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_type` ADD CONSTRAINT `workspace_type_logomark_file_id_fkey` FOREIGN KEY (`logomark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_type` ADD CONSTRAINT `workspace_type_logomark_dark_file_id_fkey` FOREIGN KEY (`logomark_dark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_type` ADD CONSTRAINT `workspace_type_logotype_file_id_fkey` FOREIGN KEY (`logotype_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_type` ADD CONSTRAINT `workspace_type_logotype_dark_file_id_fkey` FOREIGN KEY (`logotype_dark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_type` ADD CONSTRAINT `workspace_type_link_preview` FOREIGN KEY (`link_preview_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access` ADD CONSTRAINT `access_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `access`(`access_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role` ADD CONSTRAINT `role_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access_role` ADD CONSTRAINT `access_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access_role` ADD CONSTRAINT `access_role_access_id_fkey` FOREIGN KEY (`access_id`) REFERENCES `access`(`access_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access_role` ADD CONSTRAINT `access_role_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile` ADD CONSTRAINT `workspace_profile_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_user` ADD CONSTRAINT `workspace_profile_user_workspace_profile_id_fkey` FOREIGN KEY (`workspace_profile_id`) REFERENCES `workspace_profile`(`workspace_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_user` ADD CONSTRAINT `workspace_profile_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_workspace_user_id_fkey` FOREIGN KEY (`workspace_user_id`) REFERENCES `workspace_user`(`workspace_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_user` ADD CONSTRAINT `user_profile_user_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_user` ADD CONSTRAINT `user_profile_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_social` ADD CONSTRAINT `profile_social_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_address` ADD CONSTRAINT `user_profile_address_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_address` ADD CONSTRAINT `workspace_profile_address_workspace_profile_id_fkey` FOREIGN KEY (`workspace_profile_id`) REFERENCES `workspace_profile`(`workspace_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_experience` ADD CONSTRAINT `profile_experience_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_experience` ADD CONSTRAINT `profile_experience_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`company_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_experience` ADD CONSTRAINT `profile_experience_job_position_id_fkey` FOREIGN KEY (`job_position_id`) REFERENCES `job_position`(`job_position_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_education` ADD CONSTRAINT `profile_education_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_education` ADD CONSTRAINT `profile_education_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `school`(`school_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_education` ADD CONSTRAINT `profile_education_degree_id_fkey` FOREIGN KEY (`degree_id`) REFERENCES `degree`(`degree_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_association` ADD CONSTRAINT `user_profile_association_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_association` ADD CONSTRAINT `user_profile_association_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`company_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_association` ADD CONSTRAINT `user_profile_association_job_position_id_fkey` FOREIGN KEY (`job_position_id`) REFERENCES `job_position`(`job_position_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_association` ADD CONSTRAINT `workspace_profile_association_workspace_profile_id_fkey` FOREIGN KEY (`workspace_profile_id`) REFERENCES `workspace_profile`(`workspace_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_association` ADD CONSTRAINT `workspace_profile_association_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`company_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_association` ADD CONSTRAINT `workspace_profile_association_job_position_id_fkey` FOREIGN KEY (`job_position_id`) REFERENCES `job_position`(`job_position_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_award` ADD CONSTRAINT `user_profile_award_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_award` ADD CONSTRAINT `user_profile_award_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`company_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_award` ADD CONSTRAINT `workspace_profile_award_workspace_profile_id_fkey` FOREIGN KEY (`workspace_profile_id`) REFERENCES `workspace_profile`(`workspace_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_award` ADD CONSTRAINT `workspace_profile_award_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`company_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_certification` ADD CONSTRAINT `profile_certification_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `school_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `label` ADD CONSTRAINT `label_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `label_item` ADD CONSTRAINT `label_item_label_id_fkey` FOREIGN KEY (`label_id`) REFERENCES `label`(`label_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `label_module` ADD CONSTRAINT `label_module_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `label_module` ADD CONSTRAINT `label_module_label_id_fkey` FOREIGN KEY (`label_id`) REFERENCES `label`(`label_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_label_item` ADD CONSTRAINT `project_label_item_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_label_item` ADD CONSTRAINT `project_label_item_label_item_id_fkey` FOREIGN KEY (`label_item_id`) REFERENCES `label_item`(`label_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_label_item` ADD CONSTRAINT `user_profile_label_item_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_label_item` ADD CONSTRAINT `user_profile_label_item_label_item_id_fkey` FOREIGN KEY (`label_item_id`) REFERENCES `label_item`(`label_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_label_item` ADD CONSTRAINT `workspace_profile_label_item_label_item_id_fkey` FOREIGN KEY (`label_item_id`) REFERENCES `label_item`(`label_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_label_item` ADD CONSTRAINT `workspace_profile_label_item_workspace_profile_id_fkey` FOREIGN KEY (`workspace_profile_id`) REFERENCES `workspace_profile`(`workspace_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document` ADD CONSTRAINT `document_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document` ADD CONSTRAINT `document_meeting_agenda_id_fkey` FOREIGN KEY (`meeting_agenda_id`) REFERENCES `meeting_agenda`(`meeting_agenda_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document` ADD CONSTRAINT `document_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `note`(`note_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_template` ADD CONSTRAINT `document_template_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `document`(`document_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_template` ADD CONSTRAINT `document_template_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_template` ADD CONSTRAINT `document_template_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_template` ADD CONSTRAINT `document_template_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `document_template`(`document_template_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_agenda` ADD CONSTRAINT `meeting_agenda_meeting_user_id_fkey` FOREIGN KEY (`meeting_user_id`) REFERENCES `meeting_user`(`meeting_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_agenda` ADD CONSTRAINT `meeting_agenda_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user_agenda` ADD CONSTRAINT `meeting_user_meeting_agenda_id` FOREIGN KEY (`meeting_user_id`) REFERENCES `meeting_user`(`meeting_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user_agenda` ADD CONSTRAINT `meeting_user_agenda_meeting_agenda_id_fkey` FOREIGN KEY (`meeting_agenda_id`) REFERENCES `meeting_agenda`(`meeting_agenda_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user_note` ADD CONSTRAINT `meeting_user_note_id` FOREIGN KEY (`meeting_user_id`) REFERENCES `meeting_user`(`meeting_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user_note` ADD CONSTRAINT `meeting_user_note_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `note`(`note_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_user` ADD CONSTRAINT `note_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_user` ADD CONSTRAINT `note_user_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `note`(`note_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_block` ADD CONSTRAINT `document_block_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `document`(`document_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_block` ADD CONSTRAINT `document_block_document_block_type_id_fkey` FOREIGN KEY (`document_block_type_id`) REFERENCES `document_block_type`(`document_block_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_block` ADD CONSTRAINT `document_block_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_block` ADD CONSTRAINT `document_block_private_file_id_fkey` FOREIGN KEY (`private_file_id`) REFERENCES `private_file`(`private_file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_block_type` ADD CONSTRAINT `document_block_type_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `document_block_type`(`document_block_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_mark_type` ADD CONSTRAINT `document_mark_type_document_child_id_fkey` FOREIGN KEY (`document_child_id`) REFERENCES `document_child`(`document_child_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_child` ADD CONSTRAINT `document_child_document_block_id_fkey` FOREIGN KEY (`document_block_id`) REFERENCES `document_block`(`document_block_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_child` ADD CONSTRAINT `document_child_document_block_type_id_fkey` FOREIGN KEY (`document_block_type_id`) REFERENCES `document_block_type`(`document_block_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_child` ADD CONSTRAINT `document_child_parent_child_id_fkey` FOREIGN KEY (`parent_child_id`) REFERENCES `document_child`(`document_child_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form` ADD CONSTRAINT `form_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form` ADD CONSTRAINT `form_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `document`(`document_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submitted` ADD CONSTRAINT `form_submitted_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `form`(`form_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submitted` ADD CONSTRAINT `form_submitted_document_block_id_fkey` FOREIGN KEY (`document_block_id`) REFERENCES `document_block`(`document_block_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submitted` ADD CONSTRAINT `form_submitted_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submitted` ADD CONSTRAINT `form_submitted_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submitted` ADD CONSTRAINT `form_submitted_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_usertype_id_fkey` FOREIGN KEY (`usertype_id`) REFERENCES `usertype`(`usertype_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_timezone_id_fkey` FOREIGN KEY (`timezone_id`) REFERENCES `timezone`(`timezone_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`country_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_avatar_file_id_fkey` FOREIGN KEY (`avatar_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_console_project_language_id_fkey` FOREIGN KEY (`console_project_language_id`) REFERENCES `console_project_language`(`console_project_language_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_utm_id_fkey` FOREIGN KEY (`utm_id`) REFERENCES `utm`(`utm_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_identity` ADD CONSTRAINT `user_identity_console_project_id_fkey` FOREIGN KEY (`console_project_id`) REFERENCES `console_project`(`console_project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_identity` ADD CONSTRAINT `user_identity_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_module` ADD CONSTRAINT `user_integrated_module_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_module` ADD CONSTRAINT `user_integrated_module_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_module` ADD CONSTRAINT `user_integrated_module_console_project_module_id_fkey` FOREIGN KEY (`console_project_module_id`) REFERENCES `console_project_module`(`console_project_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_authorized_app` ADD CONSTRAINT `user_authorized_app_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `api_connect_key`(`client_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_authorized_app` ADD CONSTRAINT `user_authorized_app_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interact` ADD CONSTRAINT `interact_owner_id` FOREIGN KEY (`owner_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interact` ADD CONSTRAINT `user_interact_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_interact` ADD CONSTRAINT `interacted_user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usergroup` ADD CONSTRAINT `owner_id` FOREIGN KEY (`owner_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usergroup` ADD CONSTRAINT `usergroup_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usergroup` ADD CONSTRAINT `usergroup_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usergroup` ADD CONSTRAINT `usergroup_avatar` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usergroup_user` ADD CONSTRAINT `usergroup_id` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup`(`usergroup_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usergroup_user` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usergroup_user` ADD CONSTRAINT `usergroup_user_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contact`(`contact_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `share` ADD CONSTRAINT `share_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `share` ADD CONSTRAINT `share_src_user_id_fkey` FOREIGN KEY (`src_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `share` ADD CONSTRAINT `dstUserShare` FOREIGN KEY (`dst_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `share` ADD CONSTRAINT `share_dst_usergroup_id_fkey` FOREIGN KEY (`dst_usergroup_id`) REFERENCES `usergroup`(`usergroup_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `share` ADD CONSTRAINT `share_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `share` ADD CONSTRAINT `share_sharing_label_id_fkey` FOREIGN KEY (`sharing_label_id`) REFERENCES `sharing_label`(`sharing_label_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_share` ADD CONSTRAINT `note_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_share` ADD CONSTRAINT `note_share_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `note`(`note_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_share` ADD CONSTRAINT `project_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_share` ADD CONSTRAINT `project_share_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_share` ADD CONSTRAINT `opportunity_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_share` ADD CONSTRAINT `opportunity_share_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording_share` ADD CONSTRAINT `meeting_recording_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_recording_share` ADD CONSTRAINT `meeting_recording_share_meeting_recording_id_fkey` FOREIGN KEY (`meeting_recording_id`) REFERENCES `meeting_recording`(`meeting_recording_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_share` ADD CONSTRAINT `meeting_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_share` ADD CONSTRAINT `meeting_share_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_share` ADD CONSTRAINT `service_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_share` ADD CONSTRAINT `service_share_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_share` ADD CONSTRAINT `user_profile_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_share` ADD CONSTRAINT `user_profile_share_user_profile_id_fkey` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`user_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_share` ADD CONSTRAINT `workspace_profile_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_profile_share` ADD CONSTRAINT `workspace_profile_share_workspace_profile_id_fkey` FOREIGN KEY (`workspace_profile_id`) REFERENCES `workspace_profile`(`workspace_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user` ADD CONSTRAINT `meeting_user_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user` ADD CONSTRAINT `meeting_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_user_token` ADD CONSTRAINT `meeting_user_token_meeting_user_id_fkey` FOREIGN KEY (`meeting_user_id`) REFERENCES `meeting_user`(`meeting_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_project` ADD CONSTRAINT `note_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_project` ADD CONSTRAINT `note_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_project` ADD CONSTRAINT `note_project_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `note`(`note_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_project` ADD CONSTRAINT `meeting_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_project` ADD CONSTRAINT `meeting_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_project` ADD CONSTRAINT `meeting_project_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_google` ADD CONSTRAINT `meeting_google_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_google` ADD CONSTRAINT `meeting_google_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_appearance` ADD CONSTRAINT `workspace_appearance_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_appearance` ADD CONSTRAINT `workspace_logomark` FOREIGN KEY (`logomark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_appearance` ADD CONSTRAINT `workspace_logomark_dark` FOREIGN KEY (`logomark_dark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_appearance` ADD CONSTRAINT `workspace_logotype` FOREIGN KEY (`logotype_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_appearance` ADD CONSTRAINT `workspace_logotype_dark` FOREIGN KEY (`logotype_dark_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_appearance` ADD CONSTRAINT `workspace_link_preview` FOREIGN KEY (`link_preview_file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `search_history` ADD CONSTRAINT `search_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `search_history` ADD CONSTRAINT `search_history_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user` ADD CONSTRAINT `user_workspace_user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_availability_template_id_fkey` FOREIGN KEY (`availability_template_id`) REFERENCES `availability_template`(`availability_template_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user` ADD CONSTRAINT `workspace_user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user_slack` ADD CONSTRAINT `workspace_user_slack_workspace_user_id_fkey` FOREIGN KEY (`workspace_user_id`) REFERENCES `workspace_user`(`workspace_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user_slack` ADD CONSTRAINT `workspace_user_slack_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `slack_workspace`(`team_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_onboarding` ADD CONSTRAINT `workspace_onboarding_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_user` ADD CONSTRAINT `project_user_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_user` ADD CONSTRAINT `project_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity` ADD CONSTRAINT `opportunity_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity` ADD CONSTRAINT `opportunity_assignee_user_id_fkey` FOREIGN KEY (`assignee_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity` ADD CONSTRAINT `opportunity_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_user` ADD CONSTRAINT `opportunity_user_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_user` ADD CONSTRAINT `opportunity_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_location` ADD CONSTRAINT `opportunity_location_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_language` ADD CONSTRAINT `opportunity_language_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_language` ADD CONSTRAINT `opportunity_language_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `language`(`language_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `practice_areas_label_item` ADD CONSTRAINT `practice_areas_label_item_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `practice_areas_label_item` ADD CONSTRAINT `practice_areas_label_item_label_item_id_fkey` FOREIGN KEY (`label_item_id`) REFERENCES `label_item`(`label_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_type_label_item` ADD CONSTRAINT `opportunity_type_label_item_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunity_type_label_item` ADD CONSTRAINT `opportunity_type_label_item_label_item_id_fkey` FOREIGN KEY (`label_item_id`) REFERENCES `label_item`(`label_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `focus_area_label_item` ADD CONSTRAINT `focus_area_label_item_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `focus_area_label_item` ADD CONSTRAINT `focus_area_label_item_label_item_id_fkey` FOREIGN KEY (`label_item_id`) REFERENCES `label_item`(`label_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eligible_providers_label_item` ADD CONSTRAINT `eligible_providers_label_item_opportunity_id_fkey` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity`(`opportunity_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eligible_providers_label_item` ADD CONSTRAINT `eligible_providers_label_item_label_item_id_fkey` FOREIGN KEY (`label_item_id`) REFERENCES `label_item`(`label_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `service_to_be_booked` FOREIGN KEY (`service_id`) REFERENCES `service`(`service_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booker_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `location`(`location_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payment`(`payment_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_service_price_id_fkey` FOREIGN KEY (`service_price_id`) REFERENCES `service_price`(`service_price_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_form_submitted` ADD CONSTRAINT `booking_form_submitted_form_submitted_id_fkey` FOREIGN KEY (`form_submitted_id`) REFERENCES `form_submitted`(`form_submitted_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_form_submitted` ADD CONSTRAINT `booking_form_submitted_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_invitee` ADD CONSTRAINT `booking_invitee` FOREIGN KEY (`invitee_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_invitee` ADD CONSTRAINT `booking_invitee_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect` ADD CONSTRAINT `api_connect_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect` ADD CONSTRAINT `api_connect_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect_key` ADD CONSTRAINT `api_connect_key_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect_key` ADD CONSTRAINT `api_connect_key_api_connect_id_fkey` FOREIGN KEY (`api_connect_id`) REFERENCES `api_connect`(`api_connect_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect_log` ADD CONSTRAINT `api_connect_log_api_connect_id_fkey` FOREIGN KEY (`api_connect_id`) REFERENCES `api_connect`(`api_connect_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect_log` ADD CONSTRAINT `api_connect_log_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_calendar_event` ADD CONSTRAINT `user_calendar_event_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_calendar_event` ADD CONSTRAINT `user_calendar_event_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_calendar_event` ADD CONSTRAINT `user_calendar_event_user_calendar_sync_id_fkey` FOREIGN KEY (`user_calendar_sync_id`) REFERENCES `user_calendar_sync`(`user_calendar_sync_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_calendar_sync` ADD CONSTRAINT `user_calendar_sync_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_calendar` ADD CONSTRAINT `user_integrated_calendar_user_calendar_sync_id_fkey` FOREIGN KEY (`user_calendar_sync_id`) REFERENCES `user_calendar_sync`(`user_calendar_sync_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_calendar` ADD CONSTRAINT `user_integrated_calendar_user_integrated_module_id_fkey` FOREIGN KEY (`user_integrated_module_id`) REFERENCES `user_integrated_module`(`user_integrated_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_token` ADD CONSTRAINT `chat_token_workspace_user_id_fkey` FOREIGN KEY (`workspace_user_id`) REFERENCES `workspace_user`(`workspace_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_token` ADD CONSTRAINT `chat_token_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `session`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `action` ADD CONSTRAINT `action_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `action`(`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect_client_action` ADD CONSTRAINT `api_connect_client_action_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action`(`action_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect_client_action` ADD CONSTRAINT `api_connect_client_action_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `api_connect_key`(`client_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `api_connect_client_uri` ADD CONSTRAINT `api_connect_client_uri_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `api_connect_key`(`client_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `widget` ADD CONSTRAINT `widget_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `widget`(`widget_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_widget` ADD CONSTRAINT `user_widget_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_widget` ADD CONSTRAINT `user_widget_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_widget` ADD CONSTRAINT `user_widget_widget_id_fkey` FOREIGN KEY (`widget_id`) REFERENCES `widget`(`widget_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notification_setting` ADD CONSTRAINT `user_notification_setting_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notification_setting` ADD CONSTRAINT `user_notification_setting_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notification_setting` ADD CONSTRAINT `user_notification_setting_availability_template_id_fkey` FOREIGN KEY (`availability_template_id`) REFERENCES `availability_template`(`availability_template_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notification_keyword` ADD CONSTRAINT `user_notification_keyword_user_notification_setting_id_fkey` FOREIGN KEY (`user_notification_setting_id`) REFERENCES `user_notification_setting`(`user_notification_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `paid_module` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_module` FOREIGN KEY (`payment_module_id`) REFERENCES `module`(`module_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_workspace_user_id_fkey` FOREIGN KEY (`workspace_user_id`) REFERENCES `workspace_user`(`workspace_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_two_factor_method` ADD CONSTRAINT `user_two_factor_method_two_factor_method_id_fkey` FOREIGN KEY (`two_factor_method_id`) REFERENCES `two_factor_method`(`two_factor_method_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_two_factor_method` ADD CONSTRAINT `user_two_factor_method_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `storage_bucket` ADD CONSTRAINT `storage_bucket_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user_storage_bucket` ADD CONSTRAINT `workspace_user_storage_bucket_workspace_user_id_fkey` FOREIGN KEY (`workspace_user_id`) REFERENCES `workspace_user`(`workspace_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user_storage_bucket` ADD CONSTRAINT `workspace_user_storage_bucket_storage_bucket_id_fkey` FOREIGN KEY (`storage_bucket_id`) REFERENCES `storage_bucket`(`storage_bucket_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder` ADD CONSTRAINT `folder_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `folder`(`folder_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder` ADD CONSTRAINT `folder_workspace_user_storage_bucket_id_fkey` FOREIGN KEY (`workspace_user_storage_bucket_id`) REFERENCES `workspace_user_storage_bucket`(`workspace_user_storage_bucket_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder` ADD CONSTRAINT `folder_trashed_by_user_id_fkey` FOREIGN KEY (`trashed_by_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file_share` ADD CONSTRAINT `private_file_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file_share` ADD CONSTRAINT `private_file_share_private_file_id_fkey` FOREIGN KEY (`private_file_id`) REFERENCES `private_file`(`private_file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_share` ADD CONSTRAINT `folder_share_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`share_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_share` ADD CONSTRAINT `folder_share_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`folder_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file_user` ADD CONSTRAINT `private_file_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file_user` ADD CONSTRAINT `private_file_user_private_file_id_fkey` FOREIGN KEY (`private_file_id`) REFERENCES `private_file`(`private_file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_user` ADD CONSTRAINT `folder_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_user` ADD CONSTRAINT `folder_user_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`folder_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_project` ADD CONSTRAINT `folder_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_project` ADD CONSTRAINT `folder_project_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`folder_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_project` ADD CONSTRAINT `folder_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file_project` ADD CONSTRAINT `private_file_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file_project` ADD CONSTRAINT `private_file_project_private_file_id_fkey` FOREIGN KEY (`private_file_id`) REFERENCES `private_file`(`private_file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `private_file_project` ADD CONSTRAINT `private_file_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sharing_label` ADD CONSTRAINT `sharing_label_workspace_user_id_fkey` FOREIGN KEY (`workspace_user_id`) REFERENCES `workspace_user`(`workspace_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_log` ADD CONSTRAINT `meeting_log_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`meeting_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_log` ADD CONSTRAINT `type` FOREIGN KEY (`type_id`) REFERENCES `meeting_log_type`(`meeting_log_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_log` ADD CONSTRAINT `meeting_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_history` ADD CONSTRAINT `module_history_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `module`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_history` ADD CONSTRAINT `module_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_history` ADD CONSTRAINT `module_history_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_reservation` ADD CONSTRAINT `workspace_reservation_workspace_type_id_fkey` FOREIGN KEY (`workspace_type_id`) REFERENCES `workspace_type`(`workspace_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_project` ADD CONSTRAINT `chat_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_project` ADD CONSTRAINT `chat_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_task_type_id_fkey` FOREIGN KEY (`task_type_id`) REFERENCES `task_type`(`task_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_task_status_id_fkey` FOREIGN KEY (`task_status_id`) REFERENCES `task_status`(`task_status_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_assignee` ADD CONSTRAINT `task_assignee_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_assignee` ADD CONSTRAINT `task_assignee_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_type` ADD CONSTRAINT `task_type_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_status` ADD CONSTRAINT `task_status_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_project` ADD CONSTRAINT `task_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_project` ADD CONSTRAINT `task_project_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_project` ADD CONSTRAINT `task_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_clickup_team` ADD CONSTRAINT `user_clickup_team_user_integrated_module_id_fkey` FOREIGN KEY (`user_integrated_module_id`) REFERENCES `user_integrated_module`(`user_integrated_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_clickup_list` ADD CONSTRAINT `user_integrated_clickup_list_user_clickup_team_id_fkey` FOREIGN KEY (`user_clickup_team_id`) REFERENCES `user_clickup_team`(`user_clickup_team_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_task` ADD CONSTRAINT `user_integrated_task_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_integrated_task` ADD CONSTRAINT `user_integrated_task_user_integrated_clickup_list_id_fkey` FOREIGN KEY (`user_integrated_clickup_list_id`) REFERENCES `user_integrated_clickup_list`(`user_integrated_clickup_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_user_magiclink` ADD CONSTRAINT `workspace_user_magiclink_workspace_user_id_fkey` FOREIGN KEY (`workspace_user_id`) REFERENCES `workspace_user`(`workspace_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `magiclink_wallets` ADD CONSTRAINT `magiclink_wallets_workspace_user_magiclink_id_fkey` FOREIGN KEY (`workspace_user_magiclink_id`) REFERENCES `workspace_user_magiclink`(`workspace_user_magiclink_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demo_user` ADD CONSTRAINT `demo_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meme_generator_photo_stat` ADD CONSTRAINT `meme_generator_photo_stat_photo_id_fkey` FOREIGN KEY (`photo_id`) REFERENCES `meme_generator_photo`(`photo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meme_generator_photo_stat` ADD CONSTRAINT `meme_generator_photo_stat_stat_id_fkey` FOREIGN KEY (`stat_id`) REFERENCES `meme_generator_stat`(`stat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
