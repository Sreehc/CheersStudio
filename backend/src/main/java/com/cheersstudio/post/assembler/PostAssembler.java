package com.cheersstudio.post.assembler;

import com.cheersstudio.post.dto.response.PostDetailResponse;
import com.cheersstudio.post.dto.response.PostSummaryResponse;
import com.cheersstudio.post.entity.PostEntity;

public final class PostAssembler {

  private PostAssembler() {}

  public static PostSummaryResponse emptySummary() {
    return PostSummaryResponse.builder().build();
  }

  public static PostDetailResponse emptyDetail() {
    return PostDetailResponse.builder().build();
  }

  public static PostSummaryResponse toSummary(
      PostEntity entity, String categoryName, String categorySlug) {
    return PostSummaryResponse.builder()
        .id(entity.getId())
        .uid(entity.getPostUid())
        .slug(entity.getSlug())
        .title(entity.getTitle())
        .excerpt(entity.getExcerpt())
        .categoryName(categoryName)
        .categorySlug(categorySlug)
        .readingTime(entity.getReadingTime())
        .featured(entity.getFeatured())
        .status(entity.getStatus())
        .coverAssetUrl(entity.getCoverAssetUrl())
        .publishedAt(entity.getPublishedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }

  public static PostDetailResponse toDetail(
      PostEntity entity, String categoryName, String categorySlug) {
    return PostDetailResponse.builder()
        .id(entity.getId())
        .uid(entity.getPostUid())
        .slug(entity.getSlug())
        .title(entity.getTitle())
        .excerpt(entity.getExcerpt())
        .categoryName(categoryName)
        .categorySlug(categorySlug)
        .readingTime(entity.getReadingTime())
        .featured(entity.getFeatured())
        .status(entity.getStatus())
        .coverAssetUrl(entity.getCoverAssetUrl())
        .publishedAt(entity.getPublishedAt())
        .updatedAt(entity.getUpdatedAt())
        .contentMarkdown(entity.getContentMarkdown())
        .build();
  }
}
