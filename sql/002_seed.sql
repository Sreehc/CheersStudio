SET NAMES utf8mb4;

-- CheersStudio seed data
-- 包含：
-- 1. 单管理员账户
-- 2. 默认博客分类
-- 3. 站点基础设置
-- 不包含任何项目、博客、资源占位内容

USE `cheersstudio`;

-- 单管理员账号
INSERT INTO `admin_user` (
  `id`,
  `username`,
  `password_hash`,
  `display_name`,
  `email`,
  `role_code`,
  `status`
) VALUES (
  1,
  'cheers',
  '$2y$10$9W4SI1eQNMgOxZbcy8EX8erF1dEq6EHRq3E/UmNyDhTjYycTGTYg6',
  'Cheers',
  'hello@cheersstudio.dev',
  'OWNER',
  1
)
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `display_name` = VALUES(`display_name`),
  `email` = VALUES(`email`),
  `role_code` = VALUES(`role_code`),
  `status` = VALUES(`status`);

-- 默认博客分类
INSERT INTO `post_category` (`id`, `name`, `slug`, `sort_order`, `enabled`) VALUES
  (1, 'Engineering', 'engineering', 10, 1),
  (2, 'Spring', 'spring', 20, 1),
  (3, 'AI Practice', 'ai-practice', 30, 1),
  (4, 'Retrospective', 'retrospective', 40, 1)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `sort_order` = VALUES(`sort_order`),
  `enabled` = VALUES(`enabled`);

-- 默认站点设置
INSERT INTO `site_settings` (
  `id`,
  `site_name`,
  `hero_title`,
  `hero_description`,
  `location_text`,
  `contact_email`,
  `about_intro`,
  `navbar_subtitle`,
  `footer_description`,
  `hero_stats_json`,
  `intro_blocks_json`,
  `about_directions_json`,
  `about_focuses_json`,
  `about_workflow_json`,
  `about_values_json`,
  `cta_json`,
  `social_links_json`,
  `contact_links_json`,
  `contact_form_json`
) VALUES (
  1,
  'CheersStudio',
  'Building ideas with code.',
  '我是 Cheers，一名关注 Java / Spring 开发、AI 应用实践与工程落地的开发者。这里展示我的项目、博客和学习记录。',
  'Shanghai / Remote',
  'hello@cheersstudio.dev',
  '我是 Cheers，一名持续通过项目构建能力边界的开发者。我的主线是 Java / Spring 开发，同时也在把 AI 实验、图像方向探索和工程落地能力逐步串成一个更完整的技术栈。',
  'Portfolio / Notes',
  'A personal space for projects, notes, experiments, and the long arc of technical growth.',
  JSON_ARRAY(
    JSON_OBJECT('label', 'Focus 方向', 'value', 'Backend development + AI practice'),
    JSON_OBJECT('label', 'Primary Stack 技术栈', 'value', 'Java / Spring / MySQL'),
    JSON_OBJECT('label', 'Current Mode 当前状态', 'value', 'Build, write, iterate')
  ),
  JSON_ARRAY(
    '我习惯把学习放进真实项目里验证，先把一个想法变成可运行的最小成果，再围绕稳定性、可维护性和交付成本持续打磨。',
    '写博客对我来说不是展示结论，而是记录推理过程。项目复盘、踩坑笔记、架构选择和实验记录，都是对思考方式的沉淀。',
    'CheersStudio 既是作品集，也是长期更新的工程日志。我希望它像一个开放工作台，持续呈现我正在构建什么、理解了什么、以及下一步要解决什么。'
  ),
  JSON_ARRAY(
    'Java / Spring 后端开发与服务搭建',
    'AI 应用实践，从实验原型到场景验证',
    '工程化与项目落地，关注可维护性与交付节奏'
  ),
  JSON_ARRAY(
    '把 AI 能力接入真实工作流，而不是停留在实验展示。',
    '沉淀可以复用的工程模板、部署基线和项目结构。',
    '在写作中整理自己的判断方式，让项目与思考同步成长。'
  ),
  JSON_ARRAY(
    '先做一个足够小但完整的闭环，再迭代结构和体验。',
    '重视复盘文档，把踩坑、判断与取舍写清楚。',
    '优先解决真实问题，而不是只追逐新技术标签。'
  ),
  JSON_ARRAY(
    JSON_OBJECT('title', '持续学习', 'description', '把学习放进真实项目里，用可运行结果检验理解，而不是只停留在概念层面。'),
    JSON_OBJECT('title', '工程实践', 'description', '重视结构、部署、可维护性与交付方式，让项目真正具备继续演进的基础。'),
    JSON_OBJECT('title', '独立思考', 'description', '不急着追逐热点，先判断问题边界、实际价值和实现成本。'),
    JSON_OBJECT('title', '解决真实问题', 'description', '更在意技术如何接入场景、改善流程，而不是只展示技术本身。')
  ),
  JSON_OBJECT(
    'title', 'Have something worth building?',
    'description', '如果你想交流工程实践、AI 应用落地，或者只是想聊聊一个值得实现的想法，欢迎联系我。',
    'primaryLabel', 'Get in Touch',
    'primaryHref', '/contact'
  ),
  JSON_ARRAY(
    JSON_OBJECT(
      'label', 'GitHub',
      'value', 'github.com/cheersstudio',
      'href', 'https://github.com/cheersstudio',
      'note', '开源项目与实验记录'
    ),
    JSON_OBJECT(
      'label', 'Email',
      'value', 'hello@cheersstudio.dev',
      'href', 'mailto:hello@cheersstudio.dev',
      'note', '项目沟通 / 合作交流'
    ),
    JSON_OBJECT(
      'label', 'LinkedIn',
      'value', 'linkedin.com/in/cheers',
      'href', 'https://linkedin.com/in/cheers',
      'note', '占位信息，后续可替换'
    )
  ),
  JSON_ARRAY(
    JSON_OBJECT(
      'label', '邮箱',
      'value', 'hello@cheersstudio.dev',
      'href', 'mailto:hello@cheersstudio.dev',
      'note', '适合项目合作、技术交流与网站反馈。'
    ),
    JSON_OBJECT(
      'label', 'GitHub',
      'value', 'github.com/cheersstudio',
      'href', 'https://github.com/cheersstudio',
      'note', '查看我的项目、实验与代码整理。'
    ),
    JSON_OBJECT(
      'label', 'LinkedIn',
      'value', 'linkedin.com/in/cheers',
      'href', 'https://linkedin.com/in/cheers',
      'note', '占位信息，可后续替换为真实主页。'
    ),
    JSON_OBJECT(
      'label', '博客',
      'value', 'cheersstudio.dev/blog',
      'href', '/blog',
      'note', '记录技术学习、实验过程与项目复盘。'
    )
  ),
  JSON_OBJECT(
    'title', 'Start a conversation',
    'description', '如果你正在构建一个有意思的产品，或者想交流 Java / Spring、AI 实践和工程化落地，欢迎留下信息。',
    'placeholders', JSON_OBJECT(
      'name', '你的名字',
      'email', 'name@example.com',
      'message', '简单介绍一下你正在做什么、想交流什么，或者遇到了什么问题。'
    )
  )
)
ON DUPLICATE KEY UPDATE
  `site_name` = VALUES(`site_name`),
  `hero_title` = VALUES(`hero_title`),
  `hero_description` = VALUES(`hero_description`),
  `location_text` = VALUES(`location_text`),
  `contact_email` = VALUES(`contact_email`),
  `about_intro` = VALUES(`about_intro`),
  `navbar_subtitle` = VALUES(`navbar_subtitle`),
  `footer_description` = VALUES(`footer_description`),
  `hero_stats_json` = VALUES(`hero_stats_json`),
  `intro_blocks_json` = VALUES(`intro_blocks_json`),
  `about_directions_json` = VALUES(`about_directions_json`),
  `about_focuses_json` = VALUES(`about_focuses_json`),
  `about_workflow_json` = VALUES(`about_workflow_json`),
  `about_values_json` = VALUES(`about_values_json`),
  `cta_json` = VALUES(`cta_json`),
  `social_links_json` = VALUES(`social_links_json`),
  `contact_links_json` = VALUES(`contact_links_json`),
  `contact_form_json` = VALUES(`contact_form_json`);
