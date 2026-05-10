import Image from "next/image";

type MediaPreviewGridProps = {
  items: Array<{ id: string; url: string; name: string }>;
  onRemove: (id: string) => void;
};

export function MediaPreviewGrid({ items, onRemove }: MediaPreviewGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="surface-muted overflow-hidden rounded-[28px]">
          <div className="relative h-40 w-full bg-slate-100">
            <Image src={item.url} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{item.name}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted transition hover:border-rose-300 hover:text-rose-600"
            >
              移除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
