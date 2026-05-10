package com.cheersstudio.post.controller;

import com.cheersstudio.common.api.ApiResponse;
import com.cheersstudio.common.api.PageResponse;
import com.cheersstudio.post.dto.request.PostAdminQueryRequest;
import com.cheersstudio.post.dto.request.PostCreateRequest;
import com.cheersstudio.post.dto.request.PostStatusUpdateRequest;
import com.cheersstudio.post.dto.request.PostUpdateRequest;
import com.cheersstudio.post.dto.response.PostDetailResponse;
import com.cheersstudio.post.dto.response.PostSummaryResponse;
import com.cheersstudio.post.service.PostService;
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
@RequestMapping("/api/admin/posts")
public class AdminPostController {

  private final PostService postService;

  public AdminPostController(PostService postService) {
    this.postService = postService;
  }

  @GetMapping
  public ApiResponse<PageResponse<PostSummaryResponse>> listAdminPosts(
      @Valid PostAdminQueryRequest request) {
    return ApiResponse.success(postService.listAdminPosts(request));
  }

  @GetMapping("/{id}")
  public ApiResponse<PostDetailResponse> getAdminPostDetail(@PathVariable Long id) {
    return ApiResponse.success(postService.getAdminPostDetail(id));
  }

  @PostMapping
  public ApiResponse<PostDetailResponse> createPost(@Valid @RequestBody PostCreateRequest request) {
    return ApiResponse.success(postService.createPost(request));
  }

  @PutMapping("/{id}")
  public ApiResponse<PostDetailResponse> updatePost(
      @PathVariable Long id, @Valid @RequestBody PostUpdateRequest request) {
    return ApiResponse.success(postService.updatePost(id, request));
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deletePost(@PathVariable Long id) {
    postService.deletePost(id);
    return ApiResponse.success(null, "删除文章接口骨架已创建");
  }

  @PatchMapping("/{id}/status")
  public ApiResponse<Void> updatePostStatus(
      @PathVariable Long id, @Valid @RequestBody PostStatusUpdateRequest request) {
    postService.updatePostStatus(id, request);
    return ApiResponse.success(null, "文章状态接口骨架已创建");
  }
}
