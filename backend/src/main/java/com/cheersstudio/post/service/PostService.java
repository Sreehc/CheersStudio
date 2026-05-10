package com.cheersstudio.post.service;

import com.cheersstudio.common.api.PageResponse;
import com.cheersstudio.post.dto.request.PostAdminQueryRequest;
import com.cheersstudio.post.dto.request.PostCreateRequest;
import com.cheersstudio.post.dto.request.PostStatusUpdateRequest;
import com.cheersstudio.post.dto.request.PostUpdateRequest;
import com.cheersstudio.post.dto.response.PostDetailResponse;
import com.cheersstudio.post.dto.response.PostSummaryResponse;
import java.util.List;

public interface PostService {

  List<PostSummaryResponse> listPublicPosts();

  List<PostSummaryResponse> listFeaturedPosts();

  PostDetailResponse getPostDetailBySlug(String slug);

  PageResponse<PostSummaryResponse> listAdminPosts(PostAdminQueryRequest request);

  PostDetailResponse getAdminPostDetail(Long id);

  PostDetailResponse createPost(PostCreateRequest request);

  PostDetailResponse updatePost(Long id, PostUpdateRequest request);

  void deletePost(Long id);

  void updatePostStatus(Long id, PostStatusUpdateRequest request);
}
