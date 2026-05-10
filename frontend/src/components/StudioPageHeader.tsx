import type { ReactNode } from "react";

type StudioPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function StudioPageHeader({ title, description, actions }: StudioPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="eyebrow">工作台</span>
        <h1 className="text-4xl font-semibold text-ink md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-8">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
