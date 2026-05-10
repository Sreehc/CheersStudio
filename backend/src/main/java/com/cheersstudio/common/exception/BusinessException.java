package com.cheersstudio.common.exception;

import com.cheersstudio.common.enums.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {

  private final ErrorCode errorCode;
  private final HttpStatus httpStatus;

  public BusinessException(ErrorCode errorCode, HttpStatus httpStatus, String message) {
    super(message);
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
  }
}
