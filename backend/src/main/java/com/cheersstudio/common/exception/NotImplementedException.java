package com.cheersstudio.common.exception;

import com.cheersstudio.common.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class NotImplementedException extends BusinessException {

  public NotImplementedException(String capability) {
    super(
        ErrorCode.NOT_IMPLEMENTED,
        HttpStatus.NOT_IMPLEMENTED,
        capability + "：接口骨架已创建，业务逻辑尚未实现");
  }
}
