import type { Metadata } from "next";

import { RootProviders } from "@/components/providers/RootProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "CheersStudio",
  description: "A portfolio, blog, and growth space for Cheers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
