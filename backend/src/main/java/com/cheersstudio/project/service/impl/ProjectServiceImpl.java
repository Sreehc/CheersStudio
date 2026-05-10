package com.cheersstudio.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cheersstudio.common.api.PageResponse;
import com.cheersstudio.common.exception.BadRequestException;
import com.cheersstudio.common.exception.NotFoundException;
import com.cheersstudio.common.util.JsonUtils;
import com.cheersstudio.common.util.SlugUtils;
import com.cheersstudio.project.assembler.ProjectAssembler;
import com.cheersstudio.project.dto.request.ProjectAdminQueryRequest;
import com.cheersstudio.project.dto.request.ProjectCreateRequest;
import com.cheersstudio.project.dto.request.ProjectFeaturedStatusRequest;
import com.cheersstudio.project.dto.request.ProjectPublishStatusRequest;
import com.cheersstudio.project.dto.request.ProjectUpdateRequest;
import com.cheersstudio.project.dto.response.ProjectAdminListItemResponse;
import com.cheersstudio.project.dto.response.ProjectDetailResponse;
import com.cheersstudio.project.dto.response.ProjectSummaryResponse;
import com.cheersstudio.project.entity.ProjectEntity;
import com.cheersstudio.project.mapper.ProjectMapper;
import com.cheersstudio.project.service.ProjectService;
import java.time.Year;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ProjectServiceImpl implements ProjectService {

  private final ProjectMapper projectMapper;
  private final JsonUtils jsonUtils;

  public ProjectServiceImpl(ProjectMapper projectMapper, JsonUtils jsonUtils) {
    this.projectMapper = projectMapper;
    this.jsonUtils = jsonUtils;
  }

  @Override
  public List<ProjectSummaryResponse> listPublicProjects() {
    return projectMapper
        .selectList(
            new LambdaQueryWrapper<ProjectEntity>()
                .eq(ProjectEntity::getPublished, true)
                .orderByDesc(ProjectEntity::getSortOrder)
                .orderByDesc(ProjectEntity::getUpdatedAt))
        .stream()
        .map(this::toSummary)
        .toList();
  }

  @Override
  public List<ProjectSummaryResponse> listFeaturedProjects() {
    return projectMapper
        .selectList(
            new LambdaQueryWrapper<ProjectEntity>()
                .eq(ProjectEntity::getPublished, true)
                .eq(ProjectEntity::getFeatured, true)
                .orderByDesc(ProjectEntity::getSortOrder)
                .orderByDesc(ProjectEntity::getUpdatedAt))
        .stream()
        .map(this::toSummary)
        .toList();
  }

  @Override
  public ProjectDetailResponse getProjectDetailBySlug(String slug) {
    ProjectEntity entity =
        projectMapper.selectOne(
            new LambdaQueryWrapper<ProjectEntity>()
                .eq(ProjectEntity::getSlug, slug)
                .eq(ProjectEntity::getPublished, true));
    return toDetail(requireEntity(entity, "项目不存在或未发布"));
  }

  @Override
  public PageResponse<ProjectAdminListItemResponse> listAdminProjects(ProjectAdminQueryRequest request) {
    Page<ProjectEntity> page = new Page<>(request.getCurrent(), request.getSize());
    LambdaQueryWrapper<ProjectEntity> wrapper =
        new LambdaQueryWrapper<ProjectEntity>()
            .orderByDesc(ProjectEntity::getUpdatedAt)
            .orderByDesc(ProjectEntity::getSortOrder);

    if (StringUtils.hasText(request.getKeyword())) {
      wrapper.and(
          query ->
              query
                  .like(ProjectEntity::getTitle, request.getKeyword())
                  .or()
                  .like(ProjectEntity::getSummary, request.getKeyword()));
    }
    if (request.getPublished() != null) {
      wrapper.eq(ProjectEntity::getPublished, request.getPublished());
    }
    if (request.getFeatured() != null) {
      wrapper.eq(ProjectEntity::getFeatured, request.getFeatured());
    }
    if (StringUtils.hasText(request.getStatusLabel())) {
      wrapper.eq(ProjectEntity::getStatusLabel, request.getStatusLabel());
    }

    Page<ProjectEntity> entityPage = projectMapper.selectPage(page, wrapper);
    List<ProjectAdminListItemResponse> records =
        entityPage.getRecords().stream().map(this::toAdminItem).toList();
    return PageResponse.fromPage(new Page<ProjectAdminListItemResponse>(
        entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal()).setRecords(records));
  }

  @Override
  public ProjectDetailResponse getAdminProjectDetail(Long id) {
    return toDetail(requireById(id));
  }

  @Override
  @Transactional
  public ProjectDetailResponse createProject(ProjectCreateRequest request) {
    String title = normalizeText(request.getTitle());
    String summary = normalizeText(request.getSummary());
    String description = normalizeText(request.getDescription());
    String contentMarkdown = normalizeText(request.getContentMarkdown());
    String year = normalizeText(request.getYear());
    String statusLabel = normalizeText(request.getStatusLabel());
    List<String> techStack = normalizeList(request.getTechStack());
    List<String> highlights = normalizeList(request.getHighlights());
    List<String> gallery = normalizeList(request.getGallery());
    boolean published = Boolean.TRUE.equals(request.getPublished());

    validateProjectForTargetState(
        published, title, summary, description, contentMarkdown, year, statusLabel, techStack, highlights);

    String slug = normalizeSlug(request.getSlug(), title, "draft-project");
    validateUniqueSlug(slug, null);

    ProjectEntity entity = new ProjectEntity();
    entity.setProjectUid(UUID.randomUUID().toString());
    applyRequest(
        entity,
        title,
        summary,
        description,
        contentMarkdown,
        year,
        statusLabel,
        techStack,
        highlights,
        gallery,
        request.getFeatured(),
        request.getPublished(),
        request.getSortOrder(),
        request.getCoverAssetUrl(),
        request.getGithubUrl(),
        request.getDemoUrl());
    entity.setSlug(slug);
    projectMapper.insert(entity);
    return toDetail(entity);
  }

  @Override
  @Transactional
  public ProjectDetailResponse updateProject(Long id, ProjectUpdateRequest request) {
    ProjectEntity entity = requireById(id);

    String title =
        request.getTitle() != null ? normalizeText(request.getTitle()) : Objects.requireNonNullElse(entity.getTitle(), "");
    String summary =
        request.getSummary() != null
            ? normalizeText(request.getSummary())
            : Objects.requireNonNullElse(entity.getSummary(), "");
    String description =
        request.getDescription() != null
            ? normalizeText(request.getDescription())
            : Objects.requireNonNullElse(entity.getDescription(), "");
    String contentMarkdown =
        request.getContentMarkdown() != null
            ? normalizeText(request.getContentMarkdown())
            : Objects.requireNonNullElse(entity.getContentMarkdown(), "");
    String year =
        request.getYear() != null
            ? normalizeText(request.getYear())
            : Objects.requireNonNullElse(entity.getYear(), "");
    String statusLabel =
        request.getStatusLabel() != null
            ? normalizeText(request.getStatusLabel())
            : Objects.requireNonNullElse(entity.getStatusLabel(), "");
    List<String> techStack =
        request.getTechStack() != null
            ? normalizeList(request.getTechStack())
            : jsonUtils.readStringList(entity.getTechStackJson());
    List<String> highlights =
        request.getHighlights() != null
            ? normalizeList(request.getHighlights())
            : jsonUtils.readStringList(entity.getHighlightsJson());
    List<String> gallery =
        request.getGallery() != null
            ? normalizeList(request.getGallery())
            : jsonUtils.readStringList(entity.getGalleryJson());
    boolean published =
        request.getPublished() != null ? request.getPublished() : Boolean.TRUE.equals(entity.getPublished());

    validateProjectForTargetState(
        published, title, summary, description, contentMarkdown, year, statusLabel, techStack, highlights);

    if (request.getSlug() != null || request.getTitle() != null) {
      String slug = normalizeSlug(request.getSlug() != null ? request.getSlug() : entity.getSlug(), title, "draft-project");
      validateUniqueSlug(slug, id);
      entity.setSlug(slug);
    }

    applyRequest(
        entity,
        title,
        summary,
        description,
        contentMarkdown,
        year,
        statusLabel,
        techStack,
        highlights,
        gallery,
        request.getFeatured() != null ? request.getFeatured() : entity.getFeatured(),
        published,
        request.getSortOrder() != null ? request.getSortOrder() : entity.getSortOrder(),
        request.getCoverAssetUrl() != null ? request.getCoverAssetUrl() : entity.getCoverAssetUrl(),
        request.getGithubUrl() != null ? request.getGithubUrl() : entity.getGithubUrl(),
        request.getDemoUrl() != null ? request.getDemoUrl() : entity.getDemoUrl());
    projectMapper.updateById(entity);
    return toDetail(entity);
  }

  @Override
  @Transactional
  public void deleteProject(Long id) {
    requireById(id);
    projectMapper.deleteById(id);
  }

  @Override
  @Transactional
  public void updateProjectPublishStatus(Long id, ProjectPublishStatusRequest request) {
    ProjectEntity entity = requireById(id);
    if (Boolean.TRUE.equals(request.getPublished())) {
      validateProjectForTargetState(
          true,
          entity.getTitle(),
          entity.getSummary(),
          entity.getDescription(),
          entity.getContentMarkdown(),
          entity.getYear(),
          entity.getStatusLabel(),
          jsonUtils.readStringList(entity.getTechStackJson()),
          jsonUtils.readStringList(entity.getHighlightsJson()));
    }
    entity.setPublished(request.getPublished());
    projectMapper.updateById(entity);
  }

  @Override
  @Transactional
  public void updateProjectFeaturedStatus(Long id, ProjectFeaturedStatusRequest request) {
    ProjectEntity entity = requireById(id);
    entity.setFeatured(request.getFeatured());
    projectMapper.updateById(entity);
  }

  private ProjectSummaryResponse toSummary(ProjectEntity entity) {
    return ProjectAssembler.toSummary(
        entity, jsonUtils.readStringList(entity.getTechStackJson()), jsonUtils.readStringList(entity.getHighlightsJson()));
  }

  private ProjectAdminListItemResponse toAdminItem(ProjectEntity entity) {
    return ProjectAssembler.toAdminItem(
        entity, jsonUtils.readStringList(entity.getTechStackJson()), jsonUtils.readStringList(entity.getHighlightsJson()));
  }

  private ProjectDetailResponse toDetail(ProjectEntity entity) {
    return ProjectAssembler.toDetail(
        entity,
        jsonUtils.readStringList(entity.getTechStackJson()),
        jsonUtils.readStringList(entity.getHighlightsJson()),
        jsonUtils.readStringList(entity.getGalleryJson()));
  }

  private ProjectEntity requireById(Long id) {
    return requireEntity(projectMapper.selectById(id), "项目不存在");
  }

  private ProjectEntity requireEntity(ProjectEntity entity, String message) {
    if (entity == null) {
      throw new NotFoundException(message);
    }
    return entity;
  }

  private void validateUniqueSlug(String slug, Long excludeId) {
    ProjectEntity existing =
        projectMapper.selectOne(
            new LambdaQueryWrapper<ProjectEntity>().eq(ProjectEntity::getSlug, slug));
    if (existing != null && (excludeId == null || !existing.getId().equals(excludeId))) {
      throw new BadRequestException("项目 slug 已存在");
    }
  }

  private String normalizeSlug(String slug, String fallbackTitle, String prefix) {
    String normalized = SlugUtils.normalize(StringUtils.hasText(slug) ? slug : fallbackTitle);
    if (StringUtils.hasText(normalized)) {
      return normalized;
    }
    return prefix + "-" + UUID.randomUUID().toString().substring(0, 8);
  }

  private void applyRequest(
      ProjectEntity entity,
      String title,
      String summary,
      String description,
      String contentMarkdown,
      String year,
      String statusLabel,
      List<String> techStack,
      List<String> highlights,
      List<String> gallery,
      Boolean featured,
      Boolean published,
      Integer sortOrder,
      String coverAssetUrl,
      String githubUrl,
      String demoUrl) {
    entity.setTitle(title);
    entity.setSummary(summary);
    entity.setDescription(description);
    entity.setContentMarkdown(contentMarkdown);
    entity.setYear(StringUtils.hasText(year) ? year : String.valueOf(Year.now().getValue()));
    entity.setStatusLabel(StringUtils.hasText(statusLabel) ? statusLabel : "Draft");
    entity.setFeatured(Boolean.TRUE.equals(featured));
    entity.setPublished(Boolean.TRUE.equals(published));
    entity.setSortOrder(sortOrder == null ? 0 : sortOrder);
    entity.setCoverAssetUrl(emptyToNull(coverAssetUrl));
    entity.setGithubUrl(emptyToNull(githubUrl));
    entity.setDemoUrl(emptyToNull(demoUrl));
    entity.setTechStackJson(jsonUtils.toJson(techStack));
    entity.setHighlightsJson(jsonUtils.toJson(highlights));
    entity.setGalleryJson(jsonUtils.toJson(gallery));
  }

  private void validateProjectForTargetState(
      boolean published,
      String title,
      String summary,
      String description,
      String contentMarkdown,
      String year,
      String statusLabel,
      List<String> techStack,
      List<String> highlights) {
    if (!published) {
      return;
    }
    requireText(title, "发布项目时标题不能为空");
    requireText(summary, "发布项目时摘要不能为空");
    requireText(description, "发布项目时详细说明不能为空");
    requireText(contentMarkdown, "发布项目时 Markdown 正文不能为空");
    requireText(year, "发布项目时年份不能为空");
    requireText(statusLabel, "发布项目时项目状态不能为空");
    if (techStack.isEmpty()) {
      throw new BadRequestException("发布项目时至少需要一个技术栈");
    }
    if (highlights.isEmpty()) {
      throw new BadRequestException("发布项目时至少需要一个项目亮点");
    }
  }

  private List<String> normalizeList(List<String> values) {
    if (values == null) {
      return List.of();
    }
    return values.stream().map(this::normalizeText).filter(StringUtils::hasText).toList();
  }

  private String normalizeText(String value) {
    return value == null ? "" : value.trim();
  }

  private String emptyToNull(String value) {
    String normalized = normalizeText(value);
    return StringUtils.hasText(normalized) ? normalized : null;
  }

  private void requireText(String value, String message) {
    if (!StringUtils.hasText(value)) {
      throw new BadRequestException(message);
    }
  }
}
