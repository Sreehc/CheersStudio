"use client";

import Link from "next/link";

import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";

const shortcuts = [
  {
    title: "新建项目",
    description: "以结构化方式发布项目，维护封面、亮点、链接与展示信息。",
    href: "/studio/projects/new",
  },
  {
    title: "项目管理",
    description: "查看草稿、编辑已发布内容，并控制哪些项目进入精选展示。",
    href: "/studio/projects",
  },
  {
    title: "写文章",
    description: "使用 Markdown 编写文章，预览排版效果，并发布技术内容。",
    href: "/studio/posts/new",
  },
  {
    title: "文章管理",
    description: "维护已有文章，区分草稿与已发布状态，保持内容节奏清晰。",
    href: "/studio/posts",
  },
  {
    title: "分类管理",
    description: "维护博客分类，让写作和发布时的内容归类保持一致。",
    href: "/studio/categories",
  },
  {
    title: "站点设置",
    description: "修改首页文案、关于介绍、社交链接和联系信息。",
    href: "/studio/settings",
  },
];

export default function StudioHomePage() {
  const { store } = useStudioData();
  const publishedProjectCount = store.projects.filter((project) => project.published).length;
  const draftProjectCount = store.projects.filter((project) => !project.published).length;
  const publishedPostCount = store.posts.filter((post) => post.status === "published").length;
  const draftPostCount = store.posts.filter((post) => post.status === "draft").length;

  return (
    <div>
      <StudioPageHeader
        title="工作台首页"
        description="统一管理项目发布、文章写作、分类维护与站点设置，确保公开站内容更新具备清晰且稳定的工作流程。"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="已发布项目" value={String(publishedProjectCount)} />
        <StatCard label="项目草稿" value={String(draftProjectCount)} />
        <StatCard label="已发布文章" value={String(publishedPostCount)} />
        <StatCard label="文章草稿" value={String(draftPostCount)} />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.href}
            href={shortcut.href}
            className="surface flex flex-col gap-4 px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50"
          >
            <span className="eyebrow">工作流入口</span>
            <h2 className="text-2xl font-semibold text-ink">{shortcut.title}</h2>
            <p className="text-sm leading-7">{shortcut.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface px-5 py-5">
      <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="mt-3 text-4xl font-semibold text-ink">{value}</div>
    </div>
  );
}
