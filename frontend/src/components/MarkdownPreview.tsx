import { markdownToHtml } from "@/lib/utils";

type MarkdownPreviewProps = {
  value: string;
};

export function MarkdownPreview({ value }: MarkdownPreviewProps) {
  const html = value.trim()
    ? markdownToHtml(value)
    : "<p>开始输入内容后，这里会显示渲染预览。</p>";

  return (
    <div
      className="surface min-h-[420px] px-6 py-6 lg:px-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mb-4 [&_p]:text-sm [&_p]:leading-8 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-8 [&_li]:list-disc [&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-[13px]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
