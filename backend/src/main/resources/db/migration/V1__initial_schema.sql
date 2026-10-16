-- GovStart AI Flyway Migration V1: Initial Schema

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS `departments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `ministry` VARCHAR(150) NOT NULL,
    `contact_email` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tender Categories Table
CREATE TABLE IF NOT EXISTS `tender_categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Users Table (STARTUP, OFFICER, ADMIN)
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'STARTUP',
    `phone` VARCHAR(20),
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_role` (`role`),
    INDEX `idx_user_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Startup Profiles Table
CREATE TABLE IF NOT EXISTS `startup_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `company_name` VARCHAR(150) NOT NULL,
    `registration_number` VARCHAR(50) NOT NULL,
    `dpiit_recognized` BOOLEAN DEFAULT FALSE,
    `dpiit_number` VARCHAR(50),
    `sector` VARCHAR(100) NOT NULL,
    `stage` VARCHAR(50) DEFAULT 'EARLY',
    `founded_year` INT,
    `team_size` INT DEFAULT 1,
    `annual_turnover` DECIMAL(15,2) DEFAULT 0.00,
    `location_state` VARCHAR(100) NOT NULL,
    `location_city` VARCHAR(100) NOT NULL,
    `website` VARCHAR(255),
    `description` TEXT,
    `primary_skills` TEXT,
    `certifications` TEXT,
    `past_experience` TEXT,
    `verified_status` VARCHAR(20) DEFAULT 'PENDING',
    `profile_completeness_pct` INT DEFAULT 30,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_startup_sector` (`sector`),
    INDEX `idx_startup_state` (`location_state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tenders Table
CREATE TABLE IF NOT EXISTS `tenders` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `reference_number` VARCHAR(100) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `department_id` BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    `budget_inr` DECIMAL(15,2) NOT NULL,
    `publication_date` DATE NOT NULL,
    `deadline` TIMESTAMP NOT NULL,
    `eligibility_criteria` LONGTEXT NOT NULL,
    `required_skills` TEXT NOT NULL,
    `required_documents` TEXT NOT NULL,
    `evaluation_criteria` LONGTEXT NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PUBLISHED',
    `source_url` VARCHAR(500),
    `created_by_officER_id` BIGINT,
    `is_demo` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`),
    FOREIGN KEY (`category_id`) REFERENCES `tender_categories`(`id`),
    FOREIGN KEY (`created_by_officer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_tender_deadline` (`deadline`),
    INDEX `idx_tender_status` (`status`),
    INDEX `idx_tender_budget` (`budget_inr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tender Documents Table
CREATE TABLE IF NOT EXISTS `tender_documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `tender_id` BIGINT NOT NULL,
    `document_name` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_size_bytes` BIGINT DEFAULT 0,
    `is_public` BOOLEAN DEFAULT TRUE,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tender Requirements Table
CREATE TABLE IF NOT EXISTS `tender_requirements` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `tender_id` BIGINT NOT NULL,
    `requirement_type` VARCHAR(30) NOT NULL,
    `description` TEXT NOT NULL,
    `weightage` DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Saved Tenders Table
CREATE TABLE IF NOT EXISTS `saved_tenders` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `tender_id` BIGINT NOT NULL,
    `saved_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_saved_tender` (`user_id`, `tender_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Tender Matches Table
CREATE TABLE IF NOT EXISTS `tender_matches` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `startup_id` BIGINT NOT NULL,
    `tender_id` BIGINT NOT NULL,
    `relevance_score` DECIMAL(5,2) NOT NULL,
    `matched_skills` TEXT,
    `missing_requirements` TEXT,
    `explanation` LONGTEXT,
    `preliminary_status` VARCHAR(50) NOT NULL,
    `calculated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_startup_tender_match` (`startup_id`, `tender_id`),
    FOREIGN KEY (`startup_id`) REFERENCES `startup_profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Eligibility Checks Table
CREATE TABLE IF NOT EXISTS `eligibility_checks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `startup_id` BIGINT NOT NULL,
    `tender_id` BIGINT NOT NULL,
    `overall_status` VARCHAR(20) NOT NULL,
    `summary` TEXT,
    `checked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`startup_id`) REFERENCES `startup_profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Eligibility Check Items Table
CREATE TABLE IF NOT EXISTS `eligibility_check_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `eligibility_check_id` BIGINT NOT NULL,
    `criterion_name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `explanation` TEXT,
    `required_evidence` TEXT,
    `is_verified` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (`eligibility_check_id`) REFERENCES `eligibility_checks`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Applications Table
CREATE TABLE IF NOT EXISTS `applications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `application_number` VARCHAR(100) NOT NULL UNIQUE,
    `tender_id` BIGINT NOT NULL,
    `startup_id` BIGINT NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    `proposal_summary` LONGTEXT,
    `proposed_cost_inr` DECIMAL(15,2),
    `technical_score` DECIMAL(5,2),
    `financial_score` DECIMAL(5,2),
    `officer_notes` TEXT,
    `clarification_note` TEXT,
    `submitted_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_demo` BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`startup_id`) REFERENCES `startup_profiles`(`id`) ON DELETE CASCADE,
    INDEX `idx_app_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Application Documents Table
CREATE TABLE IF NOT EXISTS `application_documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `application_id` BIGINT NOT NULL,
    `document_name` VARCHAR(255) NOT NULL,
    `document_type` VARCHAR(50) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Proposal Drafts Table
CREATE TABLE IF NOT EXISTS `proposal_drafts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `startup_id` BIGINT NOT NULL,
    `tender_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `company_introduction` LONGTEXT,
    `technical_outline` LONGTEXT,
    `compliance_matrix` LONGTEXT,
    `checklist_items` LONGTEXT,
    `version_number` INT DEFAULT 1,
    `last_saved_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`startup_id`) REFERENCES `startup_profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `link_url` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_notif_user_unread` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. AI Analysis History Table
CREATE TABLE IF NOT EXISTS `ai_analysis_history` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `tender_id` BIGINT,
    `analysis_type` VARCHAR(50) NOT NULL,
    `query_or_input` LONGTEXT,
    `result_summary` LONGTEXT,
    `execution_time_ms` BIGINT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Audit Logs Table
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT,
    `action` VARCHAR(100) NOT NULL,
    `entity_name` VARCHAR(100),
    `entity_id` BIGINT,
    `ip_address` VARCHAR(50),
    `details` TEXT,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_action` (`action`),
    INDEX `idx_audit_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
