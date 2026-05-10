package com.cheersstudio.common.model;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public abstract class BaseEntity {

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
