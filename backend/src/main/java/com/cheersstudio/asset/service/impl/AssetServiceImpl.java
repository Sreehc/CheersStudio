package com.cheersstudio.asset.service.impl;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cheersstudio.asset.assembler.AssetAssembler;
import com.cheersstudio.asset.dto.request.AssetUploadRequest;
import com.cheersstudio.asset.dto.response.AssetResponse;
import com.cheersstudio.asset.entity.AssetEntity;
import com.cheersstudio.asset.mapper.AssetMapper;
import com.cheersstudio.asset.service.AssetService;
import com.cheersstudio.common.exception.BadRequestException;
import com.cheersstudio.common.exception.NotFoundException;
import com.cheersstudio.config.OssProperties;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AssetServiceImpl implements AssetService {

  private final AssetMapper assetMapper;
  private final OssProperties ossProperties;

  public AssetServiceImpl(AssetMapper assetMapper, OssProperties ossProperties) {
    this.assetMapper = assetMapper;
    this.ossProperties = ossProperties;
  }

  @Override
  @Transactional
  public AssetResponse uploadAsset(AssetUploadRequest request, MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("上传文件不能为空");
    }

    String moduleType =
        request.getModuleType() == null || request.getModuleType().isBlank()
            ? "other"
            : request.getModuleType().trim();

    String storageKey = buildStorageKey(moduleType, Objects.requireNonNullElse(file.getOriginalFilename(), "file"));
    String fileUrl = uploadToOss(storageKey, file);

    AssetEntity entity = new AssetEntity();
    entity.setAssetUid(UUID.randomUUID().toString());
    entity.setOriginalName(file.getOriginalFilename());
    entity.setStorageKey(storageKey);
    entity.setFileUrl(fileUrl);
    entity.setMimeType(file.getContentType());
    entity.setFileSize(file.getSize());
    entity.setModuleType(moduleType);
    entity.setStatus("ready");
    entity.setCreatedBy(1L);
    assetMapper.insert(entity);
    return AssetAssembler.toResponse(entity);
  }

  @Override
  @Transactional
  public void deleteAsset(Long id) {
    AssetEntity entity = assetMapper.selectById(id);
    if (entity == null) {
      throw new NotFoundException("资源不存在");
    }
    deleteFromOss(entity.getStorageKey());
    assetMapper.delete(
        new LambdaQueryWrapper<AssetEntity>().eq(AssetEntity::getId, id));
  }

  private String buildStorageKey(String moduleType, String originalFilename) {
    LocalDate today = LocalDate.now();
    String safeName = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8)
        .replace("+", "%20");
    return moduleType
        + "/"
        + today.getYear()
        + "/"
        + String.format("%02d", today.getMonthValue())
        + "/"
        + UUID.randomUUID()
        + "-"
        + safeName;
  }

  private String uploadToOss(String storageKey, MultipartFile file) {
    OSS ossClient =
        new OSSClientBuilder()
            .build(
                ossProperties.getEndpoint(),
                ossProperties.getAccessKeyId(),
                ossProperties.getAccessKeySecret());
    try {
      ossClient.putObject(ossProperties.getBucket(), storageKey, file.getInputStream());
      return normalizeDomain(ossProperties.getDomain()) + "/" + storageKey;
    } catch (IOException exception) {
      throw new BadRequestException("上传文件失败");
    } finally {
      ossClient.shutdown();
    }
  }

  private void deleteFromOss(String storageKey) {
    OSS ossClient =
        new OSSClientBuilder()
            .build(
                ossProperties.getEndpoint(),
                ossProperties.getAccessKeyId(),
                ossProperties.getAccessKeySecret());
    try {
      ossClient.deleteObject(ossProperties.getBucket(), storageKey);
    } finally {
      ossClient.shutdown();
    }
  }

  private String normalizeDomain(String domain) {
    if (domain.endsWith("/")) {
      return domain.substring(0, domain.length() - 1);
    }
    return domain;
  }
}
