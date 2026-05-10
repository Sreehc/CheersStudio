package com.cheersstudio.auth.service.impl;

import com.cheersstudio.auth.assembler.AuthAssembler;
import com.cheersstudio.auth.dto.request.LoginRequest;
import com.cheersstudio.auth.dto.response.AdminProfileResponse;
import com.cheersstudio.auth.dto.response.LoginResponse;
import com.cheersstudio.auth.entity.AdminUserEntity;
import com.cheersstudio.auth.mapper.AdminUserMapper;
import com.cheersstudio.auth.service.AuthService;
import com.cheersstudio.common.exception.UnauthorizedException;
import com.cheersstudio.security.AdminPrincipal;
import com.cheersstudio.security.JwtTokenProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

  private final AdminUserMapper adminUserMapper;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  public AuthServiceImpl(
      AdminUserMapper adminUserMapper,
      PasswordEncoder passwordEncoder,
      JwtTokenProvider jwtTokenProvider) {
    this.adminUserMapper = adminUserMapper;
    this.passwordEncoder = passwordEncoder;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  @Override
  public LoginResponse login(LoginRequest request) {
    String username = request.getUsername().trim().toLowerCase();
    AdminUserEntity adminUser =
        adminUserMapper.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<AdminUserEntity>()
                .eq(AdminUserEntity::getUsername, username));

    if (adminUser == null || adminUser.getStatus() == null || adminUser.getStatus() != 1) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    if (!passwordEncoder.matches(request.getPassword(), adminUser.getPasswordHash())) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    return LoginResponse.builder()
        .token(jwtTokenProvider.createToken(adminUser))
        .adminProfile(
            AdminProfileResponse.builder()
                .id(String.valueOf(adminUser.getId()))
                .name(adminUser.getDisplayName())
                .email(adminUser.getEmail())
                .role(adminUser.getRoleCode())
                .build())
        .build();
  }

  @Override
  public void logout() {
    SecurityContextHolder.clearContext();
  }

  @Override
  public AdminProfileResponse getCurrentAdmin() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Object principal = authentication == null ? null : authentication.getPrincipal();
    if (principal instanceof AdminPrincipal adminPrincipal) {
      return AuthAssembler.toAdminProfile(adminPrincipal);
    }
    throw new UnauthorizedException("未获取到当前管理员身份");
  }
}
