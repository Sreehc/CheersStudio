package com.cheersstudio.site.assembler;

import com.cheersstudio.site.dto.response.SiteContactFormConfig;
import com.cheersstudio.site.dto.response.SiteCtaConfig;
import com.cheersstudio.site.dto.response.SiteHeroStatItem;
import com.cheersstudio.site.dto.response.SiteLinkItem;
import com.cheersstudio.site.dto.response.SiteSettingsResponse;
import com.cheersstudio.site.dto.response.SiteValueItem;
import com.cheersstudio.site.entity.SiteSettingsEntity;
import java.util.List;

public final class SiteSettingsAssembler {

  private SiteSettingsAssembler() {}

  public static SiteSettingsResponse empty() {
    return SiteSettingsResponse.builder().build();
  }

  public static SiteSettingsResponse toResponse(
      SiteSettingsEntity entity,
      List<SiteHeroStatItem> heroStats,
      List<String> introBlocks,
      List<String> aboutDirections,
      List<String> aboutFocuses,
      List<String> aboutWorkflow,
      List<SiteValueItem> aboutValues,
      SiteCtaConfig cta,
      List<SiteLinkItem> socialLinks,
      List<SiteLinkItem> contactLinks,
      SiteContactFormConfig contactForm) {
    return SiteSettingsResponse.builder()
        .id(entity.getId())
        .siteName(entity.getSiteName())
        .heroTitle(entity.getHeroTitle())
        .heroDescription(entity.getHeroDescription())
        .locationText(entity.getLocationText())
        .contactEmail(entity.getContactEmail())
        .aboutIntro(entity.getAboutIntro())
        .navbarSubtitle(entity.getNavbarSubtitle())
        .footerDescription(entity.getFooterDescription())
        .heroStats(heroStats)
        .introBlocks(introBlocks)
        .aboutDirections(aboutDirections)
        .aboutFocuses(aboutFocuses)
        .aboutWorkflow(aboutWorkflow)
        .aboutValues(aboutValues)
        .cta(cta)
        .socialLinks(socialLinks)
        .contactLinks(contactLinks)
        .contactForm(contactForm)
        .build();
  }
}
