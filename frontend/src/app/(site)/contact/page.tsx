"use client";

import Link from "next/link";

import { ContactForm } from "@/components/ContactForm";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { useStudioData } from "@/components/providers/RootProviders";

export default function ContactPage() {
  const { store } = useStudioData();

  return (
    <PageContainer>
      <PageHeader
        title="Contact 联系"
        description="欢迎交流项目合作、技术实践、部署经验，或者任何值得认真构建的想法。这个页面目前是纯前端静态表单，后续可以直接接入邮件服务或 API。"
        meta={[
          { label: "Best For", value: "Project discussion / collaboration" },
          { label: "Response", value: "Email first" },
        ]}
      />

      <section className="grid gap-6 pb-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="order-2 grid gap-4 lg:order-1">
          {store.siteSettings.contactLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="surface flex flex-col gap-2 px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</span>
              <span className="text-lg font-semibold text-ink">{item.value}</span>
              {item.note ? <p className="text-sm leading-7">{item.note}</p> : null}
            </Link>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <ContactForm config={store.siteSettings.contactForm} />
        </div>
      </section>
    </PageContainer>
  );
}
