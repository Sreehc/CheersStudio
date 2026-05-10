package com.cheersstudio.asset.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cheersstudio.common.model.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("asset")
@EqualsAndHashCode(callSuper = true)
public class AssetEntity extends BaseEntity {

  @TableId private Long id;
  private String assetUid;
  private String originalName;
  private String storageKey;
  private String fileUrl;
  private String mimeType;
  private Long fileSize;
  private String moduleType;
  private String status;
  private Long createdBy;
}
