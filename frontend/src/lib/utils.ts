export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, "")
    .replace(/-+/g, "-");
}

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function estimateReadingTime(markdown: string) {
  const plainText = markdown
    .replace(/[#>*`~_-]/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();
  const words = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));

  return `${minutes} min`;
}

export function createProjectMarkdownTemplate(input: {
  title?: string;
  summary: string;
  description: string;
  highlights: string[];
}) {
  const title = input.title?.trim() || "项目介绍";
  const summary = input.summary.trim() || "在这里补充项目的一句话概述。";
  const description = input.description.trim() || "在这里补充项目背景、目标和结果。";
  const highlights =
    input.highlights.length > 0
      ? input.highlights.map((item) => `- ${item}`).join("\n")
      : "- 在这里补充这个项目最值得被看到的亮点";

  return `# ${title}

## 项目概述
${summary}

## 背景与目标
${description}

## 关键亮点
${highlights}
`;
}

export function normalizeMultilineInput(input: string) {
  return input
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function markdownToHtml(markdown: string) {
  const blocks = markdown.trim().split(/\n{2,}/).filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block.split("\n");

      if (lines.every((line) => line.trim().startsWith("- "))) {
        const items = lines
          .map((line) => line.replace(/^- /, "").trim())
          .map((line) => `<li>${escapeHtml(inlineMarkdown(line))}</li>`)
          .join("");

        return `<ul>${items}</ul>`;
      }

      const headingMatch = lines[0].match(/^(#{1,3})\s+(.*)$/);

      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = escapeHtml(inlineMarkdown(headingMatch[2]));
        return `<h${level}>${text}</h${level}>`;
      }

      return `<p>${lines.map((line) => escapeHtml(inlineMarkdown(line))).join("<br/>")}</p>`;
    })
    .join("");
}

function inlineMarkdown(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&lt;(\/?(?:strong|code))&gt;/g, "<$1>");
}
