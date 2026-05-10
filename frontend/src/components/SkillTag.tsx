import { cn } from "@/lib/utils";

type SkillTagProps = {
  label: string;
  tone?: "default" | "accent";
};

export function SkillTag({ label, tone = "default" }: SkillTagProps) {
  return (
    <span
      className={cn(
        "tag-chip",
        tone === "accent" &&
          "border-accent/30 bg-accentSoft/90 text-accent hover:border-accent/50",
      )}
    >
      {label}
    </span>
  );
}
