package com.cheersstudio.asset.controller;

import com.cheersstudio.asset.dto.request.AssetUploadRequest;
import com.cheersstudio.asset.dto.response.AssetResponse;
import com.cheersstudio.asset.service.AssetService;
import com.cheersstudio.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequestMapping("/api/admin/assets")
public class AdminAssetController {

  private final AssetService assetService;

  public AdminAssetController(AssetService assetService) {
    this.assetService = assetService;
  }

  @PostMapping(consumes = "multipart/form-data")
  public ApiResponse<AssetResponse> uploadAsset(
      @Valid @ModelAttribute AssetUploadRequest request, @RequestPart("file") MultipartFile file) {
    return ApiResponse.success(assetService.uploadAsset(request, file));
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteAsset(@PathVariable Long id) {
    assetService.deleteAsset(id);
    return ApiResponse.success(null, "删除资源接口骨架已创建");
  }
}
