"use client";

import Link from "next/link";

import { PageContainer } from "@/components/PageContainer";
import { useStudioData } from "@/components/providers/RootProviders";

export function Footer() {
  const { store } = useStudioData();

  return (
    <footer className="mt-24 border-t border-line/60">
      <PageContainer className="py-10">
        <div className="surface grid gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-3">
            <p className="eyebrow">CheersStudio</p>
            <h2 className="text-2xl font-semibold text-ink">{store.siteSettings.title}</h2>
            <p className="max-w-xl text-sm leading-7">{store.siteSettings.footerDescription}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {store.siteSettings.socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="surface-muted rounded-2xl px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-accent/50"
              >
                <div className="text-xs uppercase tracking-[0.22em] text-muted">{link.label}</div>
                <div className="mt-2 text-sm font-medium text-ink">{link.value}</div>
                {link.note ? <div className="mt-2 text-xs text-muted">{link.note}</div> : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {store.siteSettings.name}. 个人作品展示、技术记录与长期实践空间。</p>
          <p className="font-mono text-xs uppercase tracking-[0.18em]">Designed in public</p>
        </div>
      </PageContainer>
    </footer>
  );
}
