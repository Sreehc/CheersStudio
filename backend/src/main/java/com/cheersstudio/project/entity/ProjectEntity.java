package com.cheersstudio.project.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cheersstudio.common.model.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("project")
@EqualsAndHashCode(callSuper = true)
public class ProjectEntity extends BaseEntity {

  @TableId private Long id;
  private String projectUid;
  private String slug;
  private String title;
  private String summary;
  private String description;
  private String contentMarkdown;
  private String year;
  private String statusLabel;
  private Boolean featured;
  private Boolean published;
  private Integer sortOrder;
  private String coverAssetUrl;
  private String githubUrl;
  private String demoUrl;
  private String techStackJson;
  private String highlightsJson;
  private String galleryJson;
}
