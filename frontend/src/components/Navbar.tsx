"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth, useStudioData } from "@/components/providers/RootProviders";
import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { store } = useStudioData();
  const visibleNavItems = isAuthenticated
    ? [...navItems, { label: "Studio", href: "/studio" }]
    : navItems;

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-[rgba(247,248,250,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-white/90 font-mono text-sm font-medium text-accent shadow-soft">
            CS
          </span>
          <div>
            <div className="text-sm font-semibold tracking-[0.16em] text-ink">
              {store.siteSettings.name}
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted">
              {store.siteSettings.navbarSubtitle}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-line/80 bg-white/80 p-1 lg:flex">
          {visibleNavItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition duration-300",
                  active ? "bg-ink text-white" : "text-muted hover:bg-accentSoft/90 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          {isAuthenticated ? (
            <Link href="/studio" className="button-primary">
              Open Studio
            </Link>
          ) : (
            <Link href="/contact" className="button-primary">
              Get in touch
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white/85 text-sm text-ink transition hover:border-accent/50 hover:text-accent lg:hidden"
          aria-label="切换导航 Toggle navigation"
          aria-expanded={isOpen}
        >
          <span className="font-mono">{isOpen ? "×" : "≡"}</span>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-line/60 bg-white/92 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-3 sm:px-6 lg:px-8">
            {visibleNavItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-2xl border px-4 py-2.5 text-sm font-medium transition duration-300",
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-muted hover:border-accent/50 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={isAuthenticated ? "/studio" : "/contact"}
              onClick={() => setIsOpen(false)}
              className="button-primary mt-1"
            >
              {isAuthenticated ? "Open Studio" : "Get in touch"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
