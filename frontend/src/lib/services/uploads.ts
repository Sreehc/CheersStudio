"use client";

import { apiRequest } from "@/lib/services/http";
import type { UploadAsset } from "@/types";

type AssetResponse = {
  id: number;
  uid: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  moduleType: string;
  status: "uploading" | "ready";
};

export async function uploadAsset(file: File, moduleType = "other") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("moduleType", moduleType);

  const response = await apiRequest<AssetResponse>(
    "/api/admin/assets",
    {
      method: "POST",
      body: formData,
    },
    { auth: true },
  );

  return {
    id: String(response.id),
    uid: response.uid,
    name: response.originalName,
    url: response.fileUrl,
    type: response.mimeType,
    size: response.fileSize,
    status: response.status,
  } satisfies UploadAsset;
}
