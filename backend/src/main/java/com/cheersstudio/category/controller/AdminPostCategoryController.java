package com.cheersstudio.category.controller;

import com.cheersstudio.category.dto.request.PostCategoryCreateRequest;
import com.cheersstudio.category.dto.request.PostCategoryUpdateRequest;
import com.cheersstudio.category.dto.response.PostCategoryResponse;
import com.cheersstudio.category.service.PostCategoryService;
import com.cheersstudio.common.api.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/post-categories")
public class AdminPostCategoryController {

  private final PostCategoryService postCategoryService;

  public AdminPostCategoryController(PostCategoryService postCategoryService) {
    this.postCategoryService = postCategoryService;
  }

  @GetMapping
  public ApiResponse<List<PostCategoryResponse>> listAdminCategories() {
    return ApiResponse.success(postCategoryService.listAdminCategories());
  }

  @PostMapping
  public ApiResponse<PostCategoryResponse> createCategory(
      @Valid @RequestBody PostCategoryCreateRequest request) {
    return ApiResponse.success(postCategoryService.createCategory(request));
  }

  @PutMapping("/{id}")
  public ApiResponse<PostCategoryResponse> updateCategory(
      @PathVariable Long id, @Valid @RequestBody PostCategoryUpdateRequest request) {
    return ApiResponse.success(postCategoryService.updateCategory(id, request));
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
    postCategoryService.deleteCategory(id);
    return ApiResponse.success(null, "删除分类接口骨架已创建");
  }
}
