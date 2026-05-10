"use client";

import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ContentTable } from "@/components/ContentTable";
import { StatusBadge } from "@/components/StatusBadge";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";

export default function ManageProjectsPage() {
  const { store, isStoreLoading, deleteProject } = useStudioData();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(null);

  const rows = useMemo(() => {
    const filtered = store.projects.filter((project) => {
      if (filter === "published") return project.published;
      if (filter === "draft") return !project.published;
      return true;
    });

    return filtered.map((project) => ({
      id: project.id,
      title: project.title,
      subtitle: project.summary,
      meta: `${project.year} · ${project.status}`,
      href: `/studio/projects/${project.id}`,
      status: project.published ? (
        <StatusBadge tone="success">已发布</StatusBadge>
      ) : (
        <StatusBadge tone="warning">草稿</StatusBadge>
      ),
    }));
  }, [filter, store.projects]);

  if (isStoreLoading) {
    return <div className="surface px-6 py-10 text-center text-muted">正在加载项目...</div>;
  }

  return (
    <div>
      <StudioPageHeader
        title="项目管理"
        description="查看、编辑和整理项目内容。当前阶段保持轻量工作流，不引入复杂分页与搜索。"
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
        eyebrow="项目库"
        title="项目列表"
        description="结构化管理项目列表，并通过单独编辑页维护封面、截图、技术栈和展示状态。"
        rows={rows}
        emptyTitle="还没有创建任何项目。"
        emptyDescription="先从“新建项目”开始，逐步完善作品展示内容。"
        primaryActionLabel="新建项目"
        primaryActionHref="/studio/projects/new"
        onDelete={(id) => setProjectIdToDelete(id)}
      />

      <ConfirmDialog
        open={Boolean(projectIdToDelete)}
        title="确认删除这个项目吗？"
        description="该操作会删除真实项目数据，公开站也会立即同步移除。"
        confirmLabel="确认删除"
        onCancel={() => setProjectIdToDelete(null)}
        onConfirm={() => {
          if (projectIdToDelete) {
            deleteProject(projectIdToDelete);
            setProjectIdToDelete(null);
          }
        }}
      />
    </div>
  );
}
