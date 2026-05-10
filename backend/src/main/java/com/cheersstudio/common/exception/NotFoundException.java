package com.cheersstudio.common.exception;

import com.cheersstudio.common.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class NotFoundException extends BusinessException {

  public NotFoundException(String message) {
    super(ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, message);
  }
}
