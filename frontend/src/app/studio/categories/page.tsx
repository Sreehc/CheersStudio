"use client";

import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FormSectionCard } from "@/components/FormSectionCard";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import type { Category } from "@/types";

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  sort: "0",
  enabled: true,
};

export default function ManageCategoriesPage() {
  const { store, isStoreLoading, createCategory, updateCategory, deleteCategory } = useStudioData();
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(null);

  const categories = useMemo(
    () => [...store.categories].sort((left, right) => (left.sort ?? 0) - (right.sort ?? 0)),
    [store.categories],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    const payload: Omit<Category, "id"> = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      sort: Number(form.sort || 0),
      enabled: form.enabled,
    };

    try {
      if (form.id) {
        await updateCategory(form.id, payload);
      } else {
        await createCategory(payload);
      }

      setForm(emptyForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "保存分类失败，请稍后重试。");
    } finally {
      setIsSaving(false);
    }
  }

  if (isStoreLoading) {
    return <div className="surface px-6 py-10 text-center text-muted">正在加载分类...</div>;
  }

  return (
    <div className="grid gap-6">
      <StudioPageHeader
        title="分类管理"
        description="管理博客分类，让文章发布时不再依赖临时手填。这里保持轻量，不拆独立复杂后台。"
      />

      <FormSectionCard
        eyebrow="分类编辑"
        title={form.id ? "编辑分类" : "新建分类"}
        description="分类名用于展示，slug 用于后端关联和接口查询。"
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          {errorMessage ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="分类名称">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="input-field"
                placeholder="工程实践"
              />
            </Field>
            <Field label="Slug 标识">
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="input-field"
                placeholder="engineering"
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="排序值">
              <input
                type="number"
                value={form.sort}
                onChange={(event) => setForm((current) => ({ ...current, sort: event.target.value }))}
                className="input-field"
              />
            </Field>
            <label className="flex items-center gap-3 rounded-[28px] border border-line bg-white/85 px-4 py-4 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) =>
                  setForm((current) => ({ ...current, enabled: event.target.checked }))
                }
              />
              启用这个分类
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {form.id ? (
              <button
                type="button"
                className="button-secondary"
                onClick={() => setForm(emptyForm)}
              >
                取消编辑
              </button>
            ) : null}
            <button type="submit" className="button-primary" disabled={isSaving}>
              {isSaving ? "保存中..." : form.id ? "保存分类" : "创建分类"}
            </button>
          </div>
        </form>
      </FormSectionCard>

      <section className="surface px-6 py-6 lg:px-8">
        <div>
          <span className="eyebrow">分类库</span>
          <h2 className="text-2xl font-semibold text-ink">分类列表</h2>
          <p className="mt-2 text-sm leading-7">当前分类会同时服务管理端写作和公开博客分类展示。</p>
        </div>

        {categories.length > 0 ? (
          <div className="mt-6 space-y-4">
            {categories.map((category) => (
              <article
                key={category.id}
                className="surface-muted flex flex-col gap-4 rounded-[28px] px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-ink">{category.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    slug：{category.slug} · 排序：{category.sort ?? 0} ·{" "}
                    {category.enabled ? "已启用" : "已停用"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() =>
                      setForm({
                        id: category.id,
                        name: category.name,
                        slug: category.slug,
                        sort: String(category.sort ?? 0),
                        enabled: category.enabled,
                      })
                    }
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-line px-4 py-3 text-sm font-medium text-muted transition hover:border-rose-300 hover:text-rose-600"
                    onClick={() => setCategoryIdToDelete(category.id)}
                  >
                    删除
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface-muted mt-6 rounded-[28px] px-6 py-10 text-center">
            <h3 className="text-xl font-semibold text-ink">还没有任何分类。</h3>
            <p className="mt-3 text-sm leading-7">先创建分类，再去写博客会更顺手。</p>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(categoryIdToDelete)}
        title="确认删除这个分类吗？"
        description="删除分类后，后续文章发布将无法再使用它。"
        confirmLabel="确认删除"
        onCancel={() => setCategoryIdToDelete(null)}
        onConfirm={() => {
          if (categoryIdToDelete) {
            void (async () => {
              try {
                setErrorMessage("");
                await deleteCategory(categoryIdToDelete);
                setCategoryIdToDelete(null);
              } catch (error) {
                setErrorMessage(
                  error instanceof Error ? error.message : "删除分类失败，请稍后重试。",
                );
                setCategoryIdToDelete(null);
              }
            })();
          }
        }}
      />
    </div>
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
