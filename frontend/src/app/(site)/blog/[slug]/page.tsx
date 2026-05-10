"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { MarkdownPreview } from "@/components/MarkdownPreview";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getPostDetail } from "@/lib/services/posts";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPost() {
      try {
        const response = await getPostDetail(params.slug);
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
  }, [params.slug]);

  if (isPageLoading) {
    return (
      <PageContainer className="py-16">
        <div className="surface px-8 py-10 text-center text-muted">Loading post...</div>
      </PageContainer>
    );
  }

  if (!post) {
    return (
      <PageContainer className="py-16">
        <div className="surface px-8 py-10 text-center">
          <span className="eyebrow">Post Details</span>
          <h1 className="text-3xl font-semibold text-ink">This post is not published yet.</h1>
          <p className="mt-4 text-base leading-8">
            当前还没有可公开访问的博客详情内容。等文章发布后，这里会自动展示 Markdown 正文。
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/blog" className="button-primary">
              Back to Blog
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader
        title={post.title}
        description={post.excerpt}
        meta={[
          { label: "Category", value: post.categoryName },
          { label: "Published", value: formatDate(post.publishedAt) },
          { label: "Reading Time", value: post.readingTime },
        ]}
        action={
          <Link href="/blog" className="button-secondary">
            Back to Blog
          </Link>
        }
      />

      <MarkdownPreview value={post.contentMarkdown} />
    </PageContainer>
  );
}
