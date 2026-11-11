package com.classicstore.identity;
import com.classicstore.common.error.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.UUID;
@Service
public class IdentityService {
 private final IdentityRepository users;private final PasswordEncoder passwords;private final TokenService tokens;
 private final PasswordResetTokenService resets;private final PasswordResetMailer mailer;private final IdentityProperties props;
 public IdentityService(IdentityRepository u,PasswordEncoder p,TokenService t,PasswordResetTokenService r,PasswordResetMailer m,IdentityProperties props){users=u;passwords=p;tokens=t;resets=r;mailer=m;this.props=props;}
 @Transactional public UserRecord register(IdentityDtos.RegisterRequest r){
  if((r.email()==null||r.email().isBlank())&&(r.phone()==null||r.phone().isBlank()))throw err("EMAIL_OR_PHONE_REQUIRED",400);
  if(r.email()!=null&&users.emailExists(r.email()))throw err("EMAIL_ALREADY_REGISTERED",409);
  if(r.phone()!=null&&users.phoneExists(r.phone()))throw err("PHONE_ALREADY_REGISTERED",409);
  try{return users.create(blank(r.email()),blank(r.phone()),passwords.encode(r.password()),r.firstName(),r.lastName());}
  catch(org.springframework.dao.DuplicateKeyException e){throw err(r.email()!=null?"EMAIL_ALREADY_REGISTERED":"PHONE_ALREADY_REGISTERED",409);}
 }
 public UserRecord login(IdentityDtos.LoginRequest r){
  UserRecord u=users.byIdentifier(r.identifier()).orElseThrow(()->err("INVALID_CREDENTIALS",401));
  if(!u.active()||u.passwordHash()==null||!passwords.matches(r.password(),u.passwordHash()))throw err("INVALID_CREDENTIALS",401);
  return u;
 }
 public IdentityDtos.TokenResponse issue(UserRecord u){return new IdentityDtos.TokenResponse(tokens.issue(u,"access"),tokens.issue(u,"refresh"),"Bearer",props.jwt().accessTtl().toSeconds());}
 public UserRecord requireUser(UUID id){return users.byId(id).filter(UserRecord::active).orElseThrow(()->err("UNAUTHENTICATED",401));}
 @Transactional public void changePassword(UUID id,IdentityDtos.ChangePasswordRequest r){
  UserRecord u=requireUser(id);if(!passwords.matches(r.currentPassword(),u.passwordHash()))throw err("INVALID_CREDENTIALS",401);
  if(!users.updatePasswordIfCurrent(id,u.passwordHash(),passwords.encode(r.newPassword())))throw err("INVALID_CREDENTIALS",401);
 }
 public void forgot(IdentityDtos.ForgotRequest r){
  users.byIdentifier(r.email()).filter(u->u.active()&&u.email()!=null).ifPresent(u->{try{mailer.send(u.email(),resets.issue(u));}catch(Exception ignored){/* Never disclose account existence. Delivery failure is monitored by mail infrastructure. */}});
 }
 @Transactional public void reset(String token,String newPassword){
  UUID id;
  try{
   String decoded=new String(java.util.Base64.getUrlDecoder().decode(token),java.nio.charset.StandardCharsets.UTF_8);
   id=UUID.fromString(decoded.split("\\.",3)[0]);
  }catch(Exception e){throw err("INVALID_TOKEN",401);}
  UserRecord u=users.byId(id).orElseThrow(()->err("INVALID_TOKEN",401));
  if(!resets.verify(token,u))throw err("INVALID_TOKEN",401);
  if(!users.updatePasswordIfCurrent(id,u.passwordHash(),passwords.encode(newPassword)))throw err("INVALID_TOKEN",401);
 }
 private static String blank(String s){return s==null||s.isBlank()?null:s;}
 private static BusinessException err(String code,int status){
  String ar=switch(code){case "EMAIL_OR_PHONE_REQUIRED"->"مطلوب بريد إلكتروني أو رقم هاتف";case "EMAIL_ALREADY_REGISTERED"->"البريد الإلكتروني مسجل مسبقًا";case "PHONE_ALREADY_REGISTERED"->"رقم الهاتف مسجل مسبقًا";case "INVALID_CREDENTIALS"->"البريد الإلكتروني أو كلمة المرور غير صحيحة";case "INVALID_TOKEN"->"رمز الدخول غير صالح أو منتهٍ";case "UNAUTHENTICATED"->"يجب تسجيل الدخول";default->"بيانات الإدخال غير صحيحة";};
  String en=switch(code){case "EMAIL_OR_PHONE_REQUIRED"->"Email or phone is required";case "EMAIL_ALREADY_REGISTERED"->"Email is already registered";case "PHONE_ALREADY_REGISTERED"->"Phone is already registered";case "INVALID_CREDENTIALS"->"Invalid email or password";case "INVALID_TOKEN"->"Invalid or expired token";case "UNAUTHENTICATED"->"Authentication required";default->"Invalid input data";};
  return new BusinessException(code,ar,en,HttpStatus.valueOf(status),Map.of());
 }
}