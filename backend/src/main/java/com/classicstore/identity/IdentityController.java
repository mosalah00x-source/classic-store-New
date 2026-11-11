package com.classicstore.identity;
import com.classicstore.common.error.BusinessException;
import com.classicstore.identity.AddressRepository.AddressView;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Locale;
import java.time.Duration;
import jakarta.servlet.http.HttpServletRequest;
@RestController
@RequestMapping("/api/v1")
public class IdentityController {
 private final IdentityService service;private final TokenService tokens;private final IdentityRepository users;private final AddressRepository addresses;private final AuthRateLimiter rateLimiter;
 public IdentityController(IdentityService s,TokenService t,IdentityRepository u,AddressRepository a,AuthRateLimiter limiter){service=s;tokens=t;users=u;addresses=a;rateLimiter=limiter;}
 @PostMapping("/auth/register") ResponseEntity<IdentityDtos.UserResponse> register(@Valid @RequestBody IdentityDtos.RegisterRequest r){return ResponseEntity.status(201).body(view(service.register(r)));}
 @PostMapping("/auth/login") IdentityDtos.TokenResponse login(HttpServletRequest request,@Valid @RequestBody IdentityDtos.LoginRequest r){
  String key=request.getRemoteAddr()+":"+r.identifier().trim().toLowerCase(Locale.ROOT);
  if(!rateLimiter.allow("login:"+key,10,Duration.ofMinutes(15)))throw rateLimited();
  return service.issue(service.login(r));
 }
 @PostMapping("/auth/refresh") IdentityDtos.TokenResponse refresh(@RequestHeader(value="Authorization",required=false) String authorization){
  try{if(authorization==null||!authorization.startsWith("Bearer "))throw new IllegalArgumentException();Claims c=tokens.parse(authorization.substring(7));if(!"refresh".equals(c.get("typ",String.class)))throw new IllegalArgumentException();return service.issue(service.requireUser(tokens.subject(c)));}
  catch(Exception e){throw invalidToken();}
 }
 @PostMapping("/auth/logout") ResponseEntity<Void> logout(){return ResponseEntity.noContent().build();}
 @PostMapping("/auth/password/change") ResponseEntity<Void> change(Authentication a,@Valid @RequestBody IdentityDtos.ChangePasswordRequest r){service.changePassword(UUID.fromString(a.getName()),r);return ResponseEntity.ok().build();}
 @PostMapping("/auth/password/forgot") ResponseEntity<IdentityDtos.MessageResponse> forgot(HttpServletRequest request,@Valid @RequestBody IdentityDtos.ForgotRequest r){
  if(!rateLimiter.allow("forgot:"+r.email().trim().toLowerCase(Locale.ROOT),5,Duration.ofHours(1)))throw rateLimited();
  service.forgot(r);return ResponseEntity.accepted().body(new IdentityDtos.MessageResponse("If the account exists, password reset instructions will be sent."));
 }
 @PostMapping("/auth/password/reset") ResponseEntity<Void> reset(@RequestHeader("Authorization") String authorization,@Valid @RequestBody IdentityDtos.ResetRequest r){if(authorization==null||!authorization.startsWith("Bearer "))throw invalidToken();service.reset(authorization.substring(7),r.newPassword());return ResponseEntity.ok().build();}
 @GetMapping("/me") IdentityDtos.UserResponse me(Authentication a){return view(service.requireUser(UUID.fromString(a.getName())));}
 @PatchMapping("/me") IdentityDtos.UserResponse patchMe(Authentication a,@Valid @RequestBody IdentityDtos.ProfilePatchRequest r){
  UUID id=UUID.fromString(a.getName());users.updateProfile(id,r.firstName(),r.lastName(),r.phone());return view(service.requireUser(id));
 }
 @GetMapping("/me/addresses") List<AddressView> list(Authentication a){return addresses.list(UUID.fromString(a.getName()));}
 @Transactional @PostMapping("/me/addresses") ResponseEntity<AddressView> create(Authentication a,@Valid @RequestBody IdentityDtos.AddressRequest r){validateAddress(r);return ResponseEntity.status(201).body(addresses.create(UUID.fromString(a.getName()),r));}
 @GetMapping("/me/addresses/{id}") AddressView get(Authentication a,@PathVariable UUID id){return owned(a,id);}
 @Transactional @PutMapping("/me/addresses/{id}") AddressView put(Authentication a,@PathVariable UUID id,@Valid @RequestBody IdentityDtos.AddressRequest r){validateAddress(r);UUID user=UUID.fromString(a.getName());return addresses.update(user,id,r).orElseThrow(()->notFound());}
 @DeleteMapping("/me/addresses/{id}") ResponseEntity<Void> delete(Authentication a,@PathVariable UUID id){if(!addresses.delete(UUID.fromString(a.getName()),id))throw notFound();return ResponseEntity.noContent().build();}
 private AddressView owned(Authentication a,UUID id){return addresses.get(UUID.fromString(a.getName()),id).orElseThrow(()->notFound());}
 private void validateAddress(IdentityDtos.AddressRequest r){
  if(r.latitude()!=null&&(r.latitude() < -90||r.latitude()>90)||r.longitude()!=null&&(r.longitude() < -180||r.longitude()>180)||(r.latitude()==null)!=(r.longitude()==null))throw new BusinessException("VALIDATION_ERROR","بيانات الإدخال غير صحيحة","Invalid input data",HttpStatus.BAD_REQUEST,Map.of());
  if(r.countryCode().length()!=2||!addresses.countryEnabled(r.countryCode())
   ||!addresses.governorateBelongs(r.governorateId(),r.countryCode())
   ||!addresses.cityBelongs(r.cityId(),r.governorateId()))
   throw new BusinessException("VALIDATION_ERROR","بيانات الإدخال غير صحيحة","Invalid input data",HttpStatus.BAD_REQUEST,Map.of());
 }
 private static IdentityDtos.UserResponse view(UserRecord u){return new IdentityDtos.UserResponse(u.id().toString(),u.email(),u.phone(),u.firstName(),u.lastName(),u.role());}
 private static BusinessException notFound(){return new BusinessException("NOT_FOUND","المورد غير موجود","Resource not found",HttpStatus.NOT_FOUND,Map.of());}
 private static BusinessException rateLimited(){return new BusinessException("RATE_LIMITED","محاولات كثيرة، حاول لاحقًا","Too many requests, try again later",HttpStatus.TOO_MANY_REQUESTS,Map.of());}
 private static BusinessException invalidToken(){return new BusinessException("INVALID_TOKEN","رمز الدخول غير صالح أو منتهٍ","Invalid or expired token",HttpStatus.UNAUTHORIZED,Map.of());}
}