package com.cheersstudio.site.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteLinkItem {

  private String label;
  private String value;
  private String href;
  private String note;
}
