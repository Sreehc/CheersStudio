package com.cheersstudio.category.controller;

import com.cheersstudio.category.dto.response.PostCategoryResponse;
import com.cheersstudio.category.service.PostCategoryService;
import com.cheersstudio.common.api.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/post-categories")
public class PublicPostCategoryController {

  private final PostCategoryService postCategoryService;

  public PublicPostCategoryController(PostCategoryService postCategoryService) {
    this.postCategoryService = postCategoryService;
  }

  @GetMapping
  public ApiResponse<List<PostCategoryResponse>> listEnabledCategories() {
    return ApiResponse.success(postCategoryService.listEnabledCategories());
  }
}
