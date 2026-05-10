package com.cheersstudio.category.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cheersstudio.category.assembler.PostCategoryAssembler;
import com.cheersstudio.category.dto.request.PostCategoryCreateRequest;
import com.cheersstudio.category.dto.request.PostCategoryUpdateRequest;
import com.cheersstudio.category.dto.response.PostCategoryResponse;
import com.cheersstudio.category.entity.PostCategoryEntity;
import com.cheersstudio.category.mapper.PostCategoryMapper;
import com.cheersstudio.category.service.PostCategoryService;
import com.cheersstudio.common.exception.BadRequestException;
import com.cheersstudio.common.exception.NotFoundException;
import com.cheersstudio.common.util.SlugUtils;
import com.cheersstudio.post.entity.PostEntity;
import com.cheersstudio.post.mapper.PostMapper;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostCategoryServiceImpl implements PostCategoryService {

  private final PostCategoryMapper postCategoryMapper;
  private final PostMapper postMapper;

  public PostCategoryServiceImpl(PostCategoryMapper postCategoryMapper, PostMapper postMapper) {
    this.postCategoryMapper = postCategoryMapper;
    this.postMapper = postMapper;
  }

  @Override
  public List<PostCategoryResponse> listEnabledCategories() {
    return postCategoryMapper
        .selectList(
            new LambdaQueryWrapper<PostCategoryEntity>()
                .eq(PostCategoryEntity::getEnabled, true)
                .orderByAsc(PostCategoryEntity::getSortOrder)
                .orderByAsc(PostCategoryEntity::getId))
        .stream()
        .map(PostCategoryAssembler::toResponse)
        .toList();
  }

  @Override
  public List<PostCategoryResponse> listAdminCategories() {
    return postCategoryMapper
        .selectList(
            new LambdaQueryWrapper<PostCategoryEntity>()
                .orderByAsc(PostCategoryEntity::getSortOrder)
                .orderByAsc(PostCategoryEntity::getId))
        .stream()
        .map(PostCategoryAssembler::toResponse)
        .toList();
  }

  @Override
  @Transactional
  public PostCategoryResponse createCategory(PostCategoryCreateRequest request) {
    String slug = SlugUtils.normalize(request.getSlug());
    validateUniqueSlug(slug, null);
    PostCategoryEntity entity = new PostCategoryEntity();
    entity.setName(request.getName().trim());
    entity.setSlug(slug.isBlank() ? UUID.randomUUID().toString().substring(0, 8) : slug);
    entity.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
    entity.setEnabled(request.getEnabled() == null ? Boolean.TRUE : request.getEnabled());
    postCategoryMapper.insert(entity);
    return PostCategoryAssembler.toResponse(entity);
  }

  @Override
  @Transactional
  public PostCategoryResponse updateCategory(Long id, PostCategoryUpdateRequest request) {
    PostCategoryEntity entity = requireById(id);
    if (request.getName() != null) {
      entity.setName(request.getName().trim());
    }
    if (request.getSlug() != null) {
      String slug = SlugUtils.normalize(request.getSlug());
      validateUniqueSlug(slug, id);
      entity.setSlug(slug);
    }
    if (request.getSortOrder() != null) {
      entity.setSortOrder(request.getSortOrder());
    }
    if (request.getEnabled() != null) {
      entity.setEnabled(request.getEnabled());
    }
    postCategoryMapper.updateById(entity);
    return PostCategoryAssembler.toResponse(entity);
  }

  @Override
  @Transactional
  public void deleteCategory(Long id) {
    requireNoPostReference(id);
    requireById(id);
    postCategoryMapper.deleteById(id);
  }

  private PostCategoryEntity requireById(Long id) {
    PostCategoryEntity entity = postCategoryMapper.selectById(id);
    if (entity == null) {
      throw new NotFoundException("博客分类不存在");
    }
    return entity;
  }

  private void validateUniqueSlug(String slug, Long excludeId) {
    if (slug == null || slug.isBlank()) {
      throw new BadRequestException("分类 slug 不能为空");
    }
    PostCategoryEntity existing =
        postCategoryMapper.selectOne(
            new LambdaQueryWrapper<PostCategoryEntity>().eq(PostCategoryEntity::getSlug, slug));
    if (existing != null && (excludeId == null || !existing.getId().equals(excludeId))) {
      throw new BadRequestException("分类 slug 已存在");
    }
  }

  private void requireNoPostReference(Long id) {
    Long count =
        postMapper.selectCount(
            new LambdaQueryWrapper<PostEntity>().eq(PostEntity::getCategoryId, id));
    if (count != null && count > 0) {
      throw new BadRequestException("当前分类已被文章使用，无法删除");
    }
  }
}
