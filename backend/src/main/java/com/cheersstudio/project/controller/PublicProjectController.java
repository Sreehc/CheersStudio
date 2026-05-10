package com.cheersstudio.project.controller;

import com.cheersstudio.common.api.ApiResponse;
import com.cheersstudio.project.dto.response.ProjectDetailResponse;
import com.cheersstudio.project.dto.response.ProjectSummaryResponse;
import com.cheersstudio.project.service.ProjectService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/projects")
public class PublicProjectController {

  private final ProjectService projectService;

  public PublicProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @GetMapping
  public ApiResponse<List<ProjectSummaryResponse>> listPublicProjects() {
    return ApiResponse.success(projectService.listPublicProjects());
  }

  @GetMapping("/featured")
  public ApiResponse<List<ProjectSummaryResponse>> listFeaturedProjects() {
    return ApiResponse.success(projectService.listFeaturedProjects());
  }

  @GetMapping("/{slug}")
  public ApiResponse<ProjectDetailResponse> getProjectDetailBySlug(@PathVariable String slug) {
    return ApiResponse.success(projectService.getProjectDetailBySlug(slug));
  }
}
