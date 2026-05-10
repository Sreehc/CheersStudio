"use client";

import { useRouter } from "next/navigation";

import { ProjectEditorForm } from "@/components/ProjectEditorForm";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import { createEmptyProjectInput } from "@/lib/studio-defaults";

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject, uploadAsset } = useStudioData();

  return (
    <div>
      <StudioPageHeader
        title="新建项目"
        description="新建项目内容，统一维护标题、摘要、详细说明、媒体资源与发布信息，并同步预览公开页展示效果。"
      />
      <ProjectEditorForm
        initialValue={createEmptyProjectInput()}
        submitLabel="发布项目"
        draftLabel="保存草稿"
        onUpload={async (file, moduleType) => {
          const asset = await uploadAsset(file, moduleType);
          return { id: asset.id, url: asset.url, name: asset.name };
        }}
        onSubmit={async (value) => {
          await createProject({ ...value, published: true });
          router.push("/studio/projects");
        }}
        onSaveDraft={async (value) => {
          await createProject({ ...value, published: false, featured: false });
          router.push("/studio/projects");
        }}
      />
    </div>
  );
}
