package com.cheersstudio.asset.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetResponse {

  private Long id;
  private String uid;
  private String originalName;
  private String fileUrl;
  private String mimeType;
  private Long fileSize;
  private String moduleType;
  private String status;
  private LocalDateTime updatedAt;
}
