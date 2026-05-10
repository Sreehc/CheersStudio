import type { Post } from "@/types";

export const posts: Post[] = [
  {
    id: "post-public-fallback",
    slug: "public-page-fallback-strategy",
    title: "给个人站点加一层 Public Fallback 的原因",
    excerpt:
      "当后端没有启动时，公开页面不应该直接报错。对个人作品集来说，稳定展示本身就是体验的一部分。",
    categoryName: "Engineering",
    categorySlug: "engineering",
    publishedAt: "2026-04-28T00:00:00.000Z",
    readingTime: "4 min",
    featured: true,
    contentMarkdown: `# 给个人站点加一层 Public Fallback 的原因

## 背景
在本地开发阶段，前端和后端并不总是同时在线。如果公开页面强依赖接口，一旦 API 不可达，页面就会直接进入失败状态。

## 为什么这很影响作品集体验
- 用户看到的不是“内容暂时较少”，而是“站点不稳定”
- 设计再完整，错误遮罩层一出现，第一印象就会被破坏
- 对作品集来说，稳定可访问本身就是能力展示的一部分

## 这次的处理方式
- 为项目、文章和站点配置保留本地静态默认值
- 公共数据请求失败时记录日志，但继续渲染默认内容
- 让首页和列表页在没有后端时仍能保持完整结构与基本可信度
`,
    status: "published",
    updatedAt: "2026-04-30T00:00:00.000Z",
  },
];

export const featuredPosts = posts.filter((post) => post.featured);
