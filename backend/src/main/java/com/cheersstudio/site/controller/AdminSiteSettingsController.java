package com.cheersstudio.site.controller;

import com.cheersstudio.common.api.ApiResponse;
import com.cheersstudio.site.dto.request.SiteSettingsUpdateRequest;
import com.cheersstudio.site.dto.response.SiteSettingsResponse;
import com.cheersstudio.site.service.SiteSettingsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/site-settings")
public class AdminSiteSettingsController {

  private final SiteSettingsService siteSettingsService;

  public AdminSiteSettingsController(SiteSettingsService siteSettingsService) {
    this.siteSettingsService = siteSettingsService;
  }

  @GetMapping
  public ApiResponse<SiteSettingsResponse> getAdminSiteSettings() {
    return ApiResponse.success(siteSettingsService.getAdminSiteSettings());
  }

  @PutMapping
  public ApiResponse<SiteSettingsResponse> updateSiteSettings(
      @Valid @RequestBody SiteSettingsUpdateRequest request) {
    return ApiResponse.success(siteSettingsService.updateSiteSettings(request));
  }
}
