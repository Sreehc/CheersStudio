package com.cheersstudio.post.dto.request;

import com.cheersstudio.common.api.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PostAdminQueryRequest extends PageRequest {

  private String keyword;
  private String status;
  private String categorySlug;
  private Boolean featured;
}
