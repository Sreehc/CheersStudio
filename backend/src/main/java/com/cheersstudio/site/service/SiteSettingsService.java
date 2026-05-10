package com.cheersstudio.site.service;

import com.cheersstudio.site.dto.request.SiteSettingsUpdateRequest;
import com.cheersstudio.site.dto.response.SiteSettingsResponse;

public interface SiteSettingsService {

  SiteSettingsResponse getSiteSettings();

  SiteSettingsResponse getAdminSiteSettings();

  SiteSettingsResponse updateSiteSettings(SiteSettingsUpdateRequest request);
}
