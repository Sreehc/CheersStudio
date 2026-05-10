package com.cheersstudio.project.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProjectPublishStatusRequest {

  @NotNull private Boolean published;
}
