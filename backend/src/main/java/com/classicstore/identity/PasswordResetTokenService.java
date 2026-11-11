package com.classicstore.identity;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
@Service
public class PasswordResetTokenService {
 private final byte[] key;
 public PasswordResetTokenService(IdentityProperties p){
  try{key=Base64.getDecoder().decode(p.passwordReset().fingerprintSecretBase64());if(key.length<32)throw new IllegalArgumentException();}
  catch(Exception e){throw new IllegalStateException("security.password-reset.fingerprint-secret-base64 must be Base64-encoded and at least 32 bytes",e);}
 }
 public String issue(UserRecord u){
  long exp=Instant.now().plusSeconds(900).getEpochSecond();
  String payload=u.id()+"."+exp;
  return Base64.getUrlEncoder().withoutPadding().encodeToString((payload+"."+mac(payload+"."+u.passwordHash())).getBytes(StandardCharsets.UTF_8));
 }
 public boolean verify(String token,UserRecord u){
  try{
   String decoded=new String(Base64.getUrlDecoder().decode(token),StandardCharsets.UTF_8);
   String[] p=decoded.split("\\.",3);if(p.length!=3||!UUID.fromString(p[0]).equals(u.id()))return false;
   long exp=Long.parseLong(p[1]);if(Instant.now().getEpochSecond()>exp)return false;
   return MessageDigest.isEqual(p[2].getBytes(StandardCharsets.US_ASCII),mac(p[0]+"."+p[1]+"."+u.passwordHash()).getBytes(StandardCharsets.US_ASCII));
  }catch(Exception e){return false;}
 }
 private String mac(String value)throws Exception{
  Mac m=Mac.getInstance("HmacSHA256");m.init(new SecretKeySpec(key,"HmacSHA256"));
  return Base64.getUrlEncoder().withoutPadding().encodeToString(m.doFinal(value.getBytes(StandardCharsets.UTF_8)));
 }
}