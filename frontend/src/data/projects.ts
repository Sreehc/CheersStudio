import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "project-cheersstudio-site",
    slug: "cheersstudio-site",
    title: "CheersStudio Portfolio System",
    summary: "一个将个人作品集、技术博客与轻量内容管理串在一起的全栈站点实践。",
    description:
      "围绕 Java / Spring Boot API 与 Next.js 前端构建的个人站点，用于验证内容结构、发布流程与前后端协作的可交付路径。",
    contentMarkdown: `# CheersStudio Portfolio System

## 项目概述
这个项目的目标不是单纯做一个展示页，而是把个人项目、技术写作和后台管理整合到一套可持续迭代的内容系统里。

## 我重点验证了什么
- 前台作品集与博客是否能共用统一的数据结构
- 后台发布流程是否足够轻量，适合个人长期维护
- 页面设计是否能同时表达技术感与可读性

## 当前结果
- 已完成首页、项目、博客、关于、联系与 Studio 管理界面
- 前端支持静态兜底，后端不可用时仍能维持公开页面可访问
- 设计语言围绕低饱和色、代码工作台语义和高密度内容组织展开
`,
    highlights: [
      "把作品集、博客与管理端放进同一套内容系统，减少重复维护成本",
      "前端公共页面增加静态数据兜底，后端离线时仍可稳定展示",
      "围绕程序员作品集场景建立统一的排版、卡片与导航语言",
    ],
    techStack: ["Next.js", "React", "Tailwind CSS", "Java", "Spring Boot"],
    year: "2026",
    status: "In Progress",
    featured: true,
    gallery: [],
    githubUrl: "https://github.com/cheersstudio",
    demoUrl: "https://cheersstudio.dev",
    sort: 1,
    published: true,
    updatedAt: "2026-04-30T00:00:00.000Z",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
