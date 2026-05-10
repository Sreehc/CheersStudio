package com.cheersstudio.post.controller;

import com.cheersstudio.common.api.ApiResponse;
import com.cheersstudio.post.dto.response.PostDetailResponse;
import com.cheersstudio.post.dto.response.PostSummaryResponse;
import com.cheersstudio.post.service.PostService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/posts")
public class PublicPostController {

  private final PostService postService;

  public PublicPostController(PostService postService) {
    this.postService = postService;
  }

  @GetMapping
  public ApiResponse<List<PostSummaryResponse>> listPublicPosts() {
    return ApiResponse.success(postService.listPublicPosts());
  }

  @GetMapping("/featured")
  public ApiResponse<List<PostSummaryResponse>> listFeaturedPosts() {
    return ApiResponse.success(postService.listFeaturedPosts());
  }

  @GetMapping("/{slug}")
  public ApiResponse<PostDetailResponse> getPostDetailBySlug(@PathVariable String slug) {
    return ApiResponse.success(postService.getPostDetailBySlug(slug));
  }
}
