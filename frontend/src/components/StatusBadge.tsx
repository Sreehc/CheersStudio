import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  children: string;
  tone?: "default" | "success" | "warning";
};

export function StatusBadge({ children, tone = "default" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
        tone === "default" && "border-line bg-white/85 text-muted",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "warning" && "border-amber-200 bg-amber-50 text-amber-700",
      )}
    >
      {children}
    </span>
  );
}
