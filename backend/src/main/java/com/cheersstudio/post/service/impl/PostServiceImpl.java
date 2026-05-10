package com.cheersstudio.post.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cheersstudio.common.api.PageResponse;
import com.cheersstudio.common.exception.BadRequestException;
import com.cheersstudio.common.exception.NotFoundException;
import com.cheersstudio.common.util.ReadingTimeUtils;
import com.cheersstudio.common.util.SlugUtils;
import com.cheersstudio.post.assembler.PostAssembler;
import com.cheersstudio.post.dto.request.PostAdminQueryRequest;
import com.cheersstudio.post.dto.request.PostCreateRequest;
import com.cheersstudio.post.dto.request.PostStatusUpdateRequest;
import com.cheersstudio.post.dto.request.PostUpdateRequest;
import com.cheersstudio.post.dto.response.PostDetailResponse;
import com.cheersstudio.post.dto.response.PostSummaryResponse;
import com.cheersstudio.post.entity.PostEntity;
import com.cheersstudio.post.mapper.PostMapper;
import com.cheersstudio.post.service.PostService;
import com.cheersstudio.category.entity.PostCategoryEntity;
import com.cheersstudio.category.mapper.PostCategoryMapper;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class PostServiceImpl implements PostService {

  private final PostMapper postMapper;
  private final PostCategoryMapper postCategoryMapper;

  public PostServiceImpl(PostMapper postMapper, PostCategoryMapper postCategoryMapper) {
    this.postMapper = postMapper;
    this.postCategoryMapper = postCategoryMapper;
  }

  @Override
  public List<PostSummaryResponse> listPublicPosts() {
    List<PostEntity> entities =
        postMapper.selectList(
            new LambdaQueryWrapper<PostEntity>()
                .eq(PostEntity::getStatus, "published")
                .orderByDesc(PostEntity::getPublishedAt)
                .orderByDesc(PostEntity::getUpdatedAt));
    return entities.stream().map(entity -> toSummary(entity, loadCategory(entity.getCategoryId()))).toList();
  }

  @Override
  public List<PostSummaryResponse> listFeaturedPosts() {
    List<PostEntity> entities =
        postMapper.selectList(
            new LambdaQueryWrapper<PostEntity>()
                .eq(PostEntity::getStatus, "published")
                .eq(PostEntity::getFeatured, true)
                .orderByDesc(PostEntity::getPublishedAt)
                .orderByDesc(PostEntity::getUpdatedAt));
    return entities.stream().map(entity -> toSummary(entity, loadCategory(entity.getCategoryId()))).toList();
  }

  @Override
  public PostDetailResponse getPostDetailBySlug(String slug) {
    PostEntity entity =
        postMapper.selectOne(
            new LambdaQueryWrapper<PostEntity>()
                .eq(PostEntity::getSlug, slug)
                .eq(PostEntity::getStatus, "published"));
    PostEntity required = requireEntity(entity, "文章不存在或未发布");
    return toDetail(required, loadCategory(required.getCategoryId()));
  }

  @Override
  public PageResponse<PostSummaryResponse> listAdminPosts(PostAdminQueryRequest request) {
    Page<PostEntity> page = new Page<>(request.getCurrent(), request.getSize());
    LambdaQueryWrapper<PostEntity> wrapper =
        new LambdaQueryWrapper<PostEntity>()
            .orderByDesc(PostEntity::getUpdatedAt)
            .orderByDesc(PostEntity::getPublishedAt);

    if (StringUtils.hasText(request.getKeyword())) {
      wrapper.and(
          query ->
              query.like(PostEntity::getTitle, request.getKeyword())
                  .or()
                  .like(PostEntity::getExcerpt, request.getKeyword()));
    }
    if (StringUtils.hasText(request.getStatus())) {
      wrapper.eq(PostEntity::getStatus, request.getStatus());
    }
    if (request.getFeatured() != null) {
      wrapper.eq(PostEntity::getFeatured, request.getFeatured());
    }
    if (StringUtils.hasText(request.getCategorySlug())) {
      PostCategoryEntity category = requireCategoryBySlug(normalizeCategorySlug(request.getCategorySlug()));
      wrapper.eq(PostEntity::getCategoryId, category.getId());
    }

    Page<PostEntity> entityPage = postMapper.selectPage(page, wrapper);
    Map<Long, PostCategoryEntity> categoryMap = loadCategoryMap(entityPage.getRecords());
    List<PostSummaryResponse> records =
        entityPage.getRecords().stream()
            .map(entity -> toSummary(entity, categoryMap.getOrDefault(entity.getCategoryId(), loadCategory(entity.getCategoryId()))))
            .toList();
    return PageResponse.fromPage(
        new Page<PostSummaryResponse>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal())
            .setRecords(records));
  }

  @Override
  public PostDetailResponse getAdminPostDetail(Long id) {
    PostEntity entity = requireById(id);
    return toDetail(entity, loadCategory(entity.getCategoryId()));
  }

  @Override
  @Transactional
  public PostDetailResponse createPost(PostCreateRequest request) {
    String title = normalizeText(request.getTitle());
    String excerpt = normalizeText(request.getExcerpt());
    String contentMarkdown = normalizeText(request.getContentMarkdown());
    String status = normalizeStatus(request.getStatus());
    PostCategoryEntity category = requireCategoryBySlug(normalizeCategorySlug(request.getCategorySlug()));
    boolean published = "published".equals(status);
    validatePostForTargetState(published, title, excerpt, contentMarkdown);

    String slug = normalizeSlug(request.getSlug(), title, "draft-post");
    validateUniqueSlug(slug, null);

    PostEntity entity = new PostEntity();
    entity.setPostUid(UUID.randomUUID().toString());
    entity.setSlug(slug);
    applyRequest(
        entity,
        title,
        excerpt,
        category.getId(),
        request.getPublishedAt(),
        request.getReadingTime(),
        status,
        contentMarkdown,
        request.getFeatured(),
        request.getCoverAssetUrl());
    postMapper.insert(entity);
    return toDetail(entity, category);
  }

  @Override
  @Transactional
  public PostDetailResponse updatePost(Long id, PostUpdateRequest request) {
    PostEntity entity = requireById(id);
    String title =
        request.getTitle() != null ? normalizeText(request.getTitle()) : Objects.requireNonNullElse(entity.getTitle(), "");
    String excerpt =
        request.getExcerpt() != null ? normalizeText(request.getExcerpt()) : Objects.requireNonNullElse(entity.getExcerpt(), "");
    String contentMarkdown =
        request.getContentMarkdown() != null
            ? normalizeText(request.getContentMarkdown())
            : Objects.requireNonNullElse(entity.getContentMarkdown(), "");
    String status =
        request.getStatus() != null ? normalizeStatus(request.getStatus()) : normalizeStatus(entity.getStatus());
    boolean published = "published".equals(status);
    validatePostForTargetState(published, title, excerpt, contentMarkdown);

    if (request.getSlug() != null || request.getTitle() != null) {
      String slug = normalizeSlug(request.getSlug() != null ? request.getSlug() : entity.getSlug(), title, "draft-post");
      validateUniqueSlug(slug, id);
      entity.setSlug(slug);
    }

    PostCategoryEntity category =
        request.getCategorySlug() != null
            ? requireCategoryBySlug(normalizeCategorySlug(request.getCategorySlug()))
            : loadCategory(entity.getCategoryId());

    applyRequest(
        entity,
        title,
        excerpt,
        category.getId(),
        request.getPublishedAt() != null ? request.getPublishedAt() : entity.getPublishedAt().toString(),
        request.getReadingTime() != null ? request.getReadingTime() : entity.getReadingTime(),
        status,
        contentMarkdown,
        request.getFeatured() != null ? request.getFeatured() : entity.getFeatured(),
        request.getCoverAssetUrl() != null ? request.getCoverAssetUrl() : entity.getCoverAssetUrl());
    postMapper.updateById(entity);
    return toDetail(entity, category);
  }

  @Override
  @Transactional
  public void deletePost(Long id) {
    requireById(id);
    postMapper.deleteById(id);
  }

  @Override
  @Transactional
  public void updatePostStatus(Long id, PostStatusUpdateRequest request) {
    String status = normalizeStatus(request.getStatus());
    PostEntity entity = requireById(id);
    if ("published".equals(status)) {
      validatePostForTargetState(
          true,
          entity.getTitle(),
          entity.getExcerpt(),
          entity.getContentMarkdown());
    }
    entity.setStatus(status);
    postMapper.updateById(entity);
  }

  private PostEntity requireById(Long id) {
    return requireEntity(postMapper.selectById(id), "文章不存在");
  }

  private PostEntity requireEntity(PostEntity entity, String message) {
    if (entity == null) {
      throw new NotFoundException(message);
    }
    return entity;
  }

  private PostCategoryEntity requireCategoryBySlug(String slug) {
    PostCategoryEntity category =
        postCategoryMapper.selectOne(
            new LambdaQueryWrapper<PostCategoryEntity>()
                .eq(PostCategoryEntity::getSlug, slug)
                .eq(PostCategoryEntity::getEnabled, true));
    if (category == null) {
      throw new BadRequestException("文章分类不存在或未启用");
    }
    return category;
  }

  private void validateUniqueSlug(String slug, Long excludeId) {
    PostEntity existing =
        postMapper.selectOne(new LambdaQueryWrapper<PostEntity>().eq(PostEntity::getSlug, slug));
    if (existing != null && (excludeId == null || !existing.getId().equals(excludeId))) {
      throw new BadRequestException("文章 slug 已存在");
    }
  }

  private String normalizeSlug(String slug, String fallbackTitle, String prefix) {
    String normalized = SlugUtils.normalize(StringUtils.hasText(slug) ? slug : fallbackTitle);
    if (StringUtils.hasText(normalized)) {
      return normalized;
    }
    return prefix + "-" + UUID.randomUUID().toString().substring(0, 8);
  }

  private PostSummaryResponse toSummary(PostEntity entity, PostCategoryEntity category) {
    return PostAssembler.toSummary(entity, category.getName(), category.getSlug());
  }

  private PostDetailResponse toDetail(PostEntity entity, PostCategoryEntity category) {
    return PostAssembler.toDetail(entity, category.getName(), category.getSlug());
  }

  private PostCategoryEntity loadCategory(Long categoryId) {
    PostCategoryEntity category = postCategoryMapper.selectById(categoryId);
    if (category != null) {
      return category;
    }
    PostCategoryEntity fallback = new PostCategoryEntity();
    fallback.setId(0L);
    fallback.setName("未分类");
    fallback.setSlug("uncategorized");
    return fallback;
  }

  private Map<Long, PostCategoryEntity> loadCategoryMap(List<PostEntity> posts) {
    List<Long> categoryIds =
        posts.stream().map(PostEntity::getCategoryId).distinct().toList();
    if (categoryIds.isEmpty()) {
      return Map.of();
    }
    return postCategoryMapper
        .selectList(new LambdaQueryWrapper<PostCategoryEntity>().in(PostCategoryEntity::getId, categoryIds))
        .stream()
        .collect(Collectors.toMap(PostCategoryEntity::getId, Function.identity(), (a, b) -> a));
  }

  private void applyRequest(
      PostEntity entity,
      String title,
      String excerpt,
      Long categoryId,
      String publishedAt,
      String readingTime,
      String status,
      String contentMarkdown,
      Boolean featured,
      String coverAssetUrl) {
    entity.setTitle(title);
    entity.setExcerpt(excerpt);
    entity.setCategoryId(categoryId);
    entity.setPublishedAt(parsePublishedAt(publishedAt));
    entity.setReadingTime(
        StringUtils.hasText(readingTime)
            ? readingTime.trim()
            : ReadingTimeUtils.estimate(contentMarkdown));
    entity.setStatus(status);
    entity.setContentMarkdown(contentMarkdown);
    entity.setFeatured(Boolean.TRUE.equals(featured));
    entity.setCoverAssetUrl(emptyToNull(coverAssetUrl));
  }

  private String normalizeStatus(String status) {
    String normalized = normalizeText(status);
    if (!StringUtils.hasText(normalized)) {
      return "draft";
    }
    if (!List.of("draft", "published").contains(normalized)) {
      throw new BadRequestException("文章状态仅支持 draft 或 published");
    }
    return normalized;
  }

  private LocalDateTime parsePublishedAt(String value) {
    if (!StringUtils.hasText(value)) {
      return LocalDate.now().atStartOfDay();
    }
    try {
      if (value.contains("T")) {
        return LocalDateTime.parse(value);
      }
      return LocalDate.parse(value).atStartOfDay();
    } catch (Exception exception) {
      throw new BadRequestException("发布时间格式不正确");
    }
  }

  private void validatePostForTargetState(
      boolean published, String title, String excerpt, String contentMarkdown) {
    if (!published) {
      return;
    }
    requireText(title, "发布文章时标题不能为空");
    requireText(excerpt, "发布文章时摘要不能为空");
    requireText(contentMarkdown, "发布文章时 Markdown 正文不能为空");
  }

  private String normalizeCategorySlug(String value) {
    String normalized = SlugUtils.normalize(value);
    if (!StringUtils.hasText(normalized)) {
      throw new BadRequestException("文章分类不能为空");
    }
    return normalized;
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
