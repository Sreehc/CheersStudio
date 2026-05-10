package com.cheersstudio.auth.controller;

import com.cheersstudio.auth.dto.request.LoginRequest;
import com.cheersstudio.auth.dto.response.AdminProfileResponse;
import com.cheersstudio.auth.dto.response.LoginResponse;
import com.cheersstudio.auth.service.AuthService;
import com.cheersstudio.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    return ApiResponse.success(authService.login(request));
  }

  @PostMapping("/logout")
  public ApiResponse<Void> logout() {
    authService.logout();
    return ApiResponse.success(null, "登出接口骨架已创建");
  }

  @GetMapping("/me")
  public ApiResponse<AdminProfileResponse> getCurrentAdmin() {
    return ApiResponse.success(authService.getCurrentAdmin());
  }
}
