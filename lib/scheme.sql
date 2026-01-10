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
) ENGINE=InnoDB AUTO_INCREMENT=765 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `device_user_config` (
  `device_id` varchar(100) NOT NULL COMMENT '设备唯一标识 (主键)',
  `nickname` varchar(50) NOT NULL DEFAULT '匿名考友' COMMENT '用户设置的昵称',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '预留：头像地址 (如果有的话)',
  `last_active_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后活跃时间',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次注册时间',
  PRIMARY KEY (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='设备信息与个性化配置表'

CREATE TABLE `exam_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `device_id` varchar(100) NOT NULL COMMENT '设备唯一标识或机器码',
  `exam_type` varchar(50) DEFAULT 'default' COMMENT '考试类型或科目',
  `score` int NOT NULL DEFAULT '0' COMMENT '分数',
  `duration_ms` int DEFAULT '0' COMMENT '答题耗时(毫秒)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`record_id`),
  KEY `idx_ranking` (`exam_type`,`score` DESC,`duration_ms`)
) ENGINE=InnoDB AUTO_INCREMENT=892 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `question_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `question_hash` char(64) NOT NULL COMMENT '题目内容的SHA-256哈希值',
  `device_id` varchar(100) NOT NULL COMMENT '用户设备唯一标识',
  `content` text NOT NULL COMMENT '留言内容',
  `parent_id` bigint DEFAULT '0' COMMENT '父评论ID (0代表是一级留言，非0代表是回复)',
  `like_count` int DEFAULT '0' COMMENT '点赞数',
  `ip_address` varchar(45) DEFAULT NULL COMMENT '来源IP (用于简单的安全风控)',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态: 1正常, 0隐藏/删除 (软删除)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_ai` tinyint(1) DEFAULT '0' COMMENT '是否为AI回复: 0用户, 1AI',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_question_status` (`question_hash`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=667 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='题目留言/讨论表'

