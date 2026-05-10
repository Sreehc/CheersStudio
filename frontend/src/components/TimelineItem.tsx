import type { ResumeSectionItem } from "@/types";

type TimelineItemProps = {
  item: ResumeSectionItem;
};

export function TimelineItem({ item }: TimelineItemProps) {
  return (
    <article className="surface-muted relative rounded-[28px] px-5 py-5">
      <div className="absolute left-0 top-8 hidden h-10 w-px bg-line lg:block" />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{item.subtitle}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{item.title}</h3>
        </div>
        <span className="tag-chip">{item.period}</span>
      </div>
      <p className="mt-4 text-sm leading-7">{item.description}</p>
      {item.points ? (
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          {item.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
