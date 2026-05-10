"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ProjectEditorForm } from "@/components/ProjectEditorForm";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import { getAdminProjectDetail } from "@/lib/services/projects";
import type { Project } from "@/types";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isStoreLoading, updateProject, uploadAsset } = useStudioData();
  const [project, setProject] = useState<Project | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const response = await getAdminProjectDetail(params.id);
        if (active) {
          setProject(response);
        }
      } catch {
        if (active) {
          setProject(null);
        }
      } finally {
        if (active) {
          setIsPageLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (isStoreLoading || isPageLoading) {
    return <div className="surface px-6 py-10 text-center text-muted">正在加载项目...</div>;
  }

  if (!project) {
    return (
      <div className="surface px-6 py-10 text-center">
        <span className="eyebrow">项目不存在</span>
        <h1 className="text-3xl font-semibold text-ink">当前工作台里找不到这个项目。</h1>
        <div className="mt-6 flex justify-center">
          <Link href="/studio/projects" className="button-primary">
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudioPageHeader
        title="编辑项目"
        description="更新项目内容、媒体和公开展示状态。修改后公开站会立即读取新的真实内容。"
      />
      <ProjectEditorForm
        initialValue={{
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          description: project.description,
          contentMarkdown: project.contentMarkdown,
          highlights: project.highlights,
          techStack: project.techStack,
          year: project.year,
          status: project.status,
          featured: project.featured,
          coverUrl: project.coverUrl,
          gallery: project.gallery,
          githubUrl: project.githubUrl,
          demoUrl: project.demoUrl,
          sort: project.sort,
          published: project.published,
        }}
        submitLabel="保存并发布"
        draftLabel="保存草稿"
        onUpload={async (file, moduleType) => {
          const asset = await uploadAsset(file, moduleType);
          return { id: asset.id, url: asset.url, name: asset.name };
        }}
        onSubmit={async (value) => {
          await updateProject(project.id, { ...value, published: true });
          router.push("/studio/projects");
        }}
        onSaveDraft={async (value) => {
          await updateProject(project.id, { ...value, published: false, featured: false });
          router.push("/studio/projects");
        }}
      />
    </div>
  );
}
