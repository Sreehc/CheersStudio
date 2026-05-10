"use client";

import { apiRequest } from "@/lib/services/http";
import type { SiteSettings } from "@/types";

type SiteSettingsResponse = {
  siteName: string;
  heroTitle: string;
  heroDescription: string;
  locationText: string;
  contactEmail: string;
  aboutIntro: string;
  navbarSubtitle: string;
  footerDescription: string;
  heroStats: Array<{ label: string; value: string }>;
  introBlocks: string[];
  aboutDirections: string[];
  aboutFocuses: string[];
  aboutWorkflow: string[];
  aboutValues: Array<{ title: string; description: string }>;
  cta: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
  };
  socialLinks: Array<{ label: string; value: string; href: string; note?: string }>;
  contactLinks: Array<{ label: string; value: string; href: string; note?: string }>;
  contactForm: {
    title: string;
    description: string;
    placeholders: { name: string; email: string; message: string };
  };
};

export async function getSiteSettings() {
  const response = await apiRequest<SiteSettingsResponse>("/api/public/site-settings");
  return mapSiteSettings(response);
}

export async function updateSiteSettings(input: SiteSettings) {
  const response = await apiRequest<SiteSettingsResponse>(
    "/api/admin/site-settings",
    {
      method: "PUT",
      body: JSON.stringify({
        siteName: input.name,
        heroTitle: input.title,
        heroDescription: input.description,
        locationText: input.location,
        contactEmail: input.email,
        aboutIntro: input.aboutIntro,
        navbarSubtitle: input.navbarSubtitle,
        footerDescription: input.footerDescription,
        heroStats: input.heroStats,
        introBlocks: input.introBlocks,
        aboutDirections: input.aboutDirections,
        aboutFocuses: input.aboutFocuses,
        aboutWorkflow: input.aboutWorkflow,
        aboutValues: input.aboutValues,
        cta: input.cta,
        socialLinks: input.socialLinks,
        contactLinks: input.contactLinks,
        contactForm: input.contactForm,
      }),
    },
    { auth: true },
  );
  return mapSiteSettings(response);
}

export async function getAdminSiteSettings() {
  const response = await apiRequest<SiteSettingsResponse>("/api/admin/site-settings", undefined, {
    auth: true,
  });
  return mapSiteSettings(response);
}

function mapSiteSettings(value: SiteSettingsResponse): SiteSettings {
  return {
    name: value.siteName,
    title: value.heroTitle,
    description: value.heroDescription,
    location: value.locationText,
    email: value.contactEmail,
    aboutIntro: value.aboutIntro,
    navbarSubtitle: value.navbarSubtitle || "",
    footerDescription: value.footerDescription || "",
    heroStats: value.heroStats || [],
    introBlocks: value.introBlocks || [],
    aboutDirections: value.aboutDirections || [],
    aboutFocuses: value.aboutFocuses || [],
    aboutWorkflow: value.aboutWorkflow || [],
    aboutValues: value.aboutValues || [],
    cta: value.cta,
    socialLinks: value.socialLinks || [],
    contactLinks: value.contactLinks || [],
    contactForm: value.contactForm,
  };
}
