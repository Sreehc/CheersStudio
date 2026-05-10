SET NAMES utf8mb4;

-- CheersStudio schema
-- 约定：
-- 1. 使用 MySQL 8.x
-- 2. 所有关联字段使用“逻辑外键”，不创建物理 FOREIGN KEY 约束
-- 3. JSON 字段用于承载当前前端模型中的多值结构，后续可按业务演进再做规范化拆分
-- 4. 项目与博客详情正文统一使用 Markdown 存储，便于前端 README 导入与后端直接透传

CREATE DATABASE IF NOT EXISTS `cheersstudio`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `cheersstudio`;

CREATE TABLE IF NOT EXISTS `admin_user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `username` VARCHAR(64) NOT NULL COMMENT '管理员登录用户名，当前仅单管理员使用',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'BCrypt 哈希密码，不存储明文',
  `display_name` VARCHAR(100) NOT NULL COMMENT '展示名称',
  `email` VARCHAR(150) NOT NULL COMMENT '联系邮箱',
  `role_code` VARCHAR(32) NOT NULL DEFAULT 'OWNER' COMMENT '角色编码，当前固定为 OWNER',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1=启用，0=禁用',
  `last_login_at` DATETIME NULL COMMENT '最后一次登录时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_admin_user_username` (`username`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '管理员账户表';

CREATE TABLE IF NOT EXISTS `project` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `project_uid` CHAR(36) NOT NULL COMMENT '对前端暴露的项目唯一标识 UUID',
  `slug` VARCHAR(160) NOT NULL COMMENT '项目详情页访问标识',
  `title` VARCHAR(200) NOT NULL COMMENT '项目标题',
  `summary` VARCHAR(500) NOT NULL COMMENT '项目短摘要，用于列表卡片展示',
  `description` TEXT NOT NULL COMMENT '项目结构化说明，用于后台编辑与列表摘要补充',
  `content_markdown` LONGTEXT NOT NULL COMMENT '项目详情页 Markdown 正文，可直接存储 README.md 内容',
  `year` VARCHAR(10) NOT NULL COMMENT '项目年份或时间标记',
  `status_label` VARCHAR(60) NOT NULL COMMENT '项目状态文案，如 Building/Online',
  `featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否首页精选：1=是，0=否',
  `published` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否公开发布：1=公开，0=草稿',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序值，值越大可优先展示',
  `cover_asset_url` VARCHAR(500) NULL COMMENT '项目封面图 URL',
  `github_url` VARCHAR(500) NULL COMMENT '项目 GitHub 地址',
  `demo_url` VARCHAR(500) NULL COMMENT '项目演示地址',
  `tech_stack_json` JSON NOT NULL COMMENT '技术栈 JSON 数组，如 [\"Java\",\"Spring Boot\"]',
  `highlights_json` JSON NOT NULL COMMENT '项目亮点 JSON 数组',
  `gallery_json` JSON NOT NULL COMMENT '项目相册 URL JSON 数组',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_project_uid` (`project_uid`),
  UNIQUE KEY `uk_project_slug` (`slug`),
  KEY `idx_project_published_sort` (`published`, `featured`, `sort_order`, `updated_at`),
  KEY `idx_project_year` (`year`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '项目内容表，兼容结构化卡片信息与 Markdown 详情正文';

CREATE TABLE IF NOT EXISTS `post_category` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `name` VARCHAR(80) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(100) NOT NULL COMMENT '分类唯一标识',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序值',
  `enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1=启用，0=停用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_category_name` (`name`),
  UNIQUE KEY `uk_post_category_slug` (`slug`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '博客分类表';

CREATE TABLE IF NOT EXISTS `post` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `post_uid` CHAR(36) NOT NULL COMMENT '对前端暴露的文章唯一标识 UUID',
  `slug` VARCHAR(180) NOT NULL COMMENT '文章详情页访问标识',
  `title` VARCHAR(220) NOT NULL COMMENT '文章标题',
  `excerpt` VARCHAR(1000) NOT NULL COMMENT '文章摘要',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '逻辑外键，对应 post_category.id',
  `published_at` DATETIME NOT NULL COMMENT '发布时间',
  `reading_time` VARCHAR(32) NOT NULL COMMENT '阅读时长文案，如 6 min',
  `featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否首页精选：1=是，0=否',
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft' COMMENT '文章状态：draft=草稿，published=已发布',
  `cover_asset_url` VARCHAR(500) NULL COMMENT '封面图 URL',
  `content_markdown` LONGTEXT NOT NULL COMMENT 'Markdown 正文内容',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_uid` (`post_uid`),
  UNIQUE KEY `uk_post_slug` (`slug`),
  KEY `idx_post_status_published_at` (`status`, `featured`, `published_at`),
  KEY `idx_post_category` (`category_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '博客文章表';

CREATE TABLE IF NOT EXISTS `asset` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `asset_uid` CHAR(36) NOT NULL COMMENT '对前端暴露的资源唯一标识 UUID',
  `original_name` VARCHAR(255) NOT NULL COMMENT '原始文件名',
  `storage_key` VARCHAR(500) NOT NULL COMMENT '对象存储 Key 或本地存储相对路径',
  `file_url` VARCHAR(500) NOT NULL COMMENT '资源访问 URL',
  `mime_type` VARCHAR(120) NOT NULL COMMENT 'MIME 类型',
  `file_size` BIGINT UNSIGNED NOT NULL COMMENT '文件大小，单位字节',
  `module_type` ENUM('project_cover', 'project_gallery', 'post_cover', 'post_markdown', 'site_asset', 'other') NOT NULL COMMENT '资源所属业务模块',
  `status` ENUM('uploading', 'ready', 'deleted') NOT NULL DEFAULT 'ready' COMMENT '资源状态',
  `created_by` BIGINT UNSIGNED NULL COMMENT '逻辑外键，对应 admin_user.id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_asset_uid` (`asset_uid`),
  KEY `idx_asset_module_type` (`module_type`),
  KEY `idx_asset_status` (`status`),
  KEY `idx_asset_created_by` (`created_by`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '上传资源元数据表';

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键 ID，当前单行配置表固定为 1',
  `site_name` VARCHAR(120) NOT NULL COMMENT '站点名称',
  `hero_title` VARCHAR(255) NOT NULL COMMENT '首页主标题',
  `hero_description` TEXT NOT NULL COMMENT '首页简介描述',
  `location_text` VARCHAR(255) NOT NULL COMMENT '位置文案',
  `contact_email` VARCHAR(150) NOT NULL COMMENT '联系邮箱',
  `about_intro` TEXT NOT NULL COMMENT 'About 页面简介',
  `navbar_subtitle` VARCHAR(255) NOT NULL COMMENT '导航栏副标题文案',
  `footer_description` TEXT NOT NULL COMMENT '页脚介绍文案',
  `hero_stats_json` JSON NOT NULL COMMENT '首页 hero 指标 JSON 数组',
  `intro_blocks_json` JSON NOT NULL COMMENT '首页介绍段落 JSON 数组',
  `about_directions_json` JSON NOT NULL COMMENT 'About 页技术方向 JSON 数组',
  `about_focuses_json` JSON NOT NULL COMMENT 'About 页当前关注 JSON 数组',
  `about_workflow_json` JSON NOT NULL COMMENT 'About 页做事方式 JSON 数组',
  `about_values_json` JSON NOT NULL COMMENT 'About 页价值观 JSON 数组',
  `cta_json` JSON NOT NULL COMMENT 'CTA 配置 JSON 对象',
  `social_links_json` JSON NOT NULL COMMENT 'Footer 社交链接 JSON 数组',
  `contact_links_json` JSON NOT NULL COMMENT 'Contact 页联系链接 JSON 数组',
  `contact_form_json` JSON NOT NULL COMMENT 'Contact 表单配置 JSON 对象',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '站点设置单表';
