import type { ContactLink, FilterItem, NavItem } from "@/types";

export const siteConfig = {
  name: "CheersStudio",
  title: "Building ideas with code.",
  navbarSubtitle: "Portfolio / Notes",
  footerDescription: "A personal space for projects, notes, experiments, and the long arc of technical growth.",
  description:
    "我是 Cheers，一名关注 Java / Spring 开发、AI 应用实践与工程落地的开发者。这里展示我的项目、博客和学习记录。",
  location: "Shanghai / Remote",
  email: "hello@cheersstudio.dev",
  heroStats: [
    { label: "Focus 方向", value: "Backend development + AI practice" },
    { label: "Primary Stack 技术栈", value: "Java / Spring / MySQL" },
    { label: "Current Mode 当前状态", value: "Build, write, iterate" },
  ],
  introBlocks: [
    "我习惯把学习放进真实项目里验证，先把一个想法变成可运行的最小成果，再围绕稳定性、可维护性和交付成本持续打磨。",
    "写博客对我来说不是展示结论，而是记录推理过程。项目复盘、踩坑笔记、架构选择和实验记录，都是对思考方式的沉淀。",
    "CheersStudio 既是作品集，也是长期更新的工程日志。我希望它像一个开放工作台，持续呈现我正在构建什么、理解了什么、以及下一步要解决什么。",
  ],
  cta: {
    title: "Have something worth building?",
    description:
      "如果你想交流工程实践、AI 应用落地，或者只是想聊聊一个值得实现的想法，欢迎联系我。",
    primaryLabel: "Get in Touch",
    primaryHref: "/contact",
  },
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: ContactLink[] = [
  {
    label: "GitHub",
    value: "github.com/cheersstudio",
    href: "https://github.com/cheersstudio",
    note: "开源项目与实验记录",
  },
  {
    label: "Email",
    value: "hello@cheersstudio.dev",
    href: "mailto:hello@cheersstudio.dev",
    note: "项目沟通 / 合作交流",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/cheers",
    href: "https://linkedin.com/in/cheers",
    note: "占位信息，后续可替换",
  },
];

export const projectFilters: FilterItem[] = [
  { label: "Selected", active: true },
  { label: "All" },
  { label: "Deployment" },
  { label: "AI" },
  { label: "Backend" },
];

export const blogFilters: FilterItem[] = [
  { label: "All Notes", active: true },
  { label: "Spring" },
  { label: "AI Practice" },
  { label: "Engineering" },
  { label: "Retrospective" },
];
