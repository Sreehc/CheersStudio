package com.cheersstudio.project.dto.request;

import java.util.List;
import lombok.Data;

@Data
public class ProjectCreateRequest {

  private String slug;
  private String title;
  private String summary;
  private String description;
  private String contentMarkdown;
  private String year;
  private String statusLabel;
  private Boolean featured;
  private Boolean published;
  private Integer sortOrder;
  private String coverAssetUrl;
  private String githubUrl;
  private String demoUrl;
  private List<String> techStack;
  private List<String> highlights;
  private List<String> gallery;
}
