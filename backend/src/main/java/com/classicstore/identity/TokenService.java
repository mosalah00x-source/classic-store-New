package com.classicstore.identity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
@Service
public class TokenService {
 private final SecretKey key; private final IdentityProperties.Jwt cfg;
 public TokenService(IdentityProperties p){
  cfg=p.jwt();
  try { byte[] b=Base64.getDecoder().decode(cfg.secretBase64()); if(b.length<32)throw new IllegalArgumentException(); key=Keys.hmacShaKeyFor(b); }
  catch(Exception e){throw new IllegalStateException("security.jwt.secret-base64 must be a Base64-encoded secret of at least 32 bytes",e);}
 }
 public String issue(UserRecord u,String type){
  Instant now=Instant.now();var ttl=type.equals("access")?cfg.accessTtl():cfg.refreshTtl();
  return Jwts.builder().claims(Map.of("role",u.role(),"typ",type)).subject(u.id().toString())
   .issuedAt(Date.from(now)).expiration(Date.from(now.plus(ttl))).signWith(key).compact();
 }
 public Claims parse(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();}
 public UUID subject(Claims c){return UUID.fromString(c.getSubject());}
}