package com.cheersstudio.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectAdminListItemResponse {

  private Long id;
  private String uid;
  private String slug;
  private String title;
  private String summary;
  private String description;
  private String year;
  private String statusLabel;
  private Boolean featured;
  private Boolean published;
  private String coverAssetUrl;
  private String githubUrl;
  private String demoUrl;
  private java.util.List<String> techStack;
  private java.util.List<String> highlights;
  private java.time.LocalDateTime updatedAt;
  private Integer sortOrder;
}
