package com.cheersstudio.category.dto.request;

import lombok.Data;

@Data
public class PostCategoryUpdateRequest {

  private String name;
  private String slug;
  private Integer sortOrder;
  private Boolean enabled;
}
