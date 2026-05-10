package com.cheersstudio.site.controller;

import com.cheersstudio.common.api.ApiResponse;
import com.cheersstudio.site.dto.response.SiteSettingsResponse;
import com.cheersstudio.site.service.SiteSettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/site-settings")
public class PublicSiteSettingsController {

  private final SiteSettingsService siteSettingsService;

  public PublicSiteSettingsController(SiteSettingsService siteSettingsService) {
    this.siteSettingsService = siteSettingsService;
  }

  @GetMapping
  public ApiResponse<SiteSettingsResponse> getSiteSettings() {
    return ApiResponse.success(siteSettingsService.getSiteSettings());
  }
}
