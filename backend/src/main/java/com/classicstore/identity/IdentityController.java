package com.classicstore.identity;
import com.classicstore.common.error.BusinessException;
import com.classicstore.identity.AddressRepository.AddressView;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1")
public class IdentityController {
 private final IdentityService service;private final TokenService tokens;private final IdentityRepository users;private final AddressRepository addresses;
 public IdentityController(IdentityService s,TokenService t,IdentityRepository u,AddressRepository a){service=s;tokens=t;users=u;addresses=a;}
 @PostMapping("/auth/register") ResponseEntity<IdentityDtos.UserResponse> register(@Valid @RequestBody IdentityDtos.RegisterRequest r){return ResponseEntity.status(201).body(view(service.register(r)));}
 @PostMapping("/auth/login") IdentityDtos.TokenResponse login(@Valid @RequestBody IdentityDtos.LoginRequest r){return service.issue(service.login(r));}
 @PostMapping("/auth/refresh") IdentityDtos.TokenResponse refresh(@RequestBody IdentityDtos.RefreshRequest r){
  try{Claims c=tokens.parse(r.refreshToken());if(!"refresh".equals(c.get("typ",String.class)))throw new IllegalArgumentException();return service.issue(service.requireUser(tokens.subject(c)));}
  catch(BusinessException e){throw e;}catch(Exception e){throw invalidToken();}
 }
 @PostMapping("/auth/logout") ResponseEntity<Void> logout(){return ResponseEntity.noContent().build();}
 @PostMapping("/auth/password/change") ResponseEntity<Void> change(Authentication a,@Valid @RequestBody IdentityDtos.ChangePasswordRequest r){service.changePassword(UUID.fromString(a.getName()),r);return ResponseEntity.ok().build();}
 @PostMapping("/auth/password/forgot") ResponseEntity<IdentityDtos.MessageResponse> forgot(@Valid @RequestBody IdentityDtos.ForgotRequest r){service.forgot(r);return ResponseEntity.accepted().body(new IdentityDtos.MessageResponse("If the account exists, password reset instructions will be sent."));}
 @PostMapping("/auth/password/reset") ResponseEntity<Void> reset(@Valid @RequestBody IdentityDtos.ResetRequest r){service.reset(r);return ResponseEntity.ok().build();}
 @GetMapping("/me") IdentityDtos.UserResponse me(Authentication a){return view(service.requireUser(UUID.fromString(a.getName())));}
 @PatchMapping("/me") IdentityDtos.UserResponse patchMe(Authentication a,@Valid @RequestBody IdentityDtos.ProfilePatchRequest r){
  UUID id=UUID.fromString(a.getName());users.updateProfile(id,r.firstName(),r.lastName(),r.phone());return view(service.requireUser(id));
 }
 @GetMapping("/me/addresses") List<AddressView> list(Authentication a){return addresses.list(UUID.fromString(a.getName()));}
 @PostMapping("/me/addresses") ResponseEntity<AddressView> create(Authentication a,@Valid @RequestBody IdentityDtos.AddressRequest r){validateAddress(r);return ResponseEntity.status(201).body(addresses.create(UUID.fromString(a.getName()),r));}
 @GetMapping("/me/addresses/{id}") AddressView get(Authentication a,@PathVariable UUID id){return owned(a,id);}
 @PutMapping("/me/addresses/{id}") AddressView put(Authentication a,@PathVariable UUID id,@Valid @RequestBody IdentityDtos.AddressRequest r){validateAddress(r);UUID user=UUID.fromString(a.getName());return addresses.update(user,id,r).orElseThrow(()->notFound());}
 @DeleteMapping("/me/addresses/{id}") ResponseEntity<Void> delete(Authentication a,@PathVariable UUID id){if(!addresses.delete(UUID.fromString(a.getName()),id))throw notFound();return ResponseEntity.noContent().build();}
 private AddressView owned(Authentication a,UUID id){return addresses.get(UUID.fromString(a.getName()),id).orElseThrow(()->notFound());}
 private static void validateAddress(IdentityDtos.AddressRequest r){
  if(r.latitude()!=null&&(r.latitude() < -90||r.latitude()>90)||r.longitude()!=null&&(r.longitude() < -180||r.longitude()>180)||(r.latitude()==null)!=(r.longitude()==null))throw new BusinessException("VALIDATION_ERROR","بيانات الإدخال غير صحيحة","Invalid input data",HttpStatus.BAD_REQUEST,Map.of());
  if(r.countryCode().length()!=2)throw new BusinessException("VALIDATION_ERROR","بيانات الإدخال غير صحيحة","Invalid input data",HttpStatus.BAD_REQUEST,Map.of());
 }
 private static IdentityDtos.UserResponse view(UserRecord u){return new IdentityDtos.UserResponse(u.id().toString(),u.email(),u.phone(),u.firstName(),u.lastName(),u.role());}
 private static BusinessException notFound(){return new BusinessException("NOT_FOUND","المورد غير موجود","Resource not found",HttpStatus.NOT_FOUND,Map.of());}
 private static BusinessException invalidToken(){return new BusinessException("INVALID_TOKEN","رمز الدخول غير صالح أو منتهٍ","Invalid or expired token",HttpStatus.UNAUTHORIZED,Map.of());}
}