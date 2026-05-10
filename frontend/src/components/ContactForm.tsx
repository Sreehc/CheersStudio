import { useState } from "react";

import type { ContactFormConfig } from "@/types";

export function ContactForm({ config }: { config: ContactFormConfig }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<typeof form> = {};

    if (!form.name.trim()) {
      nextErrors.name = "请输入你的名字。";
    }

    if (!form.email.trim()) {
      nextErrors.email = "请输入邮箱地址。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "请输入有效的邮箱地址。";
    }

    if (!form.message.trim()) {
      nextErrors.message = "请简单介绍一下你的需求或问题。";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const subject = encodeURIComponent(`CheersStudio contact from ${form.name.trim()}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name.trim()}`,
        `Email: ${form.email.trim()}`,
        "",
        form.message.trim(),
      ].join("\n"),
    );

    window.location.href = `mailto:hello@cheersstudio.dev?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="surface flex h-full flex-col gap-5 px-6 py-6 lg:px-8">
      <div>
        <span className="eyebrow">Contact Form</span>
        <h2 className="text-2xl font-semibold text-ink">{config.title}</h2>
        <p className="mt-3 text-sm leading-7">{config.description}</p>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-ink">Name</span>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder={config.placeholders.name}
          className="input-field"
        />
        {errors.name ? <p className="text-sm text-rose-600">{errors.name}</p> : null}
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-ink">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setField("email", event.target.value)}
          placeholder={config.placeholders.email}
          className="input-field"
        />
        {errors.email ? <p className="text-sm text-rose-600">{errors.email}</p> : null}
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-ink">Message</span>
        <textarea
          rows={6}
          value={form.message}
          onChange={(event) => setField("message", event.target.value)}
          placeholder={config.placeholders.message}
          className="w-full rounded-3xl border border-line bg-white/90 px-4 py-3 text-sm leading-7 text-ink outline-none transition duration-300 placeholder:text-muted focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
        />
        {errors.message ? <p className="text-sm text-rose-600">{errors.message}</p> : null}
      </label>

      <button type="submit" className="button-primary mt-auto">
        Send Message
      </button>
      <p className="text-sm leading-7 text-muted">
        将调用本地邮件客户端创建邮件，不会在站内直接提交或发送。
      </p>
    </form>
  );
}
