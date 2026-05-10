package com.cheersstudio.common.exception;

import com.cheersstudio.common.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class BadRequestException extends BusinessException {

  public BadRequestException(String message) {
    super(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, message);
  }
}
