type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <div className="surface flex min-h-52 flex-col items-center justify-center px-6 py-8 text-center lg:px-8">
      <span className="eyebrow">{eyebrow}</span>
      <h3 className="max-w-2xl text-2xl font-semibold text-ink md:text-3xl">{title}</h3>
      <p className="mt-4 max-w-2xl text-sm leading-8 md:text-base">{description}</p>
    </div>
  );
}
