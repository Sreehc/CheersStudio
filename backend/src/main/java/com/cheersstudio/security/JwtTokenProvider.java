package com.cheersstudio.security;

import com.cheersstudio.auth.entity.AdminUserEntity;
import com.cheersstudio.common.constant.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class JwtTokenProvider {

  private final JwtProperties jwtProperties;

  public JwtTokenProvider(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
  }

  public String resolveToken(HttpServletRequest request) {
    String headerValue = request.getHeader(jwtProperties.getHeader());
    if (!StringUtils.hasText(headerValue)) {
      return null;
    }

    String prefix = jwtProperties.getPrefix() + " ";
    if (!headerValue.startsWith(prefix)) {
      return null;
    }

    return headerValue.substring(prefix.length());
  }

  public boolean isValid(String token) {
    if (!StringUtils.hasText(token)) {
      return false;
    }
    try {
      parseClaims(token);
      return true;
    } catch (Exception exception) {
      return false;
    }
  }

  public String createToken(AdminUserEntity adminUser) {
    Instant now = Instant.now();
    Instant expiresAt = now.plus(jwtProperties.getExpirationMinutes(), ChronoUnit.MINUTES);

    return Jwts.builder()
        .subject(adminUser.getUsername())
        .claim("id", String.valueOf(adminUser.getId()))
        .claim("name", adminUser.getDisplayName())
        .claim("email", adminUser.getEmail())
        .claim("role", adminUser.getRoleCode())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiresAt))
        .signWith(getSigningKey())
        .compact();
  }

  public Authentication getAuthentication(String token) {
    Claims claims = parseClaims(token);
    AdminPrincipal principal =
        AdminPrincipal.builder()
            .id(String.valueOf(claims.get("id")))
            .username(claims.getSubject())
            .displayName(String.valueOf(claims.get("name")))
            .email(String.valueOf(claims.get("email")))
            .role(String.valueOf(claims.get("role")))
            .build();

    return new UsernamePasswordAuthenticationToken(
        principal,
        null,
        List.of(new SimpleGrantedAuthority(SecurityConstants.ROLE_OWNER)));
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
  }
}
