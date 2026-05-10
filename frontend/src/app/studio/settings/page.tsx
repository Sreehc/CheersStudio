"use client";

import { useEffect, useMemo, useState } from "react";

import { FormSectionCard } from "@/components/FormSectionCard";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import type { ContactLink, HeaderMeta } from "@/types";

export default function SiteSettingsPage() {
  const { store, isStoreLoading, updateSiteSettings } = useStudioData();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: store.siteSettings.name,
    title: store.siteSettings.title,
    description: store.siteSettings.description,
    location: store.siteSettings.location,
    email: store.siteSettings.email,
    navbarSubtitle: store.siteSettings.navbarSubtitle,
    footerDescription: store.siteSettings.footerDescription,
    aboutIntro: store.siteSettings.aboutIntro,
    aboutDirections: store.siteSettings.aboutDirections.join("\n"),
    aboutFocuses: store.siteSettings.aboutFocuses.join("\n"),
    aboutWorkflow: store.siteSettings.aboutWorkflow.join("\n"),
    aboutValues: serializeValueItems(store.siteSettings.aboutValues),
    heroStats: serializeHeroStats(store.siteSettings.heroStats),
    introBlocks: store.siteSettings.introBlocks.join("\n"),
    socialLinks: serializeLinks(store.siteSettings.socialLinks),
    contactLinks: serializeLinks(store.siteSettings.contactLinks),
    ctaTitle: store.siteSettings.cta.title,
    ctaDescription: store.siteSettings.cta.description,
    ctaLabel: store.siteSettings.cta.primaryLabel,
    ctaHref: store.siteSettings.cta.primaryHref,
    contactFormTitle: store.siteSettings.contactForm.title,
    contactFormDescription: store.siteSettings.contactForm.description,
    namePlaceholder: store.siteSettings.contactForm.placeholders.name,
    emailPlaceholder: store.siteSettings.contactForm.placeholders.email,
    messagePlaceholder: store.siteSettings.contactForm.placeholders.message,
  });

  const previewSocialCount = useMemo(
    () => parseLinks(form.socialLinks).length,
    [form.socialLinks],
  );

  useEffect(() => {
    setForm({
      name: store.siteSettings.name,
      title: store.siteSettings.title,
      description: store.siteSettings.description,
      location: store.siteSettings.location,
      email: store.siteSettings.email,
      navbarSubtitle: store.siteSettings.navbarSubtitle,
      footerDescription: store.siteSettings.footerDescription,
      aboutIntro: store.siteSettings.aboutIntro,
      aboutDirections: store.siteSettings.aboutDirections.join("\n"),
      aboutFocuses: store.siteSettings.aboutFocuses.join("\n"),
      aboutWorkflow: store.siteSettings.aboutWorkflow.join("\n"),
      aboutValues: serializeValueItems(store.siteSettings.aboutValues),
      heroStats: serializeHeroStats(store.siteSettings.heroStats),
      introBlocks: store.siteSettings.introBlocks.join("\n"),
      socialLinks: serializeLinks(store.siteSettings.socialLinks),
      contactLinks: serializeLinks(store.siteSettings.contactLinks),
      ctaTitle: store.siteSettings.cta.title,
      ctaDescription: store.siteSettings.cta.description,
      ctaLabel: store.siteSettings.cta.primaryLabel,
      ctaHref: store.siteSettings.cta.primaryHref,
      contactFormTitle: store.siteSettings.contactForm.title,
      contactFormDescription: store.siteSettings.contactForm.description,
      namePlaceholder: store.siteSettings.contactForm.placeholders.name,
      emailPlaceholder: store.siteSettings.contactForm.placeholders.email,
      messagePlaceholder: store.siteSettings.contactForm.placeholders.message,
    });
  }, [store.siteSettings]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    try {
      await updateSiteSettings({
        ...store.siteSettings,
        name: form.name,
        title: form.title,
        description: form.description,
        location: form.location,
        email: form.email,
        navbarSubtitle: form.navbarSubtitle,
        footerDescription: form.footerDescription,
        aboutIntro: form.aboutIntro,
        aboutDirections: parseLines(form.aboutDirections),
        aboutFocuses: parseLines(form.aboutFocuses),
        aboutWorkflow: parseLines(form.aboutWorkflow),
        aboutValues: parseValueItems(form.aboutValues),
        heroStats: parseHeroStats(form.heroStats),
        introBlocks: parseLines(form.introBlocks),
        socialLinks: parseLinks(form.socialLinks),
        contactLinks: parseLinks(form.contactLinks),
        cta: {
          title: form.ctaTitle,
          description: form.ctaDescription,
          primaryLabel: form.ctaLabel,
          primaryHref: form.ctaHref,
        },
        contactForm: {
          title: form.contactFormTitle,
          description: form.contactFormDescription,
          placeholders: {
            name: form.namePlaceholder,
            email: form.emailPlaceholder,
            message: form.messagePlaceholder,
          },
        },
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "保存站点设置失败，请稍后重试。");
    } finally {
      setIsSaving(false);
    }
  }

  if (isStoreLoading) {
    return <div className="surface px-6 py-10 text-center text-muted">正在加载站点设置...</div>;
  }

  return (
    <div>
      <StudioPageHeader
        title="站点设置"
        description="维护 Hero、About、CTA、社交链接与联系信息。这里优先保证可维护性和 API-ready 结构，不追求复杂可视化配置。"
      />

      <form onSubmit={handleSubmit} className="grid gap-6">
        <FormSectionCard
          eyebrow="品牌信息"
          title="站点核心识别内容"
          description="站点名称、主标题、副介绍和关于我简介，决定公开站的核心语气。"
        >
          <div className="grid gap-4">
            {errorMessage ? (
              <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}
            <Field label="站点名称">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="input-field"
              />
            </Field>
            <Field label="首页主标题">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="input-field"
              />
            </Field>
            <Field label="首页介绍">
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                className="input-field min-h-[130px]"
              />
            </Field>
            <Field label="关于简介">
              <textarea
                rows={5}
                value={form.aboutIntro}
                onChange={(event) =>
                  setForm((current) => ({ ...current, aboutIntro: event.target.value }))
                }
                className="input-field min-h-[160px]"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="导航副标题">
                <input
                  value={form.navbarSubtitle}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, navbarSubtitle: event.target.value }))
                  }
                  className="input-field"
                />
              </Field>
              <Field label="页脚介绍">
                <textarea
                  rows={3}
                  value={form.footerDescription}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, footerDescription: event.target.value }))
                  }
                  className="input-field min-h-[110px]"
                />
              </Field>
            </div>
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="首页内容"
          title="数据摘要、简介区块与 CTA"
          description="每一行 `label|value` 或一行一个段落，维持简单可维护的编辑方式。"
        >
          <div className="grid gap-4">
            <Field label="首页数据摘要（label|value）">
              <textarea
                rows={4}
                value={form.heroStats}
                onChange={(event) =>
                  setForm((current) => ({ ...current, heroStats: event.target.value }))
                }
                className="input-field min-h-[140px] font-mono text-[13px]"
              />
            </Field>
            <Field label="简介区块（每行一段）">
              <textarea
                rows={5}
                value={form.introBlocks}
                onChange={(event) =>
                  setForm((current) => ({ ...current, introBlocks: event.target.value }))
                }
                className="input-field min-h-[180px]"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA 标题">
                <input
                  value={form.ctaTitle}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, ctaTitle: event.target.value }))
                  }
                  className="input-field"
                />
              </Field>
              <Field label="CTA 按钮文案">
                <input
                  value={form.ctaLabel}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, ctaLabel: event.target.value }))
                  }
                  className="input-field"
                />
              </Field>
            </div>
            <Field label="CTA 描述">
              <textarea
                rows={4}
                value={form.ctaDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, ctaDescription: event.target.value }))
                }
                className="input-field min-h-[130px]"
              />
            </Field>
            <Field label="CTA 跳转链接">
              <input
                value={form.ctaHref}
                onChange={(event) =>
                  setForm((current) => ({ ...current, ctaHref: event.target.value }))
                }
                className="input-field"
              />
            </Field>
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="About 内容"
          title="关于页结构内容"
          description="每行一条内容；价值观使用 title|description 结构，供首页与 About 页共同展示。"
        >
          <div className="grid gap-4">
            <Field label="技术方向（每行一条）">
              <textarea
                rows={4}
                value={form.aboutDirections}
                onChange={(event) =>
                  setForm((current) => ({ ...current, aboutDirections: event.target.value }))
                }
                className="input-field min-h-[140px]"
              />
            </Field>
            <Field label="当前关注（每行一条）">
              <textarea
                rows={4}
                value={form.aboutFocuses}
                onChange={(event) =>
                  setForm((current) => ({ ...current, aboutFocuses: event.target.value }))
                }
                className="input-field min-h-[140px]"
              />
            </Field>
            <Field label="做事方式（每行一条）">
              <textarea
                rows={4}
                value={form.aboutWorkflow}
                onChange={(event) =>
                  setForm((current) => ({ ...current, aboutWorkflow: event.target.value }))
                }
                className="input-field min-h-[140px]"
              />
            </Field>
            <Field label="价值观（title|description）">
              <textarea
                rows={6}
                value={form.aboutValues}
                onChange={(event) =>
                  setForm((current) => ({ ...current, aboutValues: event.target.value }))
                }
                className="input-field min-h-[180px] font-mono text-[13px]"
              />
            </Field>
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="链接信息"
          title="社交链接与联系入口"
          description={`每行格式为 label|value|href|note。当前已解析出 ${previewSocialCount} 条社交链接。`}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="社交链接">
              <textarea
                rows={7}
                value={form.socialLinks}
                onChange={(event) =>
                  setForm((current) => ({ ...current, socialLinks: event.target.value }))
                }
                className="input-field min-h-[220px] font-mono text-[13px]"
              />
            </Field>
            <Field label="联系链接">
              <textarea
                rows={7}
                value={form.contactLinks}
                onChange={(event) =>
                  setForm((current) => ({ ...current, contactLinks: event.target.value }))
                }
                className="input-field min-h-[220px] font-mono text-[13px]"
              />
            </Field>
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="联系表单"
          title="联系文案与占位提示"
          description="保持公开站联系页的文案和表单占位语可以直接从这里修改。"
        >
          <div className="grid gap-4">
            <Field label="所在地">
              <input
                value={form.location}
                onChange={(event) =>
                  setForm((current) => ({ ...current, location: event.target.value }))
                }
                className="input-field"
              />
            </Field>
            <Field label="联系邮箱">
              <input
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                className="input-field"
              />
            </Field>
            <Field label="表单标题">
              <input
                value={form.contactFormTitle}
                onChange={(event) =>
                  setForm((current) => ({ ...current, contactFormTitle: event.target.value }))
                }
                className="input-field"
              />
            </Field>
            <Field label="表单说明">
              <textarea
                rows={4}
                value={form.contactFormDescription}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    contactFormDescription: event.target.value,
                  }))
                }
                className="input-field min-h-[130px]"
              />
            </Field>
            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="姓名占位文案">
                <input
                  value={form.namePlaceholder}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, namePlaceholder: event.target.value }))
                  }
                  className="input-field"
                />
              </Field>
              <Field label="邮箱占位文案">
                <input
                  value={form.emailPlaceholder}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, emailPlaceholder: event.target.value }))
                  }
                  className="input-field"
                />
              </Field>
              <Field label="消息占位文案">
                <input
                  value={form.messagePlaceholder}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, messagePlaceholder: event.target.value }))
                  }
                  className="input-field"
                />
              </Field>
            </div>
          </div>
        </FormSectionCard>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="button-primary">
            {isSaving ? "保存中..." : "保存设置"}
          </button>
        </div>
      </form>
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

function serializeHeroStats(items: HeaderMeta[]) {
  return items.map((item) => `${item.label}|${item.value}`).join("\n");
}

function parseHeroStats(input: string) {
  return parseLines(input).map((line) => {
      const [label = "", value = ""] = line.split("|").map((item) => item.trim());
      return { label, value };
    });
}

function serializeLinks(items: ContactLink[]) {
  return items
    .map((item) => [item.label, item.value, item.href, item.note || ""].join("|"))
    .join("\n");
}

function parseLinks(input: string): ContactLink[] {
  return parseLines(input).map((line) => {
      const [label = "", value = "", href = "", note = ""] = line.split("|").map((item) => item.trim());
      return { label, value, href, note };
    });
}

function parseLines(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function serializeValueItems(items: Array<{ title: string; description: string }>) {
  return items.map((item) => `${item.title}|${item.description}`).join("\n");
}

function parseValueItems(input: string) {
  return parseLines(input).map((line) => {
    const [title = "", description = ""] = line.split("|").map((item) => item.trim());
    return { title, description };
  });
}
