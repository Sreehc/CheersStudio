import Link from "next/link";
import type { ReactNode } from "react";

type Row = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  status: ReactNode;
  href: string;
};

type ContentTableProps = {
  eyebrow: string;
  title: string;
  description: string;
  rows: Row[];
  emptyTitle: string;
  emptyDescription: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  onDelete: (id: string) => void;
};

export function ContentTable({
  eyebrow,
  title,
  description,
  rows,
  emptyTitle,
  emptyDescription,
  primaryActionLabel,
  primaryActionHref,
  onDelete,
}: ContentTableProps) {
  return (
    <section className="surface px-6 py-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-7">{description}</p>
        </div>
        <Link href={primaryActionHref} className="button-primary">
          {primaryActionLabel}
        </Link>
      </div>

      {rows.length > 0 ? (
        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <article
              key={row.id}
              className="surface-muted flex flex-col gap-4 rounded-[28px] px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-ink">{row.title}</h3>
                <p className="mt-2 text-sm leading-7">{row.subtitle}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{row.meta}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {row.status}
                <Link href={row.href} className="button-secondary">
                  编辑
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(row.id)}
                  className="rounded-full border border-line px-4 py-3 text-sm font-medium text-muted transition hover:border-rose-300 hover:text-rose-600"
                >
                  删除
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="surface-muted mt-6 rounded-[28px] px-6 py-10 text-center">
          <h3 className="text-xl font-semibold text-ink">{emptyTitle}</h3>
          <p className="mt-3 text-sm leading-7">{emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
