package com.cheersstudio.common.api;

import com.cheersstudio.common.enums.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

  private boolean success;
  private String code;
  private String message;
  private T data;

  public static <T> ApiResponse<T> success(T data) {
    return ApiResponse.<T>builder()
        .success(true)
        .code(ErrorCode.SUCCESS.getCode())
        .message(ErrorCode.SUCCESS.getMessage())
        .data(data)
        .build();
  }

  public static <T> ApiResponse<T> success(T data, String message) {
    return ApiResponse.<T>builder()
        .success(true)
        .code(ErrorCode.SUCCESS.getCode())
        .message(message)
        .data(data)
        .build();
  }

  public static <T> ApiResponse<T> failure(ErrorCode errorCode, String message) {
    return ApiResponse.<T>builder()
        .success(false)
        .code(errorCode.getCode())
        .message(message)
        .build();
  }
}
