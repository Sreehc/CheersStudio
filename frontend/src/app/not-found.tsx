import Link from "next/link";

import { PageContainer } from "@/components/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center">
      <div className="surface max-w-xl px-8 py-10 text-center">
        <span className="eyebrow">404</span>
        <h1 className="text-4xl font-semibold text-ink">
          This page is not available right now.
        </h1>
        <p className="mt-4 text-base leading-8">
          你访问的内容还没有准备好，或者这个占位路由暂时不存在。可以先返回首页继续浏览 CheersStudio。
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className="button-primary">
            Back Home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
