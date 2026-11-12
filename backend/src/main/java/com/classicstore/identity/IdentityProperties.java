package com.classicstore.identity;
import org.springframework.boot.context.properties.ConfigurationProperties;
import java.time.Duration;
@ConfigurationProperties(prefix="security")
public record IdentityProperties(Jwt jwt, PasswordReset passwordReset, Mail mail) {
 public record Jwt(String secretBase64, Duration accessTtl, Duration refreshTtl) {}
 public record PasswordReset(String fingerprintSecretBase64) {}
 public record Mail(String from, String resetUrl) {}
}