package com.cheersstudio.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostStatusUpdateRequest {

  @NotBlank private String status;
}
