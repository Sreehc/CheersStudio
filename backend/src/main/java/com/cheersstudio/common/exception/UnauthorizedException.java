package com.cheersstudio.common.exception;

import com.cheersstudio.common.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends BusinessException {

  public UnauthorizedException(String message) {
    super(ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, message);
  }
}
