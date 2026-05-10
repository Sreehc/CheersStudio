package com.cheersstudio.post.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSummaryResponse {

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
  private LocalDateTime publishedAt;
  private LocalDateTime updatedAt;
}
