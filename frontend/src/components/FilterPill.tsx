import { cn } from "@/lib/utils";

type FilterPillProps = {
  label: string;
  active?: boolean;
};

export function FilterPill({ label, active = false }: FilterPillProps) {
  return (
    <span
      className={cn(
        "inline-flex select-none rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.14em]",
        active
          ? "border-accent/28 bg-accentSoft/70 text-accent"
          : "border-line/75 bg-white/45 text-muted/90",
      )}
    >
      {label}
    </span>
  );
}
