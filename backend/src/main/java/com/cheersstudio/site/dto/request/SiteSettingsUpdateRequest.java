package com.cheersstudio.site.dto.request;

import com.cheersstudio.site.dto.response.SiteContactFormConfig;
import com.cheersstudio.site.dto.response.SiteCtaConfig;
import com.cheersstudio.site.dto.response.SiteHeroStatItem;
import com.cheersstudio.site.dto.response.SiteLinkItem;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;

@Data
public class SiteSettingsUpdateRequest {

  @NotBlank private String siteName;
  @NotBlank private String heroTitle;
  @NotBlank private String heroDescription;
  @NotBlank private String locationText;
  @NotBlank private String contactEmail;
  @NotBlank private String aboutIntro;
  @NotBlank private String navbarSubtitle;
  @NotBlank private String footerDescription;
  private List<SiteHeroStatItem> heroStats;
  private List<String> introBlocks;
  private List<String> aboutDirections;
  private List<String> aboutFocuses;
  private List<String> aboutWorkflow;
  private List<com.cheersstudio.site.dto.response.SiteValueItem> aboutValues;
  private SiteCtaConfig cta;
  private List<SiteLinkItem> socialLinks;
  private List<SiteLinkItem> contactLinks;
  private SiteContactFormConfig contactForm;
}
