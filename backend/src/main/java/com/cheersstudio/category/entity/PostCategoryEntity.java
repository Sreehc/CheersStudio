package com.cheersstudio.category.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cheersstudio.common.model.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("post_category")
@EqualsAndHashCode(callSuper = true)
public class PostCategoryEntity extends BaseEntity {

  @TableId private Long id;
  private String name;
  private String slug;
  private Integer sortOrder;
  private Boolean enabled;
}
