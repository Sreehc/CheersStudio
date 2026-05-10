"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { PageContainer } from "@/components/PageContainer";
import { StudioSidebar } from "@/components/StudioSidebar";
import { useAuth } from "@/components/providers/RootProviders";

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isHydrated, logout, session } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isHydrated, pathname, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <PageContainer className="flex min-h-screen items-center justify-center py-20">
        <div className="surface px-6 py-6 text-center">
          <div className="eyebrow">工作台</div>
          <p className="text-sm leading-7">正在检查访问权限…</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-line/70 bg-white/80 px-6 py-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-sm font-semibold text-ink">欢迎回来，{session?.adminProfile.name}</div>
          <div className="mt-1 text-sm text-muted">
            这里是你的轻量创作工作台，用来维护项目、博客与站点内容。
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="button-secondary">
            查看公开站
          </Link>
          <button
            type="button"
            onClick={() => logout().then(() => router.replace("/"))}
            className="button-primary"
          >
            退出登录
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <StudioSidebar />
        <div>{children}</div>
      </div>
    </PageContainer>
  );
}
