package com.cheersstudio.auth.assembler;

import com.cheersstudio.auth.dto.response.AdminProfileResponse;
import com.cheersstudio.security.AdminPrincipal;

public final class AuthAssembler {

  private AuthAssembler() {}

  public static AdminProfileResponse toAdminProfile(AdminPrincipal principal) {
    return AdminProfileResponse.builder()
        .id(principal.getId())
        .name(principal.getDisplayName())
        .email(principal.getEmail())
        .role(principal.getRole())
        .build();
  }
}
