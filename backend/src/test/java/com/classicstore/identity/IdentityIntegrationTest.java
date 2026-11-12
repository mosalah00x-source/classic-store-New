package com.classicstore.identity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.time.Instant;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IdentityIntegrationTest {
 @Autowired MockMvc mvc;
 @Autowired ObjectMapper json;
 @Autowired JdbcTemplate jdbc;
 @Autowired TokenService tokens;
 @Autowired PasswordEncoder encoder;
 @Autowired PasswordResetTokenService resetTokens;

 private String registerAndLogin(String email)throws Exception{
  mvc.perform(post("/api/v1/auth/register").contentType(APPLICATION_JSON)
   .content("{\"email\":\""+email+"\",\"password\":\"StrongPassword#2026\",\"firstName\":\"Test\",\"lastName\":\"User\"}"))
   .andExpect(status().isCreated()).andExpect(jsonPath("$.role").value("CUSTOMER"));
  String body=mvc.perform(post("/api/v1/auth/login").contentType(APPLICATION_JSON)
   .content("{\"identifier\":\""+email+"\",\"password\":\"StrongPassword#2026\"}"))
   .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  return body;
 }

 private UserRecord userByEmail(String email){
  return jdbc.queryForObject("select * from store.users where email=?",(r,n)->new UserRecord(
   r.getObject("id",UUID.class),r.getString("email"),r.getString("phone"),r.getString("password_hash"),
   r.getString("first_name"),r.getString("last_name"),r.getString("role"),r.getBoolean("is_active")),email);
 }

 @Test void registerNeverAcceptsClientSuppliedRole()throws Exception{
  mvc.perform(post("/api/v1/auth/register").contentType(APPLICATION_JSON)
   .content("{\"email\":\"role-injection@example.test\",\"password\":\"StrongPassword#2026\",\"firstName\":\"A\",\"lastName\":\"B\",\"role\":\"ADMIN\"}"))
   .andExpect(status().isBadRequest());
  assertThat(jdbc.queryForObject("select count(*) from store.users where email='role-injection@example.test'",Integer.class)).isZero();
 }

 @Test void registerLoginRefreshLogoutAndMeFollowStatelessTokenRules()throws Exception{
  JsonNode pair=json.readTree(registerAndLogin("identity-flow@example.test"));
  String access=pair.get("accessToken").asText(),refresh=pair.get("refreshToken").asText();
  mvc.perform(get("/api/v1/me").header("Authorization","Bearer "+access)).andExpect(status().isOk())
   .andExpect(jsonPath("$.email").value("identity-flow@example.test"));
  mvc.perform(post("/api/v1/auth/refresh").header("Authorization","Bearer "+refresh))
   .andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").isNotEmpty());
  mvc.perform(post("/api/v1/auth/refresh").header("Authorization","Bearer "+access)).andExpect(status().isUnauthorized())
   .andExpect(jsonPath("$.code").value("INVALID_TOKEN"));
  mvc.perform(post("/api/v1/auth/logout").header("Authorization","Bearer "+access)).andExpect(status().isNoContent());
  mvc.perform(post("/api/v1/auth/refresh").header("Authorization","Bearer "+refresh)).andExpect(status().isOk());
 }

 @Test void profilePatchLeavesOmittedFieldsUnchanged()throws Exception{
  JsonNode pair=json.readTree(registerAndLogin("profile-patch@example.test"));
  mvc.perform(patch("/api/v1/me").header("Authorization","Bearer "+pair.get("accessToken").asText())
   .contentType(APPLICATION_JSON).content("{\"firstName\":\"Updated\"}"))
   .andExpect(status().isOk()).andExpect(jsonPath("$.firstName").value("Updated"))
   .andExpect(jsonPath("$.lastName").value("User"));
 }

 @Test void passwordChangeDoesNotInvalidateExistingRefreshToken()throws Exception{
  JsonNode pair=json.readTree(registerAndLogin("password-change@example.test"));
  String access=pair.get("accessToken").asText(),refresh=pair.get("refreshToken").asText();
  mvc.perform(post("/api/v1/auth/password/change").header("Authorization","Bearer "+access)
   .contentType(APPLICATION_JSON).content("{\"currentPassword\":\"StrongPassword#2026\",\"newPassword\":\"AnotherStrong#2026\"}"))
   .andExpect(status().isOk());
  mvc.perform(post("/api/v1/auth/refresh").header("Authorization","Bearer "+refresh)).andExpect(status().isOk());
 }

 @Test void forgotPasswordAlwaysReturnsSameAcceptedResponse()throws Exception{
  String unknown=mvc.perform(post("/api/v1/auth/password/forgot").contentType(APPLICATION_JSON)
   .content("{\"email\":\"unknown@example.test\"}")).andExpect(status().isAccepted()).andReturn().getResponse().getContentAsString();
  registerAndLogin("known-forgot@example.test");
  String known=mvc.perform(post("/api/v1/auth/password/forgot").contentType(APPLICATION_JSON)
   .content("{\"email\":\"known-forgot@example.test\"}")).andExpect(status().isAccepted()).andReturn().getResponse().getContentAsString();
  assertThat(known).isEqualTo(unknown);
 }

 @Test void loginAndForgotRateLimitsUseSrsThresholds()throws Exception{
  for(int i=0;i<10;i++)mvc.perform(post("/api/v1/auth/login").contentType(APPLICATION_JSON)
   .content("{\"identifier\":\"throttle@example.test\",\"password\":\"wrong-password\"}"))
   .andExpect(status().isUnauthorized());
  mvc.perform(post("/api/v1/auth/login").contentType(APPLICATION_JSON)
   .content("{\"identifier\":\"throttle@example.test\",\"password\":\"wrong-password\"}"))
   .andExpect(status().isTooManyRequests()).andExpect(jsonPath("$.code").value("RATE_LIMITED"));

  for(int i=0;i<5;i++)mvc.perform(post("/api/v1/auth/password/forgot").contentType(APPLICATION_JSON)
   .content("{\"email\":\"forgot-throttle@example.test\"}")).andExpect(status().isAccepted());
  mvc.perform(post("/api/v1/auth/password/forgot").contentType(APPLICATION_JSON)
   .content("{\"email\":\"forgot-throttle@example.test\"}"))
   .andExpect(status().isTooManyRequests()).andExpect(jsonPath("$.code").value("RATE_LIMITED"));
 }

 @Test void customerCanCreateReadUpdateAndDeleteOwnAddress()throws Exception{
  JsonNode pair=json.readTree(registerAndLogin("address-crud@example.test"));
  String token=pair.get("accessToken").asText();
  String body="{\"recipientName\":\"Test Recipient\",\"phone\":\"201000000000\",\"countryCode\":\"EG\",\"street\":\"First Street\",\"isDefault\":true}";
  String created=mvc.perform(post("/api/v1/me/addresses").header("Authorization","Bearer "+token)
   .contentType(APPLICATION_JSON).content(body)).andExpect(status().isCreated())
   .andExpect(jsonPath("$.street").value("First Street")).andReturn().getResponse().getContentAsString();
  String id=json.readTree(created).get("id").asText();
  mvc.perform(get("/api/v1/me/addresses").header("Authorization","Bearer "+token))
   .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1));
  mvc.perform(get("/api/v1/me/addresses/"+id).header("Authorization","Bearer "+token))
   .andExpect(status().isOk()).andExpect(jsonPath("$.isDefault").value(true));
  mvc.perform(put("/api/v1/me/addresses/"+id).header("Authorization","Bearer "+token)
   .contentType(APPLICATION_JSON).content("{\"recipientName\":\"Test Recipient\",\"phone\":\"201000000000\",\"countryCode\":\"EG\",\"street\":\"Updated Street\",\"isDefault\":true}"))
   .andExpect(status().isOk()).andExpect(jsonPath("$.street").value("Updated Street"));
  mvc.perform(delete("/api/v1/me/addresses/"+id).header("Authorization","Bearer "+token))
   .andExpect(status().isNoContent());
  mvc.perform(get("/api/v1/me/addresses/"+id).header("Authorization","Bearer "+token))
   .andExpect(status().isNotFound());
 }

 @Test void foreignAddressIsNotReadableWritableOrDeletable()throws Exception{
  UUID owner=UUID.randomUUID(),other=UUID.randomUUID(),address=UUID.randomUUID();
  jdbc.update("insert into store.users(id,email,password_hash,first_name,last_name) values (?,?,?,?,?)",owner,"owner-"+owner+"@example.test",encoder.encode("StrongPassword#2026"),"Owner","One");
  jdbc.update("insert into store.users(id,email,password_hash,first_name,last_name) values (?,?,?,?,?)",other,"other-"+other+"@example.test",encoder.encode("StrongPassword#2026"),"Other","Two");
  jdbc.update("insert into store.addresses(id,user_id,recipient_name,phone,country_code,street) values (?,?,?,?,?,?)",address,owner,"Owner","201000000000","EG","Main street");
  UserRecord user=new UserRecord(other,null,null,null,"Other","Two","CUSTOMER",true);
  String token=tokens.issue(user,"access");
  mvc.perform(get("/api/v1/me/addresses/"+address).header("Authorization","Bearer "+token)).andExpect(status().isNotFound());
  mvc.perform(put("/api/v1/me/addresses/"+address).header("Authorization","Bearer "+token)
   .contentType(APPLICATION_JSON).content("{\"recipientName\":\"Other\",\"phone\":\"201000000001\",\"countryCode\":\"EG\",\"street\":\"Changed\",\"isDefault\":false}"))
   .andExpect(status().isNotFound());
  mvc.perform(delete("/api/v1/me/addresses/"+address).header("Authorization","Bearer "+token)).andExpect(status().isNotFound());
  assertThat(jdbc.queryForObject("select count(*) from store.addresses where id=?",Integer.class,address)).isEqualTo(1);
 }

 @Test void nonCustomerRoleCannotAccessCustomerAccountEndpoints()throws Exception{
  String token=tokens.issue(new UserRecord(UUID.randomUUID(),null,null,null,"Warehouse","User","WAREHOUSE",true),"access");
  mvc.perform(get("/api/v1/me").header("Authorization","Bearer "+token)).andExpect(status().isForbidden());
 }

 @Test void malformedBearerTokenReturnsInvalidToken()throws Exception{
  mvc.perform(get("/api/v1/me").header("Authorization","Bearer not-a-valid-jwt"))
   .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_TOKEN"));
 }

 @Test void accessAndRefreshTokenLifetimesMatchSrs(){
  UserRecord u=new UserRecord(UUID.randomUUID(),"ttl@example.test",null,"hash","TTL","User","CUSTOMER",true);
  var access=tokens.parse(tokens.issue(u,"access"));
  var refresh=tokens.parse(tokens.issue(u,"refresh"));
  assertThat(access.getExpiration().getTime()-access.getIssuedAt().getTime()).isEqualTo(900000L);
  assertThat(refresh.getExpiration().getTime()-refresh.getIssuedAt().getTime()).isEqualTo(604800000L);
 }

 @Test void resetFingerprintAllowsReuseUntilPasswordHashChanges(){
  UserRecord u=new UserRecord(UUID.randomUUID(),"reset@example.test",null,"$2a$12$oldhash","Reset","User","CUSTOMER",true);
  String token=resetTokens.issue(u);
  String decoded=new String(java.util.Base64.getUrlDecoder().decode(token),java.nio.charset.StandardCharsets.UTF_8);
  assertThat(decoded).doesNotContain(u.passwordHash());
  assertThat(resetTokens.verify(token,u)).isTrue();
  assertThat(resetTokens.verify(token,u)).isTrue();
  UserRecord changed=new UserRecord(u.id(),u.email(),null,"$2a$12$newhash","Reset","User","CUSTOMER",true);
  assertThat(resetTokens.verify(token,changed)).isFalse();
 }

 @Test void resetFingerprintRejectsExpiredToken(){
  UserRecord u=new UserRecord(UUID.randomUUID(),"expired@example.test",null,"hash","Expired","User","CUSTOMER",true);
  String expired=resetTokens.issue(u,Instant.now().minusSeconds(1));
  assertThat(resetTokens.verify(expired,u)).isFalse();
 }
 @Test void passwordResetEndpointChangesPasswordSuccessfully()throws Exception{
  String email="reset-success@example.test";
  registerAndLogin(email);
  UserRecord before=userByEmail(email);
  String resetToken=resetTokens.issue(before);
  mvc.perform(post("/api/v1/auth/password/reset").header("Authorization","Bearer "+resetToken)
   .contentType(APPLICATION_JSON).content(json.writeValueAsString(java.util.Map.of("newPassword","ResetPassword#2026"))))
   .andExpect(status().isOk());
  String updatedHash=jdbc.queryForObject("select password_hash from store.users where id=?",String.class,before.id());
  assertThat(updatedHash).isNotEqualTo(before.passwordHash());
  assertThat(encoder.matches("ResetPassword#2026",updatedHash)).isTrue();
  assertThat(encoder.matches("StrongPassword#2026",updatedHash)).isFalse();
 }

 @Test void passwordResetEndpointRejectsReplayAfterSuccessfulReset()throws Exception{
  String email="reset-replay@example.test";
  registerAndLogin(email);
  UserRecord before=userByEmail(email);
  String resetToken=resetTokens.issue(before);
  mvc.perform(post("/api/v1/auth/password/reset").header("Authorization","Bearer "+resetToken)
   .contentType(APPLICATION_JSON).content(json.writeValueAsString(java.util.Map.of("newPassword","FirstResetPassword#2026"))))
   .andExpect(status().isOk());
  String hashAfterSuccess=jdbc.queryForObject("select password_hash from store.users where id=?",String.class,before.id());
  mvc.perform(post("/api/v1/auth/password/reset").header("Authorization","Bearer "+resetToken)
   .contentType(APPLICATION_JSON).content(json.writeValueAsString(java.util.Map.of("newPassword","ReplayResetPassword#2026"))))
   .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_TOKEN"));
  String hashAfterReplay=jdbc.queryForObject("select password_hash from store.users where id=?",String.class,before.id());
  assertThat(hashAfterReplay).isEqualTo(hashAfterSuccess);
  assertThat(encoder.matches("FirstResetPassword#2026",hashAfterReplay)).isTrue();
 }

 @Test void passwordResetEndpointRejectsExpiredTokenOverHttp()throws Exception{
  String email="reset-expired-http@example.test";
  registerAndLogin(email);
  UserRecord before=userByEmail(email);
  String expiredToken=resetTokens.issue(before,Instant.now().minusSeconds(1));
  mvc.perform(post("/api/v1/auth/password/reset").header("Authorization","Bearer "+expiredToken)
   .contentType(APPLICATION_JSON).content(json.writeValueAsString(java.util.Map.of("newPassword","ExpiredResetPassword#2026"))))
   .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_TOKEN"));
  String unchangedHash=jdbc.queryForObject("select password_hash from store.users where id=?",String.class,before.id());
  assertThat(unchangedHash).isEqualTo(before.passwordHash());
  assertThat(encoder.matches("StrongPassword#2026",unchangedHash)).isTrue();
 }

}