"use client";

import { apiRequest } from "@/lib/services/http";
import type { Category } from "@/types";

type CategoryResponse = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  enabled: boolean;
};

type CategoryInput = {
  name: string;
  slug: string;
  sort?: number;
  enabled: boolean;
};

export async function listEnabledCategories() {
  const response = await apiRequest<CategoryResponse[]>("/api/public/post-categories");
  return response.map(mapCategory);
}

export async function listAdminCategories() {
  const response = await apiRequest<CategoryResponse[]>("/api/admin/post-categories", undefined, {
    auth: true,
  });
  return response.map(mapCategory);
}

export async function createCategory(input: CategoryInput) {
  const response = await apiRequest<CategoryResponse>(
    "/api/admin/post-categories",
    {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        slug: input.slug,
        sortOrder: input.sort ?? 0,
        enabled: input.enabled,
      }),
    },
    { auth: true },
  );

  return mapCategory(response);
}

export async function updateCategory(id: string, input: CategoryInput) {
  const response = await apiRequest<CategoryResponse>(
    `/api/admin/post-categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: input.name,
        slug: input.slug,
        sortOrder: input.sort ?? 0,
        enabled: input.enabled,
      }),
    },
    { auth: true },
  );

  return mapCategory(response);
}

export async function deleteCategory(id: string) {
  await apiRequest<void>(
    `/api/admin/post-categories/${id}`,
    { method: "DELETE" },
    { auth: true },
  );
}

function mapCategory(value: CategoryResponse): Category {
  return {
    id: String(value.id),
    name: value.name,
    slug: value.slug,
    sort: value.sortOrder,
    enabled: value.enabled,
  };
}
