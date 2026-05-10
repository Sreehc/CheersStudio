package com.cheersstudio.category.assembler;

import com.cheersstudio.category.dto.response.PostCategoryResponse;
import com.cheersstudio.category.entity.PostCategoryEntity;

public final class PostCategoryAssembler {

  private PostCategoryAssembler() {}

  public static PostCategoryResponse empty() {
    return PostCategoryResponse.builder().build();
  }

  public static PostCategoryResponse toResponse(PostCategoryEntity entity) {
    return PostCategoryResponse.builder()
        .id(entity.getId())
        .name(entity.getName())
        .slug(entity.getSlug())
        .sortOrder(entity.getSortOrder())
        .enabled(entity.getEnabled())
        .build();
  }
}
