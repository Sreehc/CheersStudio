package com.cheersstudio.project.service;

import com.cheersstudio.common.api.PageResponse;
import com.cheersstudio.project.dto.request.ProjectAdminQueryRequest;
import com.cheersstudio.project.dto.request.ProjectCreateRequest;
import com.cheersstudio.project.dto.request.ProjectFeaturedStatusRequest;
import com.cheersstudio.project.dto.request.ProjectPublishStatusRequest;
import com.cheersstudio.project.dto.request.ProjectUpdateRequest;
import com.cheersstudio.project.dto.response.ProjectAdminListItemResponse;
import com.cheersstudio.project.dto.response.ProjectDetailResponse;
import com.cheersstudio.project.dto.response.ProjectSummaryResponse;
import java.util.List;

public interface ProjectService {

  List<ProjectSummaryResponse> listPublicProjects();

  List<ProjectSummaryResponse> listFeaturedProjects();

  ProjectDetailResponse getProjectDetailBySlug(String slug);

  PageResponse<ProjectAdminListItemResponse> listAdminProjects(ProjectAdminQueryRequest request);

  ProjectDetailResponse getAdminProjectDetail(Long id);

  ProjectDetailResponse createProject(ProjectCreateRequest request);

  ProjectDetailResponse updateProject(Long id, ProjectUpdateRequest request);

  void deleteProject(Long id);

  void updateProjectPublishStatus(Long id, ProjectPublishStatusRequest request);

  void updateProjectFeaturedStatus(Long id, ProjectFeaturedStatusRequest request);
}
