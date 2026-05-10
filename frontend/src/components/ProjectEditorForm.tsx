"use client";

import { useMemo, useRef, useState } from "react";

import { FormSectionCard } from "@/components/FormSectionCard";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { MediaPreviewGrid } from "@/components/MediaPreviewGrid";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillTag } from "@/components/SkillTag";
import { UploadDropzone } from "@/components/UploadDropzone";
import { createProjectMarkdownTemplate, estimateReadingTime, slugify } from "@/lib/utils";
import type { ProjectInput } from "@/types";

type ProjectEditorFormProps = {
  initialValue: ProjectInput;
  onSubmit: (value: ProjectInput) => Promise<void>;
  onSaveDraft?: (value: ProjectInput) => Promise<void>;
  onUpload: (
    file: File,
    moduleType?: string,
  ) => Promise<{ id: string; url: string; name: string }>;
  submitLabel: string;
  draftLabel?: string;
};

export function ProjectEditorForm({
  initialValue,
  onSubmit,
  onSaveDraft,
  onUpload,
  submitLabel,
  draftLabel = "保存草稿",
}: ProjectEditorFormProps) {
  const [form, setForm] = useState(initialValue);
  const [techInput, setTechInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [submitMode, setSubmitMode] = useState<"publish" | "draft" | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [readmeFileName, setReadmeFileName] = useState("");
  const [readmeError, setReadmeError] = useState("");
  const readmeInputRef = useRef<HTMLInputElement | null>(null);

  const previewProject = useMemo(
    () => ({
      ...form,
      id: "preview",
      updatedAt: new Date().toISOString(),
      slug: form.slug || slugify(form.title || "project-preview"),
      title: form.title || "未命名项目",
      summary: form.summary || "填写一句简短摘要，这里会实时预览项目卡片效果。",
      description:
        form.description || "这里会展示更完整的项目说明，用来预览详情页中的整体表达。",
      contentMarkdown: form.contentMarkdown || "",
      highlights: form.highlights.length > 0 ? form.highlights : ["暂未填写项目亮点。"],
      techStack: form.techStack.length > 0 ? form.techStack : ["技术栈"],
    }),
    [form],
  );

  async function handleCoverUpload(files: FileList) {
    const asset = await onUpload(files[0], "project_cover");
    setForm((current) => ({ ...current, coverUrl: asset.url }));
  }

  async function handleGalleryUpload(files: FileList) {
    const uploaded = await Promise.all(
      Array.from(files).map((file) => onUpload(file, "project_gallery")),
    );
    setForm((current) => ({
      ...current,
      gallery: [...current.gallery, ...uploaded.map((asset) => asset.url)],
    }));
  }

  function buildSubmitValue(overrides: Partial<ProjectInput> = {}) {
    return {
      ...form,
      slug: form.slug || slugify(form.title),
      ...overrides,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSubmitMode("publish");
    try {
      await onSubmit(buildSubmitValue());
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "保存项目失败，请稍后重试。");
    } finally {
      setSubmitMode(null);
    }
  }

  async function handleSaveDraft() {
    if (!onSaveDraft) {
      return;
    }

    setSubmitError("");
    setSubmitMode("draft");
    try {
      await onSaveDraft(buildSubmitValue({ published: false, featured: false }));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "保存草稿失败，请稍后重试。");
    } finally {
      setSubmitMode(null);
    }
  }

  async function handleReadmeImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      setForm((current) => ({ ...current, contentMarkdown: content }));
      setReadmeFileName(file.name);
      setReadmeError("");
    } catch {
      setReadmeError("README 导入失败，请重试或直接粘贴 Markdown 内容。");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-6">
        <FormSectionCard
          eyebrow="项目基础"
          title="先把项目卡片的核心信息整理清楚"
          description="本区域用于维护项目的基础信息，便于统一整理标题、摘要、亮点、技术栈与外部链接。"
        >
          <div className="grid gap-4">
            <Field label="项目标题">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="input-field"
                placeholder="AI 图片检索助手"
              />
            </Field>
            <Field label="项目摘要">
              <textarea
                rows={3}
                value={form.summary}
                onChange={(event) =>
                  setForm((current) => ({ ...current, summary: event.target.value }))
                }
                className="input-field min-h-[110px]"
                placeholder="用于卡片列表展示的一段简要说明。"
              />
            </Field>
            <Field label="详细说明">
              <textarea
                rows={6}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                className="input-field min-h-[180px]"
                placeholder="补充项目背景、实现方向、结果与价值。"
              />
            </Field>
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="README / Markdown"
          title="用 Markdown 写完整的项目说明"
          description="项目卡片继续使用结构化字段；详情页正文单独使用 Markdown。你可以直接粘贴内容，也可以把仓库里的 README.md 一键导入。"
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => readmeInputRef.current?.click()}
                className="button-secondary"
              >
                导入 README.md
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    contentMarkdown: createProjectMarkdownTemplate({
                      title: current.title,
                      summary: current.summary,
                      description: current.description,
                      highlights: current.highlights,
                    }),
                  }))
                }
                className="button-secondary"
              >
                生成模板
              </button>
              <input
                ref={readmeInputRef}
                type="file"
                accept=".md,text/markdown,text/plain"
                onChange={handleReadmeImport}
                className="hidden"
              />
            </div>

            {readmeFileName ? (
              <div className="rounded-2xl border border-accent/20 bg-accentSoft/70 px-4 py-3 text-sm text-ink">
                已导入文件：{readmeFileName}
              </div>
            ) : null}

            {readmeError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {readmeError}
              </div>
            ) : null}

            <Field label="Markdown 正文">
              <textarea
                rows={14}
                value={form.contentMarkdown}
                onChange={(event) =>
                  setForm((current) => ({ ...current, contentMarkdown: event.target.value }))
                }
                className="input-field min-h-[320px] font-mono text-[13px] leading-7"
                placeholder="# 项目概述&#10;&#10;这里写完整 README / Markdown 内容，公开详情页会直接展示这里的正文。"
              />
            </Field>
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="项目信息"
          title="技术栈、亮点与外部链接"
          description="技术栈、项目亮点与外部链接均可单独维护，用于保证项目资料表达完整、结构清晰。"
        >
          <div className="grid gap-5">
            <Field label="技术栈">
              <div className="flex flex-wrap gap-2">
                {form.techStack.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        techStack: current.techStack.filter((stack) => stack !== item),
                      }))
                    }
                  >
                    <SkillTag label={`${item} ×`} tone="accent" />
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-3">
                <input
                  value={techInput}
                  onChange={(event) => setTechInput(event.target.value)}
                  className="input-field"
                  placeholder="Spring Boot"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = techInput.trim();
                    if (!value) return;
                    setForm((current) => ({
                      ...current,
                      techStack: [...current.techStack, value],
                    }));
                    setTechInput("");
                  }}
                  className="button-secondary shrink-0"
                >
                  添加
                </button>
              </div>
            </Field>

            <Field label="项目亮点">
              <div className="space-y-2">
                {form.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          highlights: current.highlights.filter((highlight) => highlight !== item),
                        }))
                      }
                      className="text-rose-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-3">
                <input
                  value={highlightInput}
                  onChange={(event) => setHighlightInput(event.target.value)}
                  className="input-field"
                  placeholder="补充一个具体的实现亮点或成果"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = highlightInput.trim();
                    if (!value) return;
                    setForm((current) => ({
                      ...current,
                      highlights: [...current.highlights, value],
                    }));
                    setHighlightInput("");
                  }}
                  className="button-secondary shrink-0"
                >
                  添加
                </button>
              </div>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="GitHub 链接">
                <input
                  value={form.githubUrl ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, githubUrl: event.target.value }))
                  }
                  className="input-field"
                  placeholder="https://github.com/..."
                />
              </Field>
              <Field label="演示链接">
                <input
                  value={form.demoUrl ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, demoUrl: event.target.value }))
                  }
                  className="input-field"
                  placeholder="https://demo.example.com"
                />
              </Field>
            </div>
          </div>
        </FormSectionCard>
      </div>

      <div className="grid gap-6">
        <FormSectionCard
          eyebrow="发布设置"
          title="状态、媒体与实时预览"
          description="本区域用于统一维护发布状态、封面与截图，并实时查看公开页中的呈现效果。"
        >
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="年份">
                <input
                  value={form.year}
                  onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
                  className="input-field"
                  placeholder="2026"
                />
              </Field>
              <Field label="状态标签">
                <input
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, status: event.target.value }))
                  }
                  className="input-field"
                  placeholder="开发中"
                />
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <ToggleCard
                title="首页精选"
                description="在公开站首页展示这个项目"
                checked={form.featured}
                onChange={() => setForm((current) => ({ ...current, featured: !current.featured }))}
              />
              <ToggleCard
                title="公开发布"
                description="让这个项目出现在公开站页面中"
                checked={form.published}
                onChange={() => setForm((current) => ({ ...current, published: !current.published }))}
              />
            </div>

            <UploadDropzone
              label="项目封面"
              description="上传项目封面，支持即时预览。文件会通过后端直传到 OSS。"
              accept="image/*"
              onFilesSelected={handleCoverUpload}
            />

            {form.coverUrl ? (
              <MediaPreviewGrid
                items={[{ id: "cover", name: "项目封面", url: form.coverUrl }]}
                onRemove={() => setForm((current) => ({ ...current, coverUrl: "" }))}
              />
            ) : null}

            <UploadDropzone
              label="项目截图"
              description="上传项目截图，可多选。"
              accept="image/*"
              multiple
              onFilesSelected={handleGalleryUpload}
            />

            <MediaPreviewGrid
              items={form.gallery.map((url, index) => ({
                id: `${url}-${index}`,
                name: `截图 ${index + 1}`,
                url,
              }))}
              onRemove={(id) =>
                setForm((current) => ({
                  ...current,
                  gallery: current.gallery.filter((url, index) => `${url}-${index}` !== id),
                }))
              }
            />
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="预览"
          title="公开站卡片预览"
          description={`Slug：${previewProject.slug} · 阅读密度：${estimateReadingTime(
            previewProject.contentMarkdown || `${previewProject.summary} ${previewProject.description}`,
          )}`}
        >
          <div className="grid gap-5">
            <ProjectCard project={previewProject} compact />
            <div className="rounded-[28px] border border-line bg-white/82 p-4">
              <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
                详情页预览
              </div>
              <MarkdownPreview value={previewProject.contentMarkdown} />
            </div>
          </div>
        </FormSectionCard>

        {submitError ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        ) : null}

        <div className="flex justify-end gap-3">
          {onSaveDraft ? (
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={submitMode !== null}
              className="button-secondary"
            >
              {submitMode === "draft" ? "保存中..." : draftLabel}
            </button>
          ) : null}
          <button type="submit" disabled={submitMode !== null} className="button-primary">
            {submitMode === "publish" ? "保存中..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`rounded-[28px] border px-4 py-4 text-left transition ${
        checked
          ? "border-accent/40 bg-accentSoft/80"
          : "border-line bg-white/85 hover:border-accent/40"
      }`}
    >
      <div className="text-sm font-semibold text-ink">{title}</div>
      <p className="mt-2 text-sm leading-7">{description}</p>
      <div className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
        {checked ? "已启用" : "未启用"}
      </div>
    </button>
  );
}
