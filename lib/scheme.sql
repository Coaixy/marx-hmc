CREATE TABLE `ai_answer_cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_hash` char(32) NOT NULL,
  `question_text` text NOT NULL,
  `ai_response` mediumtext NOT NULL,
  `model_name` varchar(50) DEFAULT 'default',
  `hit_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `question_hash` (`question_hash`),
  KEY `idx_question_hash` (`question_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

