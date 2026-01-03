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

CREATE TABLE `exam_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `device_id` varchar(100) NOT NULL COMMENT '设备唯一标识或机器码',
  `nickname` varchar(50) DEFAULT '匿名用户' COMMENT '玩家展示的昵称',
  `exam_type` varchar(50) DEFAULT 'default' COMMENT '考试类型或科目',
  `score` int NOT NULL DEFAULT '0' COMMENT '分数',
  `duration_ms` int DEFAULT '0' COMMENT '答题耗时(毫秒)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`record_id`),
  KEY `idx_ranking` (`exam_type`,`score` DESC,`duration_ms`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

