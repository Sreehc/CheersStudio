"use client";

import { useMemo, useRef, useState } from "react";

import { FormSectionCard } from "@/components/FormSectionCard";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { MediaPreviewGrid } from "@/components/MediaPreviewGrid";
import { UploadDropzone } from "@/components/UploadDropzone";
import { estimateReadingTime, slugify } from "@/lib/utils";
import type { Category, PostInput } from "@/types";

type PostEditorProps = {
  initialValue: PostInput;
  categories: Category[];
  onSubmit: (value: PostInput) => Promise<void>;
  onSaveDraft?: (value: PostInput) => Promise<void>;
  onUpload: (
    file: File,
    moduleType?: string,
  ) => Promise<{ id: string; url: string; name: string }>;
  submitLabel: string;
  draftLabel?: string;
};

export function PostEditor({
  initialValue,
  categories,
  onSubmit,
  onSaveDraft,
  onUpload,
  submitLabel,
  draftLabel = "保存草稿",
}: PostEditorProps) {
  const [form, setForm] = useState(initialValue);
  const [isPreview, setIsPreview] = useState(true);
  const [submitMode, setSubmitMode] = useState<"publish" | "draft" | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [markdownAssetName, setMarkdownAssetName] = useState("");
  const [markdownAssetUrl, setMarkdownAssetUrl] = useState("");
  const [markdownError, setMarkdownError] = useState("");
  const markdownInputRef = useRef<HTMLInputElement | null>(null);

  const readingTime = useMemo(() => estimateReadingTime(form.contentMarkdown), [form.contentMarkdown]);
  const slug = form.slug || slugify(form.title);

  async function handleCoverUpload(files: FileList) {
    const asset = await onUpload(files[0], "post_cover");
    setForm((current) => ({ ...current, coverUrl: asset.url }));
  }

  async function handleMarkdownUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMarkdownError("");

    try {
      const [asset, content] = await Promise.all([
        onUpload(file, "post_markdown"),
        file.text(),
      ]);

      setForm((current) => ({ ...current, contentMarkdown: content }));
      setMarkdownAssetName(asset.name);
      setMarkdownAssetUrl(asset.url);
    } catch (error) {
      setMarkdownError(error instanceof Error ? error.message : "Markdown 文件上传失败，请稍后重试。");
    } finally {
      event.target.value = "";
    }
  }

  function buildSubmitValue(overrides: Partial<PostInput> = {}) {
    return {
      ...form,
      slug,
      readingTime,
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
      setSubmitError(error instanceof Error ? error.message : "保存文章失败，请稍后重试。");
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
      await onSaveDraft(buildSubmitValue({ status: "draft", featured: false }));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "保存草稿失败，请稍后重试。");
    } finally {
      setSubmitMode(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="grid gap-6">
        <FormSectionCard
          eyebrow="文章编辑"
          title="以写作为中心组织你的文章内容"
          description="博客页更像编辑器，而不是纯表单。正文始终是主角，其余字段只负责发布信息。"
        >
          <div className="grid gap-4">
            <Field label="文章标题">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="input-field"
                placeholder="一次小型后端工具上线后的复盘"
              />
            </Field>
            <Field label="摘要">
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(event) =>
                  setForm((current) => ({ ...current, excerpt: event.target.value }))
                }
                className="input-field min-h-[110px]"
                placeholder="用于列表卡片和详情页头部的一段简要摘要。"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="分类">
                <select
                  value={form.categorySlug}
                  onChange={(event) =>
                    setForm((current) => {
                      const target = categories.find((item) => item.slug === event.target.value);
                      return {
                        ...current,
                        categorySlug: event.target.value,
                        categoryName: target?.name || current.categoryName,
                      };
                    })
                  }
                  className="input-field"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="发布时间">
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, publishedAt: event.target.value }))
                  }
                  className="input-field"
                />
              </Field>
            </div>

            <Field label="Markdown 正文">
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => markdownInputRef.current?.click()}
                    className="button-secondary"
                  >
                    上传 Markdown 文件
                  </button>
                  <input
                    ref={markdownInputRef}
                    type="file"
                    accept=".md,text/markdown,text/plain"
                    onChange={handleMarkdownUpload}
                    className="hidden"
                  />
                </div>

                {markdownAssetName ? (
                  <div className="rounded-2xl border border-accent/20 bg-accentSoft/70 px-4 py-3 text-sm text-ink">
                    已上传文件：{markdownAssetName}
                    {markdownAssetUrl ? (
                      <>
                        {" "}
                        <a
                          href={markdownAssetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-accent underline underline-offset-4"
                        >
                          查看 OSS 文件
                        </a>
                      </>
                    ) : null}
                  </div>
                ) : null}

                {markdownError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {markdownError}
                  </div>
                ) : null}

                <textarea
                  rows={18}
                  value={form.contentMarkdown}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, contentMarkdown: event.target.value }))
                  }
                  className="input-field min-h-[420px] font-mono text-[13px] leading-7"
                  placeholder="# 标题&#10;&#10;从这里开始写正文..."
                />
              </div>
            </Field>
          </div>
        </FormSectionCard>
      </div>

      <div className="grid gap-6">
        <FormSectionCard
          eyebrow="发布控制"
          title="元信息、封面与发布状态"
          description="这部分控制封面、slug、阅读时长与发布状态，让写作体验更接近成熟创作者产品。"
        >
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug 标识">
                <input
                  value={slug}
                  onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                  className="input-field"
                />
              </Field>
              <Field label="预计阅读时长">
                <input value={readingTime} readOnly className="input-field bg-slate-50" />
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ToggleCard
                title="首页精选"
                description="在公开站首页展示这篇文章"
                checked={form.featured}
                onChange={() => setForm((current) => ({ ...current, featured: !current.featured }))}
              />
              <ToggleCard
                title="公开发布"
                description="让这篇文章对外可见"
                checked={form.status === "published"}
                onChange={() =>
                  setForm((current) => ({
                    ...current,
                    status: current.status === "published" ? "draft" : "published",
                  }))
                }
              />
            </div>

            <UploadDropzone
              label="文章封面"
              description="上传博客封面图，文件会通过后端直传到 OSS。"
              accept="image/*"
              onFilesSelected={handleCoverUpload}
            />

            {form.coverUrl ? (
              <MediaPreviewGrid
                items={[{ id: "cover", name: "文章封面", url: form.coverUrl }]}
                onRemove={() => setForm((current) => ({ ...current, coverUrl: "" }))}
              />
            ) : null}
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="预览"
          title="Markdown 预览"
          description="可以直接切换查看渲染效果，确保公开站展示前的节奏与排版是干净的。"
        >
          <div className="mb-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={isPreview ? "button-primary" : "button-secondary"}
            >
              正文预览
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={!isPreview ? "button-primary" : "button-secondary"}
            >
              发布信息
            </button>
          </div>
          {isPreview ? (
            <MarkdownPreview value={form.contentMarkdown} />
          ) : (
            <div className="surface-muted rounded-[28px] px-5 py-5 text-sm leading-7">
              <div className="text-xs uppercase tracking-[0.18em] text-muted">预览信息</div>
              <p className="mt-3 text-ink">标题：{form.title || "未命名文章"}</p>
              <p>分类：{form.categoryName || "未分类"}</p>
              <p>Slug：{slug || "根据标题自动生成"}</p>
              <p>状态：{form.status === "published" ? "已发布" : "草稿"}</p>
              <p>阅读时长：{readingTime}</p>
            </div>
          )}
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
