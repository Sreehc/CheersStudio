package com.cheersstudio.category.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCategoryResponse {

  private Long id;
  private String name;
  private String slug;
  private Integer sortOrder;
  private Boolean enabled;
}
