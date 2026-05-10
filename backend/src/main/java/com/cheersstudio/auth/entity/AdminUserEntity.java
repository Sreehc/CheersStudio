package com.cheersstudio.auth.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cheersstudio.common.model.BaseEntity;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("admin_user")
@EqualsAndHashCode(callSuper = true)
public class AdminUserEntity extends BaseEntity {

  @TableId private Long id;
  private String username;
  private String passwordHash;
  private String displayName;
  private String email;
  private String roleCode;
  private Integer status;
  private LocalDateTime lastLoginAt;
}
