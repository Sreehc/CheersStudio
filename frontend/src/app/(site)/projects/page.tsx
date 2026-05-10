"use client";

import { EmptyState } from "@/components/EmptyState";
import { FilterPill } from "@/components/FilterPill";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import { ProjectCard } from "@/components/ProjectCard";
import { projectFilters } from "@/data/site";

export default function ProjectsPage() {
  const { publicProjects } = useStudioData();

  return (
    <PageContainer>
      <PageHeader
        title="Projects 项目"
        description="这里集中展示我的项目作品、实验原型和工程实践案例。它们覆盖 AI 应用尝试、后端服务构建、部署流程整理，以及把想法推进到可交付状态的过程。"
        meta={[
          { label: "Focus", value: "AI / Backend / Delivery" },
          { label: "Count", value: `${publicProjects.length} items` },
        ]}
      />

      {publicProjects.length > 0 ? (
        <section className="pb-6">
          <div className="flex flex-wrap gap-3">
            {projectFilters.map((item) => (
              <FilterPill key={item.label} label={item.label} active={item.active} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="page-section pt-6">
        {publicProjects.length > 0 ? (
          <div className="section-grid">
            {publicProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="Projects / 项目"
            title="Projects are intentionally left blank for now."
            description="这里暂时只保留结构，不再用大体积占位内容制造“未完成”的感觉；等真实项目补充后会自动接上。"
          />
        )}
      </section>
    </PageContainer>
  );
}
