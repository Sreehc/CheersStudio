import { Suspense } from "react";

import { LoginPageClient } from "@/components/LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[rgb(var(--background))]" />}>
      <LoginPageClient />
    </Suspense>
  );
}
