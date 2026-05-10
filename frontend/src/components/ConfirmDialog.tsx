"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "确认",
  cancelLabel = "取消",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 px-5 backdrop-blur-sm">
      <div className="surface max-w-md px-6 py-6">
        <span className="eyebrow">确认操作</span>
        <h3 className="text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-3 text-sm leading-7">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="button-secondary">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="button-primary">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
