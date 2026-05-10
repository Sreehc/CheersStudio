import Link from "next/link";

import type { Post } from "@/types";

import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: Post;
  compact?: boolean;
};

export function BlogCard({ post, compact = false }: BlogCardProps) {
  return (
    <article
      className={cn(
        "surface group flex h-full flex-col px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50",
        compact && "gap-4",
      )}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
        <span className="tag-chip">{post.categoryName}</span>
        <span>{formatDate(post.publishedAt)}</span>
        <span>{post.readingTime}</span>
      </div>

      <div className="mt-5">
        <h3 className="text-2xl font-semibold text-ink">{post.title}</h3>
        <p className="mt-3 text-sm leading-7">{post.excerpt}</p>
      </div>

      <div className="mt-auto pt-6">
        <Link href={`/blog/${post.slug}`} className="button-secondary">
          Read More
        </Link>
      </div>
    </article>
  );
}
