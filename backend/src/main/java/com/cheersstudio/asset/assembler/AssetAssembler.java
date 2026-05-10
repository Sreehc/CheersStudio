package com.cheersstudio.asset.assembler;

import com.cheersstudio.asset.dto.response.AssetResponse;
import com.cheersstudio.asset.entity.AssetEntity;

public final class AssetAssembler {

  private AssetAssembler() {}

  public static AssetResponse empty() {
    return AssetResponse.builder().build();
  }

  public static AssetResponse toResponse(AssetEntity entity) {
    return AssetResponse.builder()
        .id(entity.getId())
        .uid(entity.getAssetUid())
        .originalName(entity.getOriginalName())
        .fileUrl(entity.getFileUrl())
        .mimeType(entity.getMimeType())
        .fileSize(entity.getFileSize())
        .moduleType(entity.getModuleType())
        .status(entity.getStatus())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}
