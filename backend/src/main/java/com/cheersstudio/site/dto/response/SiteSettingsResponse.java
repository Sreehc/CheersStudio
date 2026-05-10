package com.cheersstudio.site.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteSettingsResponse {

  private Long id;
  private String siteName;
  private String heroTitle;
  private String heroDescription;
  private String locationText;
  private String contactEmail;
  private String aboutIntro;
  private String navbarSubtitle;
  private String footerDescription;
  private List<SiteHeroStatItem> heroStats;
  private List<String> introBlocks;
  private List<String> aboutDirections;
  private List<String> aboutFocuses;
  private List<String> aboutWorkflow;
  private List<SiteValueItem> aboutValues;
  private SiteCtaConfig cta;
  private List<SiteLinkItem> socialLinks;
  private List<SiteLinkItem> contactLinks;
  private SiteContactFormConfig contactForm;
}
