"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { MarkdownPreview } from "@/components/MarkdownPreview";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getProjectDetail } from "@/lib/services/projects";
import { SkillTag } from "@/components/SkillTag";
import type { Project } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const response = await getProjectDetail(params.slug);
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
  }, [params.slug]);

  if (isPageLoading) {
    return (
      <PageContainer className="py-16">
        <div className="surface px-8 py-10 text-center text-muted">Loading project...</div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer className="py-16">
        <div className="surface px-8 py-10 text-center">
          <span className="eyebrow">Project Details</span>
          <h1 className="text-3xl font-semibold text-ink">This project is not published yet.</h1>
          <p className="mt-4 text-base leading-8">
            当前还没有可公开访问的项目详情内容。等项目发布后，这里会自动展示完整页面。
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/projects" className="button-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={project.title}
        description={project.summary}
        meta={[
          { label: "Status", value: project.status },
          { label: "Year", value: project.year },
        ]}
        action={
          <Link href="/projects" className="button-secondary">
            Back to Projects
          </Link>
        }
      />

      <section className="grid gap-8 pb-12 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">README / 项目详情</span>
          <MarkdownPreview value={project.contentMarkdown} />
        </article>

        <aside className="grid gap-5">
          {project.coverUrl ? (
            <div
              className="surface h-56 rounded-[28px] bg-cover bg-center"
              style={{ backgroundImage: `url(${project.coverUrl})` }}
            />
          ) : null}
          <div className="surface px-6 py-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Tech Stack</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((item) => (
                <SkillTag key={item} label={item} tone="accent" />
              ))}
            </div>
          </div>

          <div className="surface px-6 py-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Highlights</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.githubUrl || project.demoUrl ? (
            <div className="surface px-6 py-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Links</div>
              <div className="mt-4 flex flex-wrap gap-3">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary"
                  >
                    GitHub
                  </a>
                ) : null}
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary"
                  >
                    Live Demo
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </PageContainer>
  );
}
