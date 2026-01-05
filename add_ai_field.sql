ALTER TABLE question_comments ADD COLUMN is_ai tinyint(1) DEFAULT '0' COMMENT '是否为AI回复: 0用户, 1AI';
