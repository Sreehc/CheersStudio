package com.cheersstudio.common.exception;

import com.cheersstudio.common.api.ApiResponse;
import com.cheersstudio.common.enums.ErrorCode;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
    return ResponseEntity.status(exception.getHttpStatus())
        .body(ApiResponse.failure(exception.getErrorCode(), exception.getMessage()));
  }

  @ExceptionHandler({
    MethodArgumentNotValidException.class,
    BindException.class,
    ConstraintViolationException.class
  })
  public ResponseEntity<ApiResponse<Void>> handleValidationException(Exception exception) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(ApiResponse.failure(ErrorCode.VALIDATION_ERROR, exception.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleException(Exception exception) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.failure(ErrorCode.INTERNAL_ERROR, exception.getMessage()));
  }
}
