package com.cheersstudio.post.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cheersstudio.common.model.BaseEntity;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("post")
@EqualsAndHashCode(callSuper = true)
public class PostEntity extends BaseEntity {

  @TableId private Long id;
  private String postUid;
  private String slug;
  private String title;
  private String excerpt;
  private Long categoryId;
  private LocalDateTime publishedAt;
  private String readingTime;
  private Boolean featured;
  private String status;
  private String coverAssetUrl;
  private String contentMarkdown;
}
