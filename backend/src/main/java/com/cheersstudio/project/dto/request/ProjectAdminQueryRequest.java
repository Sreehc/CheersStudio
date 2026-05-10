package com.cheersstudio.project.dto.request;

import com.cheersstudio.common.api.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProjectAdminQueryRequest extends PageRequest {

  private String keyword;
  private Boolean published;
  private Boolean featured;
  private String statusLabel;
}
