package com.classicstore.identity;

import org.junit.jupiter.api.Test;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class IdentityOpenApiContractTest {
 @Test void allFourteenIdentityOperationsRemainInOpenApiBaseline() throws Exception {
  String yaml=Files.readString(Path.of("../docs/api/openapi.yaml"));
  List<String> operationIds=yaml.lines()
   .filter(line->line.trim().startsWith("operationId:"))
   .map(line->line.substring(line.indexOf(':')+1).trim()).toList();
  assertThat(operationIds).contains(
   "postAuthRegister","postAuthLogin","postAuthRefresh","postAuthLogout",
   "postAuthPasswordChange","postAuthPasswordForgot","postAuthPasswordReset",
   "getMe","patchMe","getMeAddresses","postMeAddresses","getMeAddressesId",
   "putMeAddressesId","deleteMeAddressesId");
  assertThat(yaml).contains(
   "RegisterRequest","LoginRequest","ChangePasswordRequest","ForgotPasswordRequest",
   "ResetPasswordRequest","ProfilePatchRequest","AddressRequest","UserResponse",
   "TokenResponse","ForgotPasswordResponse","AddressList");
 }
}