"use client";

import { useId, useState } from "react";

type UploadDropzoneProps = {
  label: string;
  description: string;
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList) => Promise<void> | void;
};

export function UploadDropzone({
  label,
  description,
  accept,
  multiple = false,
  onFilesSelected,
}: UploadDropzoneProps) {
  const inputId = useId();
  const [isBusy, setIsBusy] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setIsBusy(true);
    await onFilesSelected(files);
    setIsBusy(false);
    event.target.value = "";
  }

  return (
    <label
      htmlFor={inputId}
      className="surface-muted flex cursor-pointer flex-col gap-2 rounded-[28px] border-dashed px-5 py-6 transition duration-300 hover:border-accent/50"
    >
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span className="text-sm leading-7 text-muted">{description}</span>
      <span className="mt-3 inline-flex w-fit rounded-full border border-line bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink">
        {isBusy ? "上传中..." : "选择文件"}
      </span>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
      />
    </label>
  );
}
