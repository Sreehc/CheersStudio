package com.cheersstudio.category.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostCategoryCreateRequest {

  @NotBlank private String name;
  @NotBlank private String slug;
  private Integer sortOrder;
  private Boolean enabled;
}
