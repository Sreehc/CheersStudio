package com.cheersstudio.asset.service;

import com.cheersstudio.asset.dto.request.AssetUploadRequest;
import com.cheersstudio.asset.dto.response.AssetResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AssetService {

  AssetResponse uploadAsset(AssetUploadRequest request, MultipartFile file);

  void deleteAsset(Long id);
}
