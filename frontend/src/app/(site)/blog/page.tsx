"use client";

import { BlogCard } from "@/components/BlogCard";
import { EmptyState } from "@/components/EmptyState";
import { FilterPill } from "@/components/FilterPill";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import { blogFilters } from "@/data/site";

export default function BlogPage() {
  const { publicPosts } = useStudioData();

  return (
    <PageContainer>
      <PageHeader
        title="Blog / Notes"
        description="这里记录技术学习、项目复盘和实验过程。内容偏向过程型写作：问题怎么定义、方案怎么取舍、哪些工程细节真正值得沉淀。"
        meta={[
          { label: "Writing Mode", value: "Technical notes + reflection" },
          { label: "Cadence", value: "Project-driven updates" },
        ]}
      />

      {publicPosts.length > 0 ? (
        <section className="pb-6">
          <div className="flex flex-wrap gap-3">
            {blogFilters.map((item) => (
              <FilterPill key={item.label} label={item.label} active={item.active} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="page-section pt-6">
        {publicPosts.length > 0 ? (
          <div className="grid gap-6">
            {publicPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="Blog / Notes"
            title="No posts published yet."
            description="这里先保留内容结构，不再用大块占位削弱页面质感；准备好真实文章后会直接显示。"
          />
        )}
      </section>
    </PageContainer>
  );
}
