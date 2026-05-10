import type { PageHeaderProps } from "@/types";

export function PageHeader({ title, description, meta, action }: PageHeaderProps) {
  return (
    <section className="page-section pt-16 md:pt-24">
      <div className="surface grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-10">
        <div>
          <span className="eyebrow">CheersStudio</span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8">{description}</p>
        </div>

        <div className="flex flex-col justify-between gap-4">
          {meta ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {meta.map((item) => (
                <div key={item.label} className="surface-muted rounded-2xl px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</div>
                  <div className="mt-2 text-sm font-medium text-ink">{item.value}</div>
                </div>
              ))}
            </div>
          ) : null}
          {action ? <div className="lg:ml-auto">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
