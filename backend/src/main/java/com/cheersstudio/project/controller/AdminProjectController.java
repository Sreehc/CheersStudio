package com.cheersstudio.project.controller;

import com.cheersstudio.common.api.ApiResponse;
import com.cheersstudio.common.api.PageResponse;
import com.cheersstudio.project.dto.request.ProjectAdminQueryRequest;
import com.cheersstudio.project.dto.request.ProjectCreateRequest;
import com.cheersstudio.project.dto.request.ProjectFeaturedStatusRequest;
import com.cheersstudio.project.dto.request.ProjectPublishStatusRequest;
import com.cheersstudio.project.dto.request.ProjectUpdateRequest;
import com.cheersstudio.project.dto.response.ProjectAdminListItemResponse;
import com.cheersstudio.project.dto.response.ProjectDetailResponse;
import com.cheersstudio.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

  private final ProjectService projectService;

  public AdminProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @GetMapping
  public ApiResponse<PageResponse<ProjectAdminListItemResponse>> listAdminProjects(
      @Valid ProjectAdminQueryRequest request) {
    return ApiResponse.success(projectService.listAdminProjects(request));
  }

  @GetMapping("/{id}")
  public ApiResponse<ProjectDetailResponse> getAdminProjectDetail(@PathVariable Long id) {
    return ApiResponse.success(projectService.getAdminProjectDetail(id));
  }

  @PostMapping
  public ApiResponse<ProjectDetailResponse> createProject(
      @Valid @RequestBody ProjectCreateRequest request) {
    return ApiResponse.success(projectService.createProject(request));
  }

  @PutMapping("/{id}")
  public ApiResponse<ProjectDetailResponse> updateProject(
      @PathVariable Long id, @Valid @RequestBody ProjectUpdateRequest request) {
    return ApiResponse.success(projectService.updateProject(id, request));
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteProject(@PathVariable Long id) {
    projectService.deleteProject(id);
    return ApiResponse.success(null, "删除项目接口骨架已创建");
  }

  @PatchMapping("/{id}/publish")
  public ApiResponse<Void> updateProjectPublishStatus(
      @PathVariable Long id, @Valid @RequestBody ProjectPublishStatusRequest request) {
    projectService.updateProjectPublishStatus(id, request);
    return ApiResponse.success(null, "项目发布状态接口骨架已创建");
  }

  @PatchMapping("/{id}/feature")
  public ApiResponse<Void> updateProjectFeaturedStatus(
      @PathVariable Long id, @Valid @RequestBody ProjectFeaturedStatusRequest request) {
    projectService.updateProjectFeaturedStatus(id, request);
    return ApiResponse.success(null, "项目精选状态接口骨架已创建");
  }
}
