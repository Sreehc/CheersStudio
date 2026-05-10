package com.cheersstudio.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDetailResponse {

  private Long id;
  private String uid;
  private String slug;
  private String title;
  private String excerpt;
  private String categoryName;
  private String categorySlug;
  private String readingTime;
  private Boolean featured;
  private String status;
  private String coverAssetUrl;
  private java.time.LocalDateTime publishedAt;
  private java.time.LocalDateTime updatedAt;
  private String contentMarkdown;
}
