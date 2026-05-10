package com.cheersstudio.common.enums;

import lombok.Getter;

@Getter
public enum ErrorCode {
  SUCCESS("SUCCESS", "请求成功"),
  UNAUTHORIZED("UNAUTHORIZED", "未登录或登录已失效"),
  FORBIDDEN("FORBIDDEN", "无权限访问"),
  NOT_FOUND("NOT_FOUND", "资源不存在"),
  VALIDATION_ERROR("VALIDATION_ERROR", "请求参数校验失败"),
  NOT_IMPLEMENTED("NOT_IMPLEMENTED", "接口骨架已创建，业务逻辑尚未实现"),
  INTERNAL_ERROR("INTERNAL_ERROR", "服务内部异常");

  private final String code;
  private final String message;

  ErrorCode(String code, String message) {
    this.code = code;
    this.message = message;
  }
}
