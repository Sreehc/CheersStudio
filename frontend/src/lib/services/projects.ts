"use client";

import { featuredProjects, projects } from "@/data/projects";
import { apiRequest } from "@/lib/services/http";
import { slugify } from "@/lib/utils";
import type { Project, ProjectInput } from "@/types";

type ProjectResponse = {
  id?: number;
  uid: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  contentMarkdown?: string;
  year: string;
  statusLabel: string;
  featured: boolean;
  published: boolean;
  coverAssetUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  techStack: string[];
  highlights: string[];
  gallery?: string[];
  sortOrder?: number;
  updatedAt: string;
};

type ProjectPageResponse = {
  records: ProjectResponse[];
};

export async function getPublicProjects() {
  try {
    const response = await apiRequest<ProjectResponse[]>("/api/public/projects");
    return response.map(mapProject);
  } catch {
    return projects.filter((project) => project.published);
  }
}

export async function getFeaturedProjects() {
  try {
    const response = await apiRequest<ProjectResponse[]>("/api/public/projects/featured");
    return response.map(mapProject);
  } catch {
    return featuredProjects.filter((project) => project.published);
  }
}

export async function getProjectDetail(slug: string) {
  try {
    const response = await apiRequest<ProjectResponse>(`/api/public/projects/${slug}`);
    return mapProject(response);
  } catch {
    return projects.find((project) => project.slug === slug && project.published) ?? null;
  }
}

export async function listAdminProjects() {
  const response = await apiRequest<ProjectPageResponse>("/api/admin/projects?current=1&size=100", undefined, {
    auth: true,
  });
  return response.records.map(mapProject);
}

export async function getAdminProjectDetail(id: string) {
  const response = await apiRequest<ProjectResponse>(`/api/admin/projects/${id}`, undefined, {
    auth: true,
  });
  return mapProject(response);
}

export async function createProject(input: ProjectInput) {
  const response = await apiRequest<ProjectResponse>(
    "/api/admin/projects",
    {
      method: "POST",
      body: JSON.stringify(toProjectPayload(input)),
    },
    { auth: true },
  );
  return mapProject(response);
}

export async function updateProject(id: string, input: ProjectInput) {
  const response = await apiRequest<ProjectResponse>(
    `/api/admin/projects/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(toProjectPayload(input)),
    },
    { auth: true },
  );
  return mapProject(response);
}

export async function deleteProject(id: string) {
  await apiRequest<void>(`/api/admin/projects/${id}`, { method: "DELETE" }, { auth: true });
}

function toProjectPayload(input: ProjectInput) {
  return {
    slug: input.slug || slugify(input.title),
    title: input.title,
    summary: input.summary,
    description: input.description,
    contentMarkdown: input.contentMarkdown,
    year: input.year,
    statusLabel: input.status,
    featured: input.featured,
    published: input.published,
    sortOrder: input.sort ?? 0,
    coverAssetUrl: input.coverUrl || "",
    githubUrl: input.githubUrl || "",
    demoUrl: input.demoUrl || "",
    techStack: input.techStack,
    highlights: input.highlights,
    gallery: input.gallery,
  };
}

function mapProject(value: ProjectResponse): Project {
  return {
    id: String(value.id ?? value.uid),
    slug: value.slug,
    title: value.title,
    summary: value.summary,
    description: value.description,
    contentMarkdown: value.contentMarkdown || "",
    highlights: value.highlights || [],
    techStack: value.techStack || [],
    year: value.year,
    status: value.statusLabel,
    featured: value.featured,
    coverUrl: value.coverAssetUrl,
    gallery: value.gallery || [],
    githubUrl: value.githubUrl,
    demoUrl: value.demoUrl,
    sort: value.sortOrder,
    published: value.published,
    updatedAt: value.updatedAt,
  };
}
