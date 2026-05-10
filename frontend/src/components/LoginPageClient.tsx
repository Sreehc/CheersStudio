"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { AuthForm } from "@/components/AuthForm";
import { PageContainer } from "@/components/PageContainer";
import { useAuth } from "@/components/providers/RootProviders";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isHydrated, login } = useAuth();
  const next = searchParams.get("next") || "/studio";

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(next);
    }
  }, [isAuthenticated, isHydrated, next, router]);

  return (
    <PageContainer className="flex min-h-screen items-center justify-center py-20">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="surface flex flex-col justify-between px-6 py-6 lg:px-8">
          <div>
            <span className="eyebrow">创作者入口</span>
            <h1 className="text-4xl font-semibold text-ink">Cheers 的创作者入口</h1>
            <p className="mt-4 text-base leading-8">
              这是站内创作者入口。公开站保持展示感，登录后进入同一套视觉语言下的内容工作台。
            </p>
          </div>
          <div className="mt-6 rounded-[28px] border border-line bg-slate-50 px-5 py-5">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">你可以做什么</div>
            <div className="mt-3 space-y-2 text-sm leading-7 text-muted">
              <p>发布项目，维护封面、截图、亮点和外部链接。</p>
              <p>使用 Markdown 编写博客，并实时预览正文效果。</p>
              <p>修改站点级内容，而不破坏当前公开站视觉结构。</p>
            </div>
            <div className="mt-5">
              <Link href="/" className="button-secondary">
                返回公开站
              </Link>
            </div>
          </div>
        </div>

        <AuthForm
          onSubmit={async (values) => {
            await login(values);
            router.replace(next);
          }}
        />
      </div>
    </PageContainer>
  );
}
