"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const studioLinks = [
  { label: "工作台首页", href: "/studio" },
  { label: "新建项目", href: "/studio/projects/new" },
  { label: "项目管理", href: "/studio/projects" },
  { label: "写文章", href: "/studio/posts/new" },
  { label: "文章管理", href: "/studio/posts" },
  { label: "分类管理", href: "/studio/categories" },
  { label: "站点设置", href: "/studio/settings" },
];

export function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="surface h-fit px-4 py-4">
      <div className="mb-3 px-2">
        <div className="text-xs uppercase tracking-[0.22em] text-muted">创作模式</div>
        <div className="mt-2 text-lg font-semibold text-ink">CheersStudio 工作台</div>
      </div>
      <nav className="grid gap-1">
        {studioLinks.map((link) => {
          const active = isStudioLinkActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-ink text-white"
                  : "text-muted hover:bg-accentSoft/90 hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function isStudioLinkActive(pathname: string, href: string) {
  if (href === "/studio") {
    return pathname === href;
  }

  if (href === "/studio/projects/new" || href === "/studio/posts/new") {
    return pathname === href;
  }

  if (href === "/studio/projects") {
    return (
      pathname === href ||
      (pathname.startsWith("/studio/projects/") && pathname !== "/studio/projects/new")
    );
  }

  if (href === "/studio/posts") {
    return pathname === href || (pathname.startsWith("/studio/posts/") && pathname !== "/studio/posts/new");
  }

  return pathname === href;
}
