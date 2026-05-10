package com.cheersstudio.project.assembler;

import com.cheersstudio.project.dto.response.ProjectAdminListItemResponse;
import com.cheersstudio.project.dto.response.ProjectDetailResponse;
import com.cheersstudio.project.dto.response.ProjectSummaryResponse;
import com.cheersstudio.project.entity.ProjectEntity;
import java.util.List;

public final class ProjectAssembler {

  private ProjectAssembler() {}

  public static ProjectSummaryResponse emptySummary() {
    return ProjectSummaryResponse.builder().build();
  }

  public static ProjectDetailResponse emptyDetail() {
    return ProjectDetailResponse.builder().build();
  }

  public static ProjectAdminListItemResponse emptyAdminItem() {
    return ProjectAdminListItemResponse.builder().build();
  }

  public static ProjectSummaryResponse toSummary(
      ProjectEntity entity, List<String> techStack, List<String> highlights) {
    return ProjectSummaryResponse.builder()
        .id(entity.getId())
        .uid(entity.getProjectUid())
        .slug(entity.getSlug())
        .title(entity.getTitle())
        .summary(entity.getSummary())
        .description(entity.getDescription())
        .year(entity.getYear())
        .statusLabel(entity.getStatusLabel())
        .featured(entity.getFeatured())
        .published(entity.getPublished())
        .coverAssetUrl(entity.getCoverAssetUrl())
        .githubUrl(entity.getGithubUrl())
        .demoUrl(entity.getDemoUrl())
        .techStack(techStack)
        .highlights(highlights)
        .updatedAt(entity.getUpdatedAt())
        .build();
  }

  public static ProjectAdminListItemResponse toAdminItem(
      ProjectEntity entity, List<String> techStack, List<String> highlights) {
    return ProjectAdminListItemResponse.builder()
        .id(entity.getId())
        .uid(entity.getProjectUid())
        .slug(entity.getSlug())
        .title(entity.getTitle())
        .summary(entity.getSummary())
        .description(entity.getDescription())
        .year(entity.getYear())
        .statusLabel(entity.getStatusLabel())
        .featured(entity.getFeatured())
        .published(entity.getPublished())
        .coverAssetUrl(entity.getCoverAssetUrl())
        .githubUrl(entity.getGithubUrl())
        .demoUrl(entity.getDemoUrl())
        .techStack(techStack)
        .highlights(highlights)
        .updatedAt(entity.getUpdatedAt())
        .sortOrder(entity.getSortOrder())
        .build();
  }

  public static ProjectDetailResponse toDetail(
      ProjectEntity entity, List<String> techStack, List<String> highlights, List<String> gallery) {
    return ProjectDetailResponse.builder()
        .id(entity.getId())
        .uid(entity.getProjectUid())
        .slug(entity.getSlug())
        .title(entity.getTitle())
        .summary(entity.getSummary())
        .description(entity.getDescription())
        .year(entity.getYear())
        .statusLabel(entity.getStatusLabel())
        .featured(entity.getFeatured())
        .published(entity.getPublished())
        .coverAssetUrl(entity.getCoverAssetUrl())
        .githubUrl(entity.getGithubUrl())
        .demoUrl(entity.getDemoUrl())
        .techStack(techStack)
        .highlights(highlights)
        .contentMarkdown(entity.getContentMarkdown())
        .sortOrder(entity.getSortOrder())
        .gallery(gallery)
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}
