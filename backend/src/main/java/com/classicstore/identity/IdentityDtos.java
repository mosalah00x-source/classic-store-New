package com.classicstore.identity;
import jakarta.validation.constraints.*;
public final class IdentityDtos {
 private IdentityDtos(){}
 public record RegisterRequest(@Email String email,@Pattern(regexp="^\\+?[0-9]{7,24}$") String phone,@NotBlank @Size(min=10,max=72) String password,@NotBlank @Size(max=100) String firstName,@NotBlank @Size(max=100) String lastName){}
 public record LoginRequest(@NotBlank String identifier,@NotBlank String password){}
 public record RefreshRequest(@NotBlank String refreshToken){}
 public record ChangePasswordRequest(@NotBlank String currentPassword,@NotBlank @Size(min=10,max=72) String newPassword){}
 public record ForgotRequest(@Email @NotBlank String email){}
 public record ResetRequest(@NotBlank String token,@NotBlank @Size(min=10,max=72) String newPassword){}
 public record ProfilePatchRequest(@NotBlank @Size(max=100) String firstName,@NotBlank @Size(max=100) String lastName,@Pattern(regexp="^\\+?[0-9]{7,24}$") String phone){}
 public record AddressRequest(@NotBlank String recipientName,@NotBlank String phone,@NotBlank String countryCode,Long governorateId,Long cityId,String district,@NotBlank String street,String building,String apartment,String postalCode,Double latitude,Double longitude,boolean isDefault){}
 public record TokenResponse(String accessToken,String refreshToken,String tokenType,long expiresIn){}
 public record UserResponse(String id,String email,String phone,String firstName,String lastName,String role){}
 public record MessageResponse(String message){}
}