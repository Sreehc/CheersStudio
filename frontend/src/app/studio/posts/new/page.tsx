"use client";

import { useRouter } from "next/navigation";

import { PostEditor } from "@/components/PostEditor";
import { StudioPageHeader } from "@/components/StudioPageHeader";
import { useStudioData } from "@/components/providers/RootProviders";
import { createEmptyPostInput } from "@/lib/studio-defaults";

export default function NewPostPage() {
  const router = useRouter();
  const { createPost, uploadAsset, categories } = useStudioData();

  return (
    <div>
      <StudioPageHeader
        title="写文章"
        description="正文编辑器优先，其余字段服务于发布。目标是接近成熟创作者平台的写作体验，而不是普通后台表单。"
      />
      <PostEditor
        initialValue={createEmptyPostInput()}
        categories={categories}
        submitLabel="发布文章"
        draftLabel="保存草稿"
        onUpload={async (file, moduleType) => {
          const asset = await uploadAsset(file, moduleType);
          return { id: asset.id, url: asset.url, name: asset.name };
        }}
        onSubmit={async (value) => {
          await createPost({ ...value, status: "published" });
          router.push("/studio/posts");
        }}
        onSaveDraft={async (value) => {
          await createPost({ ...value, status: "draft", featured: false });
          router.push("/studio/posts");
        }}
      />
    </div>
  );
}
