import type { ReactNode } from "react";

type FormSectionCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSectionCard({
  eyebrow,
  title,
  description,
  children,
}: FormSectionCardProps) {
  return (
    <section className="surface px-6 py-6 lg:px-8">
      <div className="mb-5">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-7">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
