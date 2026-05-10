 "use client";

import Link from "next/link";

import { useStudioData } from "@/components/providers/RootProviders";
import { SkillTag } from "@/components/SkillTag";

const heroSkills = [
  "Backend",
  "AI Practice",
  "Deployment",
];

export function HeroSection() {
  const { store } = useStudioData();

  return (
    <section className="page-section pt-16 md:pt-24">
      <div className="grid gap-8 xl:grid-cols-[1.26fr_0.74fr] xl:items-center">
        <div className="stagger-in space-y-7 xl:pr-12 2xl:pr-16">
          <span className="eyebrow">Portfolio / Blog / Practice</span>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] text-ink sm:text-6xl xl:text-[5rem]">
              CheersStudio
            </h1>
            <p className="max-w-3xl font-mono text-[13px] uppercase tracking-[0.2em] text-accent sm:text-sm">
              Java / Spring / AI 应用实践，面向可交付的工程实现
            </p>
            <p className="max-w-2xl text-base leading-8 md:text-lg">
              我把项目实践、技术写作和复盘整理放进同一个长期更新的个人技术工作台。
            </p>
          </div>

          <div className="space-y-4 xl:space-y-5">
            <div className="flex flex-wrap gap-2.5">
              {heroSkills.map((skill) => (
                <SkillTag key={skill} label={skill} tone="accent" />
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1 xl:pt-2">
              <Link href="/projects" className="button-primary">
                View Projects
              </Link>
              <Link href="/blog" className="button-secondary">
                Read Blog
              </Link>
            </div>
          </div>
        </div>

        <div className="stagger-in surface relative overflow-hidden px-6 py-6 [animation-delay:120ms] lg:px-7 lg:py-7 xl:-translate-y-8 xl:max-w-[560px] xl:justify-self-end 2xl:-translate-y-10 2xl:max-w-[580px]">
          <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
          <div className="grid gap-5">
            <div className="surface-muted overflow-hidden rounded-3xl">
              <div className="flex items-center gap-2 border-b border-line/70 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  workspace.ts
                </span>
              </div>
              <div className="space-y-2.5 px-4 py-4 font-mono text-sm leading-6.5 text-slate-700">
                <div>
                  <span className="text-accent">const</span> focus = [
                </div>
                <div className="pl-4">&quot;Java / Spring&quot;,</div>
                <div className="pl-4">&quot;AI 应用实践&quot;,</div>
                <div className="pl-4">&quot;面向交付的工程化&quot;</div>
                <div>];</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.98fr_1.02fr]">
              <div className="surface-muted rounded-3xl p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Quick Facts</div>
                <div className="mt-3.5 space-y-3.5">
                  {store.siteSettings.heroStats.map((item) => (
                    <div key={item.label}>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">
                        {item.label}
                      </div>
                      <div className="mt-1 text-sm font-medium text-ink">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-muted rounded-3xl p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">
                  Skill Overview
                </div>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {heroSkills.map((skill) => (
                    <SkillTag key={skill} label={skill} tone="accent" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
