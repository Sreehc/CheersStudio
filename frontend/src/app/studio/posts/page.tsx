"use client";

import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ContentTable } from "@/components/ContentTable";
import { StatusBadge } from "@/components/StatusBadge";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";

export default function ManagePostsPage() {
  const { store, isStoreLoading, deletePost } = useStudioData();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);

  const rows = useMemo(() => {
    const filtered = store.posts.filter((post) => {
      if (filter === "published") return post.status === "published";
      if (filter === "draft") return post.status === "draft";
      return true;
    });

    return filtered.map((post) => ({
      id: post.id,
      title: post.title,
      subtitle: post.excerpt,
      meta: `${post.categoryName} · ${post.readingTime}`,
      href: `/studio/posts/${post.id}`,
      status:
        post.status === "published" ? (
          <StatusBadge tone="success">已发布</StatusBadge>
        ) : (
          <StatusBadge tone="warning">草稿</StatusBadge>
        ),
    }));
  }, [filter, store.posts]);

  if (isStoreLoading) {
    return <div className="surface px-6 py-10 text-center text-muted">正在加载文章...</div>;
  }

  return (
    <div>
      <StudioPageHeader
        title="文章管理"
        description="管理 Markdown 文章，保持草稿与已发布内容的清晰边界。"
        actions={
          <>
            <button
              type="button"
              className={filter === "all" ? "button-primary" : "button-secondary"}
              onClick={() => setFilter("all")}
            >
              全部
            </button>
            <button
              type="button"
              className={filter === "published" ? "button-primary" : "button-secondary"}
              onClick={() => setFilter("published")}
            >
              已发布
            </button>
            <button
              type="button"
              className={filter === "draft" ? "button-primary" : "button-secondary"}
              onClick={() => setFilter("draft")}
            >
              草稿
            </button>
          </>
        }
      />

      <ContentTable
        eyebrow="文章库"
        title="文章列表"
        description="文章管理页优先关注状态、编辑入口和删除确认，不引入复杂的后台式列表设计。"
        rows={rows}
        emptyTitle="还没有写过任何文章。"
        emptyDescription="先从“写文章”开始，建立你的内容节奏。"
        primaryActionLabel="写文章"
        primaryActionHref="/studio/posts/new"
        onDelete={(id) => setPostIdToDelete(id)}
      />

      <ConfirmDialog
        open={Boolean(postIdToDelete)}
        title="确认删除这篇文章吗？"
        description="该操作会删除真实文章数据，公开站列表也会立即更新。"
        confirmLabel="确认删除"
        onCancel={() => setPostIdToDelete(null)}
        onConfirm={() => {
          if (postIdToDelete) {
            deletePost(postIdToDelete);
            setPostIdToDelete(null);
          }
        }}
      />
    </div>
  );
}
