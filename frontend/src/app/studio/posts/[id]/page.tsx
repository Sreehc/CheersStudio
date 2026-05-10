"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { PostEditor } from "@/components/PostEditor";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import { getAdminPostDetail } from "@/lib/services/posts";
import type { Post } from "@/types";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isStoreLoading, updatePost, uploadAsset, categories } = useStudioData();
  const [post, setPost] = useState<Post | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPost() {
      try {
        const response = await getAdminPostDetail(params.id);
        if (active) {
          setPost(response);
        }
      } catch {
        if (active) {
          setPost(null);
        }
      } finally {
        if (active) {
          setIsPageLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (isStoreLoading || isPageLoading) {
    return <div className="surface px-6 py-10 text-center text-muted">正在加载文章...</div>;
  }

  if (!post) {
    return (
      <div className="surface px-6 py-10 text-center">
        <span className="eyebrow">文章不存在</span>
        <h1 className="text-3xl font-semibold text-ink">当前工作台里找不到这篇文章。</h1>
        <div className="mt-6 flex justify-center">
          <Link href="/studio/posts" className="button-primary">
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudioPageHeader
        title="编辑文章"
        description="继续写作、修改摘要、调整分类与封面，或者切换文章的公开发布状态。"
      />
      <PostEditor
        initialValue={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          categoryName: post.categoryName,
          categorySlug: post.categorySlug,
          publishedAt: post.publishedAt.slice(0, 10),
          featured: post.featured,
          coverUrl: post.coverUrl,
          contentMarkdown: post.contentMarkdown,
          status: post.status,
          readingTime: post.readingTime,
        }}
        categories={categories}
        submitLabel="保存并发布"
        draftLabel="保存草稿"
        onUpload={async (file, moduleType) => {
          const asset = await uploadAsset(file, moduleType);
          return { id: asset.id, url: asset.url, name: asset.name };
        }}
        onSubmit={async (value) => {
          await updatePost(post.id, { ...value, status: "published" });
          router.push("/studio/posts");
        }}
        onSaveDraft={async (value) => {
          await updatePost(post.id, { ...value, status: "draft", featured: false });
          router.push("/studio/posts");
        }}
      />
    </div>
  );
}
