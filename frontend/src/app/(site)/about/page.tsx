"use client";

import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import { SkillTag } from "@/components/SkillTag";
import { skillGroups } from "@/data/about";

export default function AboutPage() {
  const { store } = useStudioData();

  return (
    <PageContainer>
      <PageHeader
        title="关于我"
        description="关于我、我的技术方向，以及我如何把学习、写作和项目实践连接成一个长期迭代的个人技术体系。"
        meta={[
          { label: "Primary Direction", value: "Java / Spring + AI practice" },
          { label: "Working Style", value: "Build, document, refine" },
        ]}
      />

      <section className="grid gap-6 pb-12 lg:grid-cols-2">
        <article className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Intro / 自我介绍</span>
          <p className="text-base leading-8">{store.siteSettings.aboutIntro}</p>
        </article>

        <article className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Direction / 技术方向</span>
          <div className="space-y-4">
            {store.siteSettings.aboutDirections.map((item) => (
              <p key={item} className="text-base leading-8">
                {item}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 pb-12 lg:grid-cols-2">
        <article className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Current Focus / 当前关注</span>
          <div className="space-y-4">
            {store.siteSettings.aboutFocuses.map((item) => (
              <p key={item} className="text-base leading-8">
                {item}
              </p>
            ))}
          </div>
        </article>

        <article className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Workflow / 做事方式</span>
          <div className="space-y-4">
            {store.siteSettings.aboutWorkflow.map((item) => (
              <p key={item} className="text-base leading-8">
                {item}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="page-section pt-0">
        <div className="grid gap-5 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <article key={group.title} className="surface px-6 py-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">{group.title}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <SkillTag key={skill.name} label={skill.name} tone="accent" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section pt-0">
        <div className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Values / 我重视什么</span>
          <div className="grid gap-5 md:grid-cols-2">
            {store.siteSettings.aboutValues.map((item) => (
              <article key={item.title} className="surface-muted rounded-[28px] px-5 py-5">
                <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
