"use client";

import { aboutContent } from "@/data/about";
import { contactFormContent, contactLinks } from "@/data/contact";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { siteConfig, socialLinks } from "@/data/site";
import type { SiteSettings, StudioStore } from "@/types";

export const defaultSiteSettings: SiteSettings = {
  name: siteConfig.name,
  title: siteConfig.title,
  description: siteConfig.description,
  location: siteConfig.location,
  email: siteConfig.email,
  navbarSubtitle: siteConfig.navbarSubtitle,
  footerDescription: siteConfig.footerDescription,
  heroStats: siteConfig.heroStats,
  introBlocks: siteConfig.introBlocks,
  aboutDirections: aboutContent.directions,
  aboutFocuses: aboutContent.currentFocus,
  aboutWorkflow: aboutContent.workflow,
  aboutValues: aboutContent.values,
  cta: siteConfig.cta,
  socialLinks,
  contactLinks,
  contactForm: contactFormContent,
  aboutIntro: aboutContent.intro,
};

export const defaultStudioStore: StudioStore = {
  projects,
  posts,
  categories: [],
  siteSettings: defaultSiteSettings,
  uploads: [],
};
