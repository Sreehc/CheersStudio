package com.cheersstudio.project.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailResponse {

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
  private List<String> techStack;
  private List<String> highlights;
  private String contentMarkdown;
  private Integer sortOrder;
  private List<String> gallery;
  private java.time.LocalDateTime updatedAt;
}
