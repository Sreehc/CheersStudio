"use client";

import { featuredPosts, posts } from "@/data/posts";
import { apiRequest } from "@/lib/services/http";
import { estimateReadingTime, slugify } from "@/lib/utils";
import type { Post, PostInput } from "@/types";

type PostResponse = {
  id?: number;
  uid: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  coverAssetUrl?: string;
  contentMarkdown?: string;
  status: "draft" | "published";
  updatedAt: string;
};

type PostPageResponse = {
  records: PostResponse[];
};

export async function getPublicPosts() {
  try {
    const response = await apiRequest<PostResponse[]>("/api/public/posts");
    return response.map(mapPost);
  } catch {
    return posts.filter((post) => post.status === "published");
  }
}

export async function getFeaturedPosts() {
  try {
    const response = await apiRequest<PostResponse[]>("/api/public/posts/featured");
    return response.map(mapPost);
  } catch {
    return featuredPosts.filter((post) => post.status === "published");
  }
}

export async function getPostDetail(slug: string) {
  try {
    const response = await apiRequest<PostResponse>(`/api/public/posts/${slug}`);
    return mapPost(response);
  } catch {
    return posts.find((post) => post.slug === slug && post.status === "published") ?? null;
  }
}

export async function listAdminPosts() {
  const response = await apiRequest<PostPageResponse>("/api/admin/posts?current=1&size=100", undefined, {
    auth: true,
  });
  return response.records.map(mapPost);
}

export async function getAdminPostDetail(id: string) {
  const response = await apiRequest<PostResponse>(`/api/admin/posts/${id}`, undefined, {
    auth: true,
  });
  return mapPost(response);
}

export async function createPost(input: PostInput) {
  const response = await apiRequest<PostResponse>(
    "/api/admin/posts",
    {
      method: "POST",
      body: JSON.stringify(toPostPayload(input)),
    },
    { auth: true },
  );
  return mapPost(response);
}

export async function updatePost(id: string, input: PostInput) {
  const response = await apiRequest<PostResponse>(
    `/api/admin/posts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(toPostPayload(input)),
    },
    { auth: true },
  );
  return mapPost(response);
}

export async function deletePost(id: string) {
  await apiRequest<void>(`/api/admin/posts/${id}`, { method: "DELETE" }, { auth: true });
}

function toPostPayload(input: PostInput) {
  return {
    slug: input.slug || slugify(input.title),
    title: input.title,
    excerpt: input.excerpt,
    categorySlug: input.categorySlug || slugify(input.categoryName),
    publishedAt: input.publishedAt,
    readingTime: input.readingTime || estimateReadingTime(input.contentMarkdown),
    status: input.status,
    contentMarkdown: input.contentMarkdown,
    featured: input.featured,
    coverAssetUrl: input.coverUrl || "",
  };
}

function mapPost(value: PostResponse): Post {
  return {
    id: String(value.id ?? value.uid),
    slug: value.slug,
    title: value.title,
    excerpt: value.excerpt,
    categoryName: value.categoryName,
    categorySlug: value.categorySlug,
    publishedAt: value.publishedAt,
    readingTime: value.readingTime,
    featured: value.featured,
    coverUrl: value.coverAssetUrl,
    contentMarkdown: value.contentMarkdown || "",
    status: value.status,
    updatedAt: value.updatedAt,
  };
}
