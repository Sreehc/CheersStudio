"use client";

import { useState } from "react";

type AuthFormProps = {
  onSubmit: (values: { username: string; password: string }) => Promise<void>;
};

export function AuthForm({ onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState("cheers");
  const [password, setPassword] = useState("cheersstudio");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({ username, password });
    } catch {
      setError("账号或密码不正确，请确认后重新输入。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface flex flex-col gap-5 px-6 py-6 lg:px-8">
      <div>
        <span className="eyebrow">管理员登录</span>
        <h1 className="text-3xl font-semibold text-ink">登录工作台</h1>
        <p className="mt-3 text-sm leading-7">
          这是单管理员真实登录入口，当前已经接入 Spring Boot 鉴权接口。
        </p>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-ink">用户名</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-ink">密码</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
        />
      </label>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-line bg-slate-50 px-4 py-4 text-sm leading-7 text-muted">
        管理员账号：<span className="font-mono text-ink">cheers</span> /{" "}
        <span className="font-mono text-ink">cheersstudio</span>
      </div>

      <button type="submit" className="button-primary" disabled={isSubmitting}>
        {isSubmitting ? "登录中..." : "进入工作台"}
      </button>
    </form>
  );
}
