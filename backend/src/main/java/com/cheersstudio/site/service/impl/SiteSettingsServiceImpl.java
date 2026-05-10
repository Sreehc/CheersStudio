package com.cheersstudio.site.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.cheersstudio.common.exception.NotFoundException;
import com.cheersstudio.common.util.JsonUtils;
import com.cheersstudio.site.assembler.SiteSettingsAssembler;
import com.cheersstudio.site.dto.request.SiteSettingsUpdateRequest;
import com.cheersstudio.site.dto.response.SiteContactFormConfig;
import com.cheersstudio.site.dto.response.SiteCtaConfig;
import com.cheersstudio.site.dto.response.SiteHeroStatItem;
import com.cheersstudio.site.dto.response.SiteLinkItem;
import com.cheersstudio.site.dto.response.SiteSettingsResponse;
import com.cheersstudio.site.dto.response.SiteValueItem;
import com.cheersstudio.site.entity.SiteSettingsEntity;
import com.cheersstudio.site.mapper.SiteSettingsMapper;
import com.cheersstudio.site.service.SiteSettingsService;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteSettingsServiceImpl implements SiteSettingsService {

  private static final long DEFAULT_SITE_SETTINGS_ID = 1L;

  private final SiteSettingsMapper siteSettingsMapper;
  private final JsonUtils jsonUtils;

  public SiteSettingsServiceImpl(SiteSettingsMapper siteSettingsMapper, JsonUtils jsonUtils) {
    this.siteSettingsMapper = siteSettingsMapper;
    this.jsonUtils = jsonUtils;
  }

  @Override
  public SiteSettingsResponse getSiteSettings() {
    return toResponse(loadRequiredEntity());
  }

  @Override
  public SiteSettingsResponse getAdminSiteSettings() {
    return toResponse(loadRequiredEntity());
  }

  @Override
  @Transactional
  public SiteSettingsResponse updateSiteSettings(SiteSettingsUpdateRequest request) {
    SiteSettingsEntity entity = loadRequiredEntity();
    entity.setSiteName(request.getSiteName());
    entity.setHeroTitle(request.getHeroTitle());
    entity.setHeroDescription(request.getHeroDescription());
    entity.setLocationText(request.getLocationText());
    entity.setContactEmail(request.getContactEmail());
    entity.setAboutIntro(request.getAboutIntro());
    entity.setNavbarSubtitle(request.getNavbarSubtitle());
    entity.setFooterDescription(request.getFooterDescription());
    entity.setHeroStatsJson(jsonUtils.toJson(safeList(request.getHeroStats())));
    entity.setIntroBlocksJson(jsonUtils.toJson(safeList(request.getIntroBlocks())));
    entity.setAboutDirectionsJson(jsonUtils.toJson(safeList(request.getAboutDirections())));
    entity.setAboutFocusesJson(jsonUtils.toJson(safeList(request.getAboutFocuses())));
    entity.setAboutWorkflowJson(jsonUtils.toJson(safeList(request.getAboutWorkflow())));
    entity.setAboutValuesJson(jsonUtils.toJson(safeList(request.getAboutValues())));
    entity.setCtaJson(jsonUtils.toJson(request.getCta()));
    entity.setSocialLinksJson(jsonUtils.toJson(safeList(request.getSocialLinks())));
    entity.setContactLinksJson(jsonUtils.toJson(safeList(request.getContactLinks())));
    entity.setContactFormJson(jsonUtils.toJson(request.getContactForm()));
    siteSettingsMapper.updateById(entity);
    return toResponse(entity);
  }

  private SiteSettingsEntity loadRequiredEntity() {
    SiteSettingsEntity entity = siteSettingsMapper.selectById(DEFAULT_SITE_SETTINGS_ID);
    if (entity == null) {
      throw new NotFoundException("站点配置不存在");
    }
    return entity;
  }

  private SiteSettingsResponse toResponse(SiteSettingsEntity entity) {
    return SiteSettingsAssembler.toResponse(
        entity,
        safeList(
            jsonUtils.fromJson(
                entity.getHeroStatsJson(), new TypeReference<List<SiteHeroStatItem>>() {})),
        safeList(jsonUtils.fromJson(entity.getIntroBlocksJson(), new TypeReference<List<String>>() {})),
        safeList(
            jsonUtils.fromJson(
                entity.getAboutDirectionsJson(), new TypeReference<List<String>>() {})),
        safeList(
            jsonUtils.fromJson(
                entity.getAboutFocusesJson(), new TypeReference<List<String>>() {})),
        safeList(
            jsonUtils.fromJson(
                entity.getAboutWorkflowJson(), new TypeReference<List<String>>() {})),
        safeList(
            jsonUtils.fromJson(
                entity.getAboutValuesJson(), new TypeReference<List<SiteValueItem>>() {})),
        jsonUtils.fromJson(entity.getCtaJson(), new TypeReference<SiteCtaConfig>() {}),
        safeList(
            jsonUtils.fromJson(
                entity.getSocialLinksJson(), new TypeReference<List<SiteLinkItem>>() {})),
        safeList(
            jsonUtils.fromJson(
                entity.getContactLinksJson(), new TypeReference<List<SiteLinkItem>>() {})),
        jsonUtils.fromJson(
            entity.getContactFormJson(), new TypeReference<SiteContactFormConfig>() {}));
  }

  private <T> List<T> safeList(List<T> value) {
    return value == null ? Collections.emptyList() : value;
  }
}
