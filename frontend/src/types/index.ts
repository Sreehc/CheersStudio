import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  note?: string;
};

export type Skill = {
  name: string;
  category: string;
  level?: "Core" | "Advanced" | "Working";
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort?: number;
  enabled: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  contentMarkdown: string;
  highlights: string[];
  techStack: string[];
  year: string;
  status: string;
  featured: boolean;
  coverUrl?: string;
  gallery: string[];
  githubUrl?: string;
  demoUrl?: string;
  sort?: number;
  published: boolean;
  updatedAt: string;
};

export type PostSection = {
  heading: string;
  body: string[];
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  coverUrl?: string;
  contentMarkdown: string;
  status: "draft" | "published";
  updatedAt: string;
  content?: PostSection[];
};

export type ValueItem = {
  title: string;
  description: string;
};

export type ResumeSectionItem = {
  title: string;
  subtitle: string;
  period: string;
  description: string;
  points?: string[];
};

export type FilterItem = {
  label: string;
  active?: boolean;
};

export type HeaderMeta = {
  label: string;
  value: string;
};

export type PageHeaderProps = {
  title: string;
  description: string;
  meta?: HeaderMeta[];
  action?: ReactNode;
};

export type Credentials = {
  username: string;
  password: string;
};

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthSession = {
  token: string;
  adminProfile: AdminProfile;
};

export type CtaConfig = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
};

export type ContactFormConfig = {
  title: string;
  description: string;
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
};

export type SiteSettings = {
  name: string;
  title: string;
  description: string;
  location: string;
  email: string;
  navbarSubtitle: string;
  footerDescription: string;
  heroStats: HeaderMeta[];
  introBlocks: string[];
  aboutDirections: string[];
  aboutFocuses: string[];
  aboutWorkflow: string[];
  aboutValues: ValueItem[];
  cta: CtaConfig;
  socialLinks: ContactLink[];
  contactLinks: ContactLink[];
  contactForm: ContactFormConfig;
  aboutIntro: string;
};

export type UploadAsset = {
  id: string;
  uid?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  status: "uploading" | "ready";
};

export type StudioStore = {
  projects: Project[];
  posts: Post[];
  categories: Category[];
  siteSettings: SiteSettings;
  uploads: UploadAsset[];
};

export type ProjectInput = Omit<Project, "id" | "updatedAt">;

export type PostInput = Omit<Post, "id" | "updatedAt" | "readingTime"> & {
  readingTime?: string;
};
