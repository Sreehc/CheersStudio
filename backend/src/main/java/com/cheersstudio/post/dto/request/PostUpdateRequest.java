package com.cheersstudio.post.dto.request;

import lombok.Data;

@Data
public class PostUpdateRequest {

  private String slug;
  private String title;
  private String excerpt;
  private String categorySlug;
  private String publishedAt;
  private String readingTime;
  private String status;
  private String contentMarkdown;
  private Boolean featured;
  private String coverAssetUrl;
}
