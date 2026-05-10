import Link from "next/link";

import type { Project } from "@/types";

import { SkillTag } from "@/components/SkillTag";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  compact?: boolean;
};

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "surface group flex h-full flex-col px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50",
        compact ? "gap-4" : "gap-5",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="tag-chip">{project.status}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-muted">{project.year}</span>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-ink">{project.title}</h3>
        <p className="mt-3 text-sm leading-7">{project.summary}</p>
      </div>

      {!compact ? (
        <p className="text-sm leading-7 text-muted">{project.description}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {project.techStack.map((item) => (
          <SkillTag key={item} label={item} tone="accent" />
        ))}
      </div>

      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Highlights</div>
        <ul className="space-y-2 text-sm leading-7 text-muted">
          {project.highlights.slice(0, compact ? 2 : 3).map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-3">
        <Link href={`/projects/${project.slug}`} className="button-secondary">
          View Details
        </Link>
      </div>
    </article>
  );
}
