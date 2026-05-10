package com.cheersstudio.site.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteCtaConfig {

  private String title;
  private String description;
  private String primaryLabel;
  private String primaryHref;
}
