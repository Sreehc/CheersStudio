import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  const isCentered = align === "center";

  return (
    <div className={cn("mb-8", isCentered && "mx-auto max-w-3xl text-center")}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-base leading-8",
            isCentered ? "mx-auto max-w-2xl" : "max-w-4xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
