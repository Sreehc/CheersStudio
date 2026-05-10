"use client";

import Link from "next/link";

import { BlogCard } from "@/components/BlogCard";
import { HeroSection } from "@/components/HeroSection";
import { PageContainer } from "@/components/PageContainer";
import { useStudioData } from "@/components/providers/RootProviders";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionTitle } from "@/components/SectionTitle";
import { SkillTag } from "@/components/SkillTag";
import { skillGroups } from "@/data/about";

export default function HomePage() {
  const { featuredPosts, featuredProjects, store } = useStudioData();

  return (
    <PageContainer>
      <HeroSection />

      <section className="page-section">
        <SectionTitle
          eyebrow="Intro / 简介"
          title="A personal workspace shaped by projects, notes, and deliberate iteration."
          description="这里并非单纯的展示页面，而是一个持续更新的个人技术空间，用于系统呈现项目实践、复盘写作与方法沉淀。"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {store.siteSettings.introBlocks.map((block, index) => (
            <article
              key={block}
              className="surface px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-muted">
                0{index + 1} / Note
              </div>
              <p className="mt-4 text-sm leading-8">{block}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionTitle
          eyebrow="Tech Stack / 技术栈"
          title="Tools I keep returning to"
          description="以 Java / Spring 为主线，逐步把 AI 实验与前端展示能力拼到同一套工作流里。"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <article key={group.title} className="surface px-6 py-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">{group.title}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <SkillTag key={skill.name} label={skill.name} tone="accent" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionTitle
          eyebrow="Featured Projects / 精选项目"
          title="Selected work that connects experimentation with delivery"
          description="从 AI 图像方向的探索到后端部署实践，这些项目较为集中地体现了我当前阶段的技术关注与实践路径。"
        />
        {featuredProjects.length > 0 ? (
          <div className="section-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} compact />
            ))}
          </div>
        ) : (
          <p className="text-sm leading-7 text-muted">
            精选项目会在这里持续更新，优先展示更能体现交付能力与工程判断的实践。
          </p>
        )}
      </section>

      <section className="page-section">
        <SectionTitle
          eyebrow="Latest Posts / 最新博客"
          title="Recent notes from experiments, deployment work, and technical reflection"
          description="博客部分更偏向技术记录与研究性写作，用于整理实践过程、决策依据以及值得长期保留的方法经验。"
        />
        {featuredPosts.length > 0 ? (
          <div className="section-grid">
            {featuredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} compact />
            ))}
          </div>
        ) : (
          <p className="text-sm leading-7 text-muted">
            博客部分会持续补充实验记录、部署复盘和值得长期保留的工程笔记。
          </p>
        )}
      </section>

      <section className="page-section">
        <div className="surface grid gap-8 overflow-hidden px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-10">
          <div>
            <span className="eyebrow">Values / 我重视什么</span>
            <h2 className="max-w-2xl text-3xl font-semibold text-ink md:text-4xl">
              Build clearly. Learn continuously. Solve things that matter.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8">{store.siteSettings.cta.description}</p>
          </div>

          <div className="grid gap-4">
            {store.siteSettings.aboutValues.map((item) => (
              <article key={item.title} className="surface-muted rounded-[28px] px-5 py-5">
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href={store.siteSettings.cta.primaryHref} className="button-primary">
            {store.siteSettings.cta.primaryLabel}
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
