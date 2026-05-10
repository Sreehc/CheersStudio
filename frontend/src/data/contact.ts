import type { ContactLink } from "@/types";

export const contactLinks: ContactLink[] = [
  {
    label: "邮箱",
    value: "hello@cheersstudio.dev",
    href: "mailto:hello@cheersstudio.dev",
    note: "适合项目合作、技术交流与网站反馈。",
  },
  {
    label: "GitHub",
    value: "github.com/cheersstudio",
    href: "https://github.com/cheersstudio",
    note: "查看我的项目、实验与代码整理。",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/cheers",
    href: "https://linkedin.com/in/cheers",
    note: "占位信息，可后续替换为真实主页。",
  },
  {
    label: "博客",
    value: "cheersstudio.dev/blog",
    href: "/blog",
    note: "记录技术学习、实验过程与项目复盘。",
  },
];

export const contactFormContent = {
  title: "Start a conversation",
  description:
    "如果你正在构建一个有意思的产品，或者想交流 Java / Spring、AI 实践和工程化落地，欢迎留下信息。",
  placeholders: {
    name: "你的名字",
    email: "name@example.com",
    message: "简单介绍一下你正在做什么、想交流什么，或者遇到了什么问题。",
  },
};
