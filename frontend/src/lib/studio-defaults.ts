import type { PostInput, ProjectInput } from "@/types";

export function createEmptyProjectInput(): ProjectInput {
  return {
    slug: "",
    title: "",
    summary: "",
    description: "",
    contentMarkdown: "",
    highlights: [],
    techStack: [],
    year: String(new Date().getFullYear()),
    status: "Building",
    featured: false,
    coverUrl: "",
    gallery: [],
    githubUrl: "",
    demoUrl: "",
    sort: 0,
    published: false,
  };
}

export function createEmptyPostInput(): PostInput {
  const today = new Date().toISOString().slice(0, 10);

  return {
    slug: "",
    title: "",
    excerpt: "",
    categoryName: "Engineering",
    categorySlug: "engineering",
    publishedAt: today,
    featured: false,
    coverUrl: "",
    contentMarkdown: "",
    status: "draft",
    readingTime: "1 min",
  };
}
