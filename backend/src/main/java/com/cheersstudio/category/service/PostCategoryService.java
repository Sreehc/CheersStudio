package com.cheersstudio.category.service;

import com.cheersstudio.category.dto.request.PostCategoryCreateRequest;
import com.cheersstudio.category.dto.request.PostCategoryUpdateRequest;
import com.cheersstudio.category.dto.response.PostCategoryResponse;
import java.util.List;

public interface PostCategoryService {

  List<PostCategoryResponse> listEnabledCategories();

  List<PostCategoryResponse> listAdminCategories();

  PostCategoryResponse createCategory(PostCategoryCreateRequest request);

  PostCategoryResponse updateCategory(Long id, PostCategoryUpdateRequest request);

  void deleteCategory(Long id);
}
