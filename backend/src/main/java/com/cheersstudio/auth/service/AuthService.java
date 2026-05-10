package com.cheersstudio.auth.service;

import com.cheersstudio.auth.dto.request.LoginRequest;
import com.cheersstudio.auth.dto.response.AdminProfileResponse;
import com.cheersstudio.auth.dto.response.LoginResponse;

public interface AuthService {

  LoginResponse login(LoginRequest request);

  void logout();

  AdminProfileResponse getCurrentAdmin();
}
